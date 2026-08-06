"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";
import { Card, Bar } from "@/components/ui";
import { MetricsChart } from "@/components/charts";
import { getMonitoringOverview, getMonitoringHistory, OverviewMetrics, HistoryPoint } from "@/lib/api";
import {
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

function formatBytes(bytes: number | null): string {
  if (bytes == null || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

export function MonitoringModule({ t }: { t: Theme }) {
  const [overview, setOverview] = useState<OverviewMetrics | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    let active = true;
    const fetchMetrics = async () => {
      try {
        const [o, h] = await Promise.all([getMonitoringOverview(), getMonitoringHistory(24)]);
        if (active) {
          setOverview(o);
          setHistory(h);
        }
      } catch (err) {
        console.error("Failed to load monitoring metrics", err);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 5000);
    return () => { active = false; clearInterval(interval); };
  }, []);

  const live = overview || {
    cpuPct: 0,
    memPct: 0,
    memUsedBytes: 0,
    memLimitBytes: 0,
    netIoBytesPerSec: 0,
    requestsPerMin: 0,
    latencyP95Ms: 0,
    uptimeSeconds: 0,
  };

  const metrics = [
    { label: "CPU Usage",    value: `${Math.round(live.cpuPct || 0)}%`,    sub: "System avg",    color: "#3b82f6", w: live.cpuPct || 0 },
    { label: "Memory",       value: `${Math.round(live.memPct || 0)}%`,    sub: `${formatBytes(live.memUsedBytes)} / ${formatBytes(live.memLimitBytes)}`, color: "#a855f7", w: live.memPct || 0 },
    { label: "Network I/O",  value: `${formatBytes(live.netIoBytesPerSec)}/s`, sub: "eth0", color: "#22c55e", w: Math.min(100, ((live.netIoBytesPerSec || 0) / (100 * 1024 * 1024)) * 100) }, // arbitrary 100MB max for bar
    { label: "Requests/min", value: String(Math.round(live.requestsPerMin || 0)),  sub: "API traffic",   color: "#06b6d4", w: Math.min(100, (live.requestsPerMin || 0) / 20) },
    { label: "Latency P95",  value: `${Math.round(live.latencyP95Ms || 0)}ms`,   sub: "SLA: <200ms",    color: "#f59e0b", w: Math.min(100, (live.latencyP95Ms || 0) / 2) },
    { label: "Uptime",       value: formatUptime(live.uptimeSeconds || 0), sub: "Host system",   color: "#22c55e", w: 100 },
  ];

  return (
    <div>
      { }
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
        {metrics.map((m) => (
          <Card key={m.label} t={t} style={{ padding: 18 }}>
            <div style={{ fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8, fontWeight: 500 }}>{m.label}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: m.color, marginBottom: 6 }}>{m.value}</div>
            <Bar pct={m.w} color={m.color} h={5} />
            <div style={{ fontSize: 11, color: t.muted, marginTop: 6 }}>{m.sub}</div>
          </Card>
        ))}
      </div>

      { }
      <Card t={t} style={{ marginBottom: 20 }}>
        <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Resource Usage (24h)</h3>
        <div style={{ display: "flex", gap: 16, marginBottom: 12 }}>
          {[{ label: "CPU", color: "#3b82f6" }, { label: "Memory", color: "#a855f7" }].map((l) => (
            <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: t.muted }}>
              <span style={{ width: 24, height: 2, background: l.color, display: "inline-block", borderRadius: 1 }} />
              {l.label}
            </div>
          ))}
        </div>
        <MetricsChart t={t} data={history} />
      </Card>

      { }
      <Card t={t}>
        <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Active Alerts</h3>
        {[
          { sev: "warn",  msg: "deployhub-api — Memory usage above 85% for 10min",         ts: "14:12" },
          { sev: "info",  msg: "analytics-svc — Auto-scaling triggered (2 to 4 pods)",         ts: "14:08" },
          { sev: "error", msg: "deployhub-api — Container OOM restart loop detected",        ts: "13:55" },
        ].map((a, i) => {
          const c = a.sev === "error" ? t.danger : a.sev === "warn" ? t.warning : t.info;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", borderRadius: 10, background: `${c}0d`, border: `1px solid ${c}33`, marginBottom: 8 }}>
              <span
                style={{
                  display: "inline-flex",
                  color: c,
                  flexShrink: 0,
                }}
              >
                {a.sev === "error" ? (
                  <AlertCircle size={17} aria-hidden="true" />
                ) : a.sev === "warn" ? (
                  <AlertTriangle size={17} aria-hidden="true" />
                ) : (
                  <Info size={17} aria-hidden="true" />
                )}
              </span>
              <span style={{ flex: 1, fontSize: 13, color: t.text }}>{a.msg}</span>
              <span style={{ fontSize: 11, color: t.muted, flexShrink: 0 }}>{a.ts}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}