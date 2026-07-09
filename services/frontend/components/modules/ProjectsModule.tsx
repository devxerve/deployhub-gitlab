"use client";

import { useState, useEffect } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Card, Badge, Modal, Btn } from "@/components/ui";
import { getDeployments, type Deploy } from "@/lib/api";

interface Project {
  id: string;
  name: string;
  repoUrl: string;
  status: string;
  lastDeploy: string;
  totalDeploys: number;
  port?: number;
}

function deriveStatus(deploys: Deploy[]): string {
  if (deploys.length === 0) return "idle";
  const latest = deploys[0];
  if (["PENDING", "CLONING", "BUILDING"].includes(latest.status)) return "building";
  if (latest.status === "FAILED") return "failing";
  if (latest.status === "SUCCESS" || latest.status === "RUNNING") return "live";
  return "idle";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function ProjectsModule({ t }: { t: Theme }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Project | null>(null);

  useEffect(() => {
    getDeployments().then((deploys) => {
      const grouped = deploys.reduce<Record<string, Deploy[]>>((acc, d) => {
        if (!acc[d.projectId]) acc[d.projectId] = [];
        acc[d.projectId].push(d);
        return acc;
      }, {});

      const derived: Project[] = Object.entries(grouped).map(([projectId, ds]) => ({
        id: projectId,
        name: projectId,
        repoUrl: ds[0].repoUrl,
        status: deriveStatus(ds),
        lastDeploy: timeAgo(ds[0].createdAt),
        totalDeploys: ds.length,
        port: ds.find((d) => d.port)?.port,
      }));

      setProjects(derived);
    }).catch(() => {});
  }, []);

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.repoUrl.toLowerCase().includes(q))
      && (filter === "all" || p.status === filter);
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <input
          value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search projects..."
          style={{ flex: 1, minWidth: 180, padding: "10px 14px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
        />
        {["all", "live", "building", "failing", "idle"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: "10px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: filter === f ? t.accentSoft : "transparent",
            border: filter === f ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
            color: filter === f ? t.accent : t.muted, transition: "all 0.2s",
          }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {projects.length === 0 && (
        <div style={{ color: t.muted, fontSize: 13, textAlign: "center", padding: 48 }}>
          No hay proyectos aún. Crea un deploy en la sección Deployments.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered.map((p) => {
          const sc = statusColor(t, p.status === "live" ? "SUCCESS" : p.status === "building" ? "BUILDING" : p.status === "failing" ? "FAILED" : "PENDING");
          return (
            <Card key={p.id} t={t} style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => setSelected(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                <Badge label={p.status} color={sc} />
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: t.text }}>{p.name}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: t.muted, wordBreak: "break-all" }}>{p.repoUrl}</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge label={`${p.totalDeploys} deploys`} color={t.accent} />
                {p.port && <Badge label={`port ${p.port}`} color={t.success} />}
              </div>
              <div style={{ fontSize: 11, color: t.muted }}>Last deploy: {p.lastDeploy}</div>
            </Card>
          );
        })}
      </div>

      {selected && (
        <Modal t={t} title={selected.name} onClose={() => setSelected(null)}>
          {([
            ["Repository", selected.repoUrl],
            ["Status", selected.status],
            ["Total Deploys", String(selected.totalDeploys)],
            ["Last Deploy", selected.lastDeploy],
            ["Port", selected.port ? String(selected.port) : "—"],
          ] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 12, color: t.muted }}>{k}</span>
              <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 16 }}>
            <Btn t={t} style={{ width: "100%", textAlign: "center" }} onClick={() => setSelected(null)}>Cerrar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
