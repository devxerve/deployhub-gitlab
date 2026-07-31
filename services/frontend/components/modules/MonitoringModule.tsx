"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { Card, Bar } from "@/components/ui";
import { MetricsChart } from "@/components/charts";
import { useInterval } from "@/hooks/useInterval";
import {
  AlertCircle,
  AlertTriangle,
  Info,
} from "lucide-react";

export function MonitoringModule({ t }: { t: Theme }) {
  const [tick, setTick] = useState(0);
  useInterval(() => setTick((x) => x + 1), 2000);

  const live = {
    cpu:    28 + Math.round(Math.sin(tick / 3) * 12 + (tick % 5)),
    mem:    62 + Math.round(Math.cos(tick / 4) * 8  + (tick % 4)),
    disk:   44,
    req:    1240 + Math.round(Math.sin(tick / 2) * 300 + (tick % 6) * 20),
    lat:    72 + Math.round(Math.sin(tick / 5) * 20  + (tick % 3) * 4),
    uptime: 99.97,
  };

  const metrics = [
    { label: "CPU Usage",    value: `${live.cpu}%`,    sub: "4 cores avg",    color: "#3b82f6", w: live.cpu },
    { label: "Memory",       value: `${live.mem}%`,    sub: "6.2/8 GB",       color: "#a855f7", w: live.mem },
    { label: "Disk I/O",     value: `${live.disk}%`,   sub: "44 GB / 100 GB", color: "#22c55e", w: live.disk },
    { label: "Requests/min", value: String(live.req),  sub: "↑ 12% vs avg",   color: "#06b6d4", w: Math.min(100, live.req / 20) },
    { label: "Latency P95",  value: `${live.lat}ms`,   sub: "SLA: <200ms",    color: "#f59e0b", w: Math.min(100, live.lat / 2) },
    { label: "Uptime",       value: `${live.uptime}%`, sub: "Last 30 days",   color: "#22c55e", w: live.uptime },
  ];

  return (
    <div>
      {/* METRIC CARDS */}
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

      {/* TIME SERIES */}
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
        <MetricsChart t={t} />
      </Card>

      {/* ACTIVE ALERTS */}
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