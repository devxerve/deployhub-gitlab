"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Card, Badge, Sparkline } from "@/components/ui";
import { DeployActivityChart } from "@/components/charts";
import { getDeployments, type Deploy } from "@/lib/api";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function DashboardModule({ t }: { t: Theme }) {
  const [deploys, setDeploys] = useState<Deploy[]>([]);

  useEffect(() => {
    getDeployments().then(setDeploys).catch(() => {});
  }, []);

  const totalProjects = new Set(deploys.map((d) => d.projectId)).size;
  const today = new Date().toDateString();
  const deploymentsToday = deploys.filter((d) => new Date(d.createdAt).toDateString() === today).length;
  const failedDeploys = deploys.filter((d) => d.status === "FAILED").length;

  const kpis = [
    { label: "Total Projects",    value: totalProjects || 0,   sub: "proyectos únicos",       color: "#3b82f6", spark: [0,0,0,0,0,0,totalProjects] },
    { label: "Deployments Today", value: deploymentsToday,     sub: "hoy",                    color: "#22c55e", spark: [0,0,0,0,0,0,deploymentsToday] },
    { label: "Failed Deploys",    value: failedDeploys,        sub: `de ${deploys.length} total`, color: "#ef4444", spark: [0,0,0,0,0,0,failedDeploys] },
    { label: "Total Deploys",     value: deploys.length,       sub: "histórico",              color: "#a855f7", spark: [0,0,0,0,0,0,deploys.length] },
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
        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Deployment Activity (24h)</h3>
          <DeployActivityChart t={t} />
        </Card>

        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Deploy Status</h3>
          {(["SUCCESS", "BUILDING", "FAILED", "RUNNING", "PENDING"] as const).map((s) => {
            const count = deploys.filter((d) => d.status === s).length;
            return (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(t, s), display: "inline-block" }} />
                  <span style={{ fontSize: 13, color: t.text }}>{s}</span>
                </div>
                <Badge label={String(count)} color={statusColor(t, s)} />
              </div>
            );
          })}
        </Card>
      </div>

      {/* RECENT DEPLOYMENTS */}
      <Card t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Recent Deployments</h3>
          <Badge label="Live" color={t.success} />
        </div>
        {deploys.length === 0 && (
          <div style={{ color: t.muted, fontSize: 13, textAlign: "center", padding: 24 }}>No hay deployments aún</div>
        )}
        {deploys.slice(0, 5).map((d) => {
          const c = statusColor(t, d.status);
          return (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{d.projectId}</div>
                <div style={{ fontSize: 11, color: t.muted }}>{d.commitHash?.slice(0, 7) ?? "—"} · {d.repoUrl.split("/").slice(-1)[0]}</div>
              </div>
              <Badge label={d.status} color={c} />
              <span style={{ fontSize: 12, color: d.port ? t.success : t.muted }}>{d.port ? `:${d.port}` : "—"}</span>
              <span style={{ fontSize: 12, color: t.muted, textAlign: "right" }}>{timeAgo(d.createdAt)}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
