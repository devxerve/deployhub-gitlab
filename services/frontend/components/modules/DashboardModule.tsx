"use client";

import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { DEPLOYMENTS } from "@/lib/data";
import { Card, Badge, Sparkline } from "@/components/ui";
import { DeployActivityChart } from "@/components/charts";

export function DashboardModule({ t }: { t: Theme }) {
  const kpis = [
    { label: "Total Projects",     value: 5,        sub: "2 active",           color: "#3b82f6", spark: [3,4,3,5,4,5,5] },
    { label: "Deployments Today",  value: 12,       sub: "+4 from yesterday",  color: "#22c55e", spark: [6,8,7,9,10,11,12] },
    { label: "Failed Deploys",     value: 2,        sub: "16.6% failure rate", color: "#ef4444", spark: [1,2,1,3,2,2,2] },
    { label: "Avg Build Time",     value: "1m 52s", sub: "-12s improvement",   color: "#a855f7", spark: [130,120,125,115,118,112,112] },
  ];

  return (
    <div>
      {/* KPI CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 20 }}>
        {kpis.map((k) => (
          <Card key={k.label} t={t} style={{ padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 12, color: t.muted, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{k.label}</span>
              <Sparkline data={k.spark} color={k.color} />
            </div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
            <div style={{ fontSize: 12, color: t.muted }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 20 }}>
        {/* DEPLOY CHART */}
        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Deployment Activity (24h)</h3>
          <DeployActivityChart t={t} />
        </Card>

        {/* PLATFORM STATUS */}
        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Platform Status</h3>
          {[
            { svc: "API Gateway", status: "operational", lat: "23ms" },
            { svc: "Build Nodes", status: "operational", lat: "—"    },
            { svc: "CDN",         status: "operational", lat: "11ms" },
            { svc: "DB Primary",  status: "degraded",    lat: "89ms" },
            { svc: "DB Replica",  status: "operational", lat: "12ms" },
          ].map((s) => (
            <div key={s.svc} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: s.status === "operational" ? t.success : t.warning, display: "inline-block" }} />
                <span style={{ fontSize: 13, color: t.text }}>{s.svc}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: t.muted }}>{s.lat}</span>
                <Badge label={s.status} color={s.status === "operational" ? t.success : t.warning} />
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* RECENT DEPLOYMENTS */}
      <Card t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Recent Deployments</h3>
          <Badge label="Live Feed" color={t.success} />
        </div>
        {DEPLOYMENTS.slice(0, 5).map((d) => {
          const c = statusColor(t, d.status);
          return (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{d.app}</div>
                <div style={{ fontSize: 11, color: t.muted }}>{d.branch} · {d.commit}</div>
              </div>
              <Badge label={d.status} color={c} />
              <span style={{ fontSize: 12, color: t.muted }}>{d.version}</span>
              <span style={{ fontSize: 12, color: t.muted }}>{d.duration}</span>
              <span style={{ fontSize: 12, color: t.muted, textAlign: "right" }}>{d.time}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}