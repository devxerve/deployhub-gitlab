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

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  private async instantQuery(promql: string): Promise<number | null> {
    try {
      const url = `${PROM_URL}/api/v1/query?${new URLSearchParams({ query: promql })}`;
      const res = await fetch(url);
      if (!res.ok) return null;
      const body = await res.json();
      const result = body?.data?.result;
      if (!result || result.length === 0) return null;
      const value = parseFloat(result[0].value[1]);
      return Number.isFinite(value) ? value : null;
    } catch (err) {
      this.logger.warn(`Prometheus query failed: "${promql}" — ${err}`);
      return null;
    }
  }

  private async rangeQuery(
    promql: string,
    startSec: number,
    endSec: number,
    stepSec: number,
  ): Promise<[number, number][]> {
    try {
      const params = new URLSearchParams({
        query: promql,
        start: String(startSec),
        end: String(endSec),
        step: String(stepSec),
      });
      const res = await fetch(`${PROM_URL}/api/v1/query_range?${params}`);
      if (!res.ok) return [];
      const body = await res.json();
      const result = body?.data?.result;
      if (!result || result.length === 0) return [];
      return result[0].values.map(([ts, v]: [number, string]) => [
        ts,
        parseFloat(v),
      ]);
    } catch (err) {
      this.logger.warn(`Prometheus range query failed: "${promql}" — ${err}`);
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
      memUsedBytes != null && memLimitBytes
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

    const memByTs = new Map(memSeries.map(([ts, v]) => [ts, v]));

    return cpuSeries
      .filter(([, cpu]) => Number.isFinite(cpu))
      .map(([ts, cpu]) => ({
        hour: new Date(ts * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        cpu: Math.round(cpu * 10) / 10,
        mem: Math.round((memByTs.get(ts) ?? 0) * 10) / 10,
      }));
  }
}
