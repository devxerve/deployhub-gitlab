"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Card, Badge, Sparkline } from "@/components/ui";
import { DeployActivityChart } from "@/components/charts";
import { getDeployments, type Deploy } from "@/lib/api";
import { useTranslation, type TranslateFn } from "@/lib/i18n/context";

function timeAgo(dateStr: string, tr: TranslateFn) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return tr("common.time.justNow");
  if (min < 60) return tr("common.time.minAgo", { n: min });
  const h = Math.floor(min / 60);
  if (h < 24) return tr("common.time.hrAgo", { n: h });
  return tr("common.time.daysAgo", { n: Math.floor(h / 24) });
}

export function DashboardModule({ t }: { t: Theme }) {
  const { t: tr } = useTranslation();
  const [deploys, setDeploys] = useState<Deploy[]>([]);

  useEffect(() => {
    getDeployments().then(setDeploys).catch(() => {});
  }, []);

  const totalProjects = new Set(deploys.map((d) => d.projectId)).size;
  const today = new Date().toDateString();
  const deploymentsToday = deploys.filter((d) => new Date(d.createdAt).toDateString() === today).length;
  const failedDeploys = deploys.filter((d) => d.status === "failed").length;

  const kpis = [
    { label: tr("dashboard.kpi.totalProjects"),    value: totalProjects || 0,   sub: tr("dashboard.kpi.totalProjectsSub"),       color: "#3b82f6", spark: [0,0,0,0,0,0,totalProjects] },
    { label: tr("dashboard.kpi.deploymentsToday"), value: deploymentsToday,     sub: tr("dashboard.kpi.deploymentsTodaySub"),    color: "#22c55e", spark: [0,0,0,0,0,0,deploymentsToday] },
    { label: tr("dashboard.kpi.failedDeploys"),    value: failedDeploys,        sub: tr("dashboard.kpi.ofTotal", { n: deploys.length }), color: "#ef4444", spark: [0,0,0,0,0,0,failedDeploys] },
    { label: tr("dashboard.kpi.totalDeploys"),     value: deploys.length,       sub: tr("dashboard.kpi.totalDeploysSub"),        color: "#a855f7", spark: [0,0,0,0,0,0,deploys.length] },
  ];

  return (
    <div>
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
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("dashboard.deployActivity")}</h3>
          <DeployActivityChart t={t} deploys={deploys} />
        </Card>

        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("dashboard.deployStatus")}</h3>
          {(["success", "building", "failed", "running", "pending"] as const).map((s) => {
            const count = deploys.filter((d) => d.status.toLowerCase() === s).length;
            return (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusColor(t, s), display: "inline-block" }} />
                  <span style={{ fontSize: 13, color: t.text, textTransform: "uppercase" }}>{tr(`status.${s}`)}</span>
                </div>
                <Badge label={String(count)} color={statusColor(t, s)} />
              </div>
            );
          })}
        </Card>
      </div>

      <Card t={t}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("dashboard.recentDeployments")}</h3>
          <Badge label={tr("dashboard.live")} color={t.success} />
        </div>
        {deploys.length === 0 && (
          <div style={{ color: t.muted, fontSize: 13, textAlign: "center", padding: 24 }}>{tr("dashboard.noDeployments")}</div>
        )}
        {deploys.slice(0, 5).map((d) => {
          const c = statusColor(t, d.status);
          return (
            <div key={d.id} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{d.projectId}</div>
                <div style={{ fontSize: 11, color: t.muted }}>{d.commitHash?.slice(0, 7) ?? "—"} · {d.repoUrl.split("/").slice(-1)[0]}</div>
              </div>
              <Badge label={tr(`status.${d.status.toLowerCase()}`).toUpperCase()} color={c} />
              <span style={{ fontSize: 12, color: d.port ? t.success : t.muted }}>{d.port ? `:${d.port}` : "—"}</span>
              <span style={{ fontSize: 12, color: t.muted, textAlign: "right" }}>{timeAgo(d.createdAt, tr)}</span>
            </div>
          );
        })}
      </Card>
    </div>
  );
}
