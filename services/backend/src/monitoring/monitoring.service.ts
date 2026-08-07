import { Injectable, Logger } from "@nestjs/common";

const PROM_URL = process.env.PROMETHEUS_URL;

export interface OverviewMetrics {
  cpuPct: number | null;
  memPct: number | null;
  memUsedBytes: number | null;
  memLimitBytes: number | null;
  netIoBytesPerSec: number | null;
  requestsPerMin: number | null;
  latencyP95Ms: number | null;
  uptimeSeconds: number;
}

export interface HistoryPoint {
  hour: string;
  cpu: number;
  mem: number;
}

export interface ActiveAlert {
  id: string;
  severity: string;
  message: string;
  startsAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function errorToString(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function parseJsonResponse(response: Response): Promise<unknown> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  return JSON.parse(text) as unknown;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  private readonly activeAlerts = new Map<string, ActiveAlert>();

  /** Handles the webhook Alertmanager posts on every firing/resolved alert group. */
  receiveAlertWebhook(payload: unknown): void {
    if (!isRecord(payload) || !isUnknownArray(payload.alerts)) {
      return;
    }

    for (const raw of payload.alerts) {
      if (!isRecord(raw)) continue;

      const labels = isRecord(raw.labels) ? raw.labels : {};
      const annotations = isRecord(raw.annotations) ? raw.annotations : {};
      const alertname =
        typeof labels.alertname === "string" ? labels.alertname : "alert";
      const fingerprint =
        typeof raw.fingerprint === "string" ? raw.fingerprint : alertname;

      if (raw.status === "resolved") {
        this.activeAlerts.delete(fingerprint);
        continue;
      }

      this.activeAlerts.set(fingerprint, {
        id: fingerprint,
        severity:
          typeof labels.severity === "string" ? labels.severity : "warning",
        message:
          typeof annotations.summary === "string"
            ? annotations.summary
            : alertname,
        startsAt:
          typeof raw.startsAt === "string"
            ? raw.startsAt
            : new Date().toISOString(),
      });
    }
  }

  getActiveAlerts(): ActiveAlert[] {
    return Array.from(this.activeAlerts.values()).sort(
      (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime(),
    );
  }

  private async instantQuery(promql: string): Promise<number | null> {
    if (!PROM_URL) {
      this.logger.warn("PROMETHEUS_URL is not configured");

      return null;
    }

    try {
      const params = new URLSearchParams({
        query: promql,
      });

      const response = await fetch(`${PROM_URL}/api/v1/query?${params}`);

      if (!response.ok) {
        return null;
      }

      const body = await parseJsonResponse(response);

      if (!isRecord(body)) {
        return null;
      }

      const data = body.data;

      if (!isRecord(data)) {
        return null;
      }

      const result = data.result;

      if (!isUnknownArray(result) || result.length === 0) {
        return null;
      }

      const firstResult = result[0];

      if (!isRecord(firstResult)) {
        return null;
      }

      const value = firstResult.value;

      if (!isUnknownArray(value) || value.length < 2) {
        return null;
      }

      const rawValue = value[1];

      if (typeof rawValue !== "string" && typeof rawValue !== "number") {
        return null;
      }

      const numericValue = Number.parseFloat(String(rawValue));

      return Number.isFinite(numericValue) ? numericValue : null;
    } catch (error: unknown) {
      this.logger.warn(
        `Prometheus query failed: "${promql}" — ${errorToString(error)}`,
      );

      return null;
    }
  }

  private async rangeQuery(
    promql: string,
    startSec: number,
    endSec: number,
    stepSec: number,
  ): Promise<[number, number][]> {
    if (!PROM_URL) {
      this.logger.warn("PROMETHEUS_URL is not configured");

      return [];
    }

    try {
      const params = new URLSearchParams({
        query: promql,
        start: String(startSec),
        end: String(endSec),
        step: String(stepSec),
      });

      const response = await fetch(`${PROM_URL}/api/v1/query_range?${params}`);

      if (!response.ok) {
        return [];
      }

      const body = await parseJsonResponse(response);

      if (!isRecord(body)) {
        return [];
      }

      const data = body.data;

      if (!isRecord(data)) {
        return [];
      }

      const result = data.result;

      if (!isUnknownArray(result) || result.length === 0) {
        return [];
      }

      const firstResult = result[0];

      if (!isRecord(firstResult)) {
        return [];
      }

      const values = firstResult.values;

      if (!isUnknownArray(values)) {
        return [];
      }

      const points: [number, number][] = [];

      for (const point of values) {
        if (!isUnknownArray(point) || point.length < 2) {
          continue;
        }

        const rawTimestamp = point[0];

        const rawValue = point[1];

        const timestamp =
          typeof rawTimestamp === "number"
            ? rawTimestamp
            : typeof rawTimestamp === "string"
              ? Number.parseFloat(rawTimestamp)
              : Number.NaN;

        const value =
          typeof rawValue === "number"
            ? rawValue
            : typeof rawValue === "string"
              ? Number.parseFloat(rawValue)
              : Number.NaN;

        if (Number.isFinite(timestamp) && Number.isFinite(value)) {
          points.push([timestamp, value]);
        }
      }

      return points;
    } catch (error: unknown) {
      this.logger.warn(
        `Prometheus range query failed: "${promql}" — ${errorToString(error)}`,
      );

      return [];
    }
  }

  async getOverview(): Promise<OverviewMetrics> {
    const [
      cpuPct,
      memUsedBytes,
      memLimitBytes,
      netIoBytesPerSec,
      requestsPerMin,
      latencyP95Ms,
    ] = await Promise.all([
      this.instantQuery(
        '(sum(rate(container_cpu_usage_seconds_total{id="/"}[1m])) / scalar(machine_cpu_cores)) * 100',
      ),

      this.instantQuery('container_memory_usage_bytes{id="/"}'),

      this.instantQuery("machine_memory_bytes"),

      this.instantQuery(
        'sum(rate(container_network_receive_bytes_total{id="/",interface="eth0"}[1m]) + rate(container_network_transmit_bytes_total{id="/",interface="eth0"}[1m]))',
      ),

      this.instantQuery(
        'sum(rate(http_request_duration_seconds_count{job="backend"}[1m])) * 60',
      ),

      this.instantQuery(
        'histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket{job="backend"}[5m])) by (le)) * 1000',
      ),
    ]);

    const memPct =
      memUsedBytes !== null && memLimitBytes !== null && memLimitBytes > 0
        ? (memUsedBytes / memLimitBytes) * 100
        : null;

    return {
      cpuPct,
      memPct,
      memUsedBytes,
      memLimitBytes,
      netIoBytesPerSec,
      requestsPerMin,
      latencyP95Ms,
      uptimeSeconds: Math.round(process.uptime()),
    };
  }

  async getHistory(hours = 24): Promise<HistoryPoint[]> {
    const end = Math.floor(Date.now() / 1000);

    const start = end - hours * 3600;

    const step = Math.max(60, Math.floor((hours * 3600) / 48));

    const [cpuSeries, memSeries] = await Promise.all([
      this.rangeQuery(
        '(sum(rate(container_cpu_usage_seconds_total{id="/"}[5m])) / scalar(machine_cpu_cores)) * 100',
        start,
        end,
        step,
      ),

      this.rangeQuery(
        '(container_memory_usage_bytes{id="/"} / scalar(machine_memory_bytes)) * 100',
        start,
        end,
        step,
      ),
    ]);

    const memByTs = new Map(
      memSeries.map(([timestamp, value]) => [timestamp, value]),
    );

    return cpuSeries
      .filter(([, cpu]) => Number.isFinite(cpu))
      .map(([timestamp, cpu]) => ({
        hour: new Date(timestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        cpu: Math.round(cpu * 10) / 10,

        mem: Math.round((memByTs.get(timestamp) ?? 0) * 10) / 10,
      }));
  }
}
