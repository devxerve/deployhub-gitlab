"use client";

import { useState, useRef, useEffect } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Card, Badge, Bar } from "@/components/ui";
import {
  getDeployments,
  createDeployment,
  deleteDeployment,
  type Deploy,
} from "@/lib/api";
import { joinDeployRoom, onDeployLog, onDeployStatus } from "@/lib/socket";
import {
  LoaderCircle,
  Rocket,
  Trash2,
  X,
} from "lucide-react";



const STATUS_PROGRESS: Record<string, number> = {
  PENDING: 5,
  CLONING: 20,
  BUILDING: 60,
  RUNNING: 90,
  SUCCESS: 100,
  FAILED: 100,
};


function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function DeploymentsModule({ t }: { t: Theme }) {
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [selected, setSelected] = useState<Deploy | null>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ repoUrl: "", projectId: "", commitHash: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const selectedDeploymentId = selected?.id;

  useEffect(() => {
    getDeployments()
      .then(setDeploys)
      .catch(() => setError("No se pudo conectar con el backend"));
  }, []);

  useEffect(() => {
  if (!selectedDeploymentId) return;

  joinDeployRoom(selectedDeploymentId);

  const offLog = onDeployLog((log) => {
    setLiveLogs((previous) => [...previous, log]);

    window.requestAnimationFrame(() => {
      if (logRef.current) {
        logRef.current.scrollTop =
          logRef.current.scrollHeight;
      }
    });
  });

  const offStatus = onDeployStatus(
    ({ deployId, status }) => {
      if (deployId !== selectedDeploymentId) return;

      setDeploys((previous) =>
        previous.map((deployment) =>
          deployment.id === deployId
            ? { ...deployment, status }
            : deployment,
        ),
      );

      setSelected((previous) =>
        previous?.id === deployId
          ? { ...previous, status }
          : previous,
      );
    },
  );

  return () => {
    offLog();
    offStatus();
  };
}, [selectedDeploymentId]);

  async function handleCreate() {
    if (!form.repoUrl || !form.projectId) return;
    setLoading(true);
    setError(null);
    try {
      const deploy = await createDeployment({
        repoUrl: form.repoUrl,
        projectId: form.projectId,
        commitHash: form.commitHash || undefined,
      });
      setDeploys((prev) => [deploy, ...prev]);
      setSelected(deploy);
      setLiveLogs([]);
      setShowForm(false);
      setForm({ repoUrl: "", projectId: "", commitHash: "" });
    } catch {
      setError("Error al crear el deployment");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await deleteDeployment(id);
      setDeploys((prev) => prev.filter((d) => d.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError("Error al eliminar el deployment");
    }
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1.2fr 1fr" : "1fr", gap: 20 }}>
      {/* LEFT: DEPLOY LIST */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>
            All Deployments
          </h3>
          <button
            onClick={() => setShowForm((v) => !v)}
            style={{ padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              <Rocket size={15} aria-hidden="true" />
              New Deploy
            </span>

          </button>
        </div>

        {error && (
          <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, padding: "8px 12px", background: "rgba(248,113,113,0.1)", borderRadius: 8 }}>
            {error}
          </div>
        )}

        {showForm && (
          <Card t={t} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
             
              <input
                placeholder="Project ID (ej: my-app)"
                value={form.projectId}
                onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, fontFamily: "inherit" }}
              />
               <input
                placeholder="Repo URL (ej: https://github.com/org/repo)"
                value={form.repoUrl}
                onChange={(e) => setForm((f) => ({ ...f, repoUrl: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, fontFamily: "inherit" }}
              />
              <input
                placeholder="Commit hash (opcional)"
                value={form.commitHash}
                onChange={(e) => setForm((f) => ({ ...f, commitHash: e.target.value }))}
                style={{ padding: "8px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, fontFamily: "inherit" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleCreate}
                  disabled={loading || !form.repoUrl || !form.projectId}
                  style={{ flex: 1, padding: "9px 0", borderRadius: 8, background: "#1d4ed8", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? "Lanzando..." : "Lanzar"}
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  style={{ padding: "9px 16px", borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 13, cursor: "pointer" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </Card>
        )}

        {deploys.length === 0 && !error && (
          <div style={{ color: t.muted, fontSize: 13, textAlign: "center", padding: 32 }}>
            No hay deployments aún
          </div>
        )}

        {deploys.map((d) => {
          const c = statusColor(t, d.status);
          const isActive = selected?.id === d.id;
          const progress = STATUS_PROGRESS[d.status] ?? 0;
          const isBuilding = ["PENDING", "CLONING", "BUILDING", "RUNNING"].includes(d.status);

          return (
            <Card
              key={d.id} t={t}
              style={{ marginBottom: 12, cursor: "pointer", border: isActive ? `1px solid ${t.accent}` : undefined, transition: "all 0.2s" }}
              onClick={() => { setSelected(d); setLiveLogs([]); }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr auto", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{d.projectId}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{d.commitHash?.slice(0, 7) ?? "—"} · {d.repoUrl.split("/").slice(-1)[0]}</div>
                </div>
                <Badge label={d.status} color={c} />
                <span style={{ fontSize: 11, color: t.muted }}>{timeAgo(d.createdAt)}</span>
                <button
                  onClick={(e) => handleDelete(d.id, e)}
                  style={{ padding: "4px 8px", borderRadius: 6, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, cursor: "pointer" }}
                  aria-label={`Delete deployment ${d.id}`}
                  title="Delete deployment"
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
              {isBuilding && (
                <div style={{ marginTop: 10 }}>
                  <Bar pct={progress} color={t.accent} h={4} />
                  <div style={{ fontSize: 10, color: t.muted, marginTop: 4 }}>{d.status}... {progress}%</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* RIGHT: LIVE LOGS */}
      {selected && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>
              Logs · {selected.projectId}
            </h3>
            <button
              onClick={() => setSelected(null)}
              style={{ padding: "6px 12px", borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <X size={14} aria-hidden="true" />
                Cerrar
              </span>
            </button>
          </div>
          <Card t={t}>
            <div
              ref={logRef}
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: "1.8", height: 420, overflowY: "auto", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16 }}
            >
              {liveLogs.length === 0 && (
                <span style={{ color: t.muted }}>Conectando con el servidor...</span>
              )}
              {liveLogs.map((l, i) => (
                <div key={i} style={{
                  color: /success|completed|running on port/i.test(l)
                  ? "#22c55e"
                  : /failed|error/i.test(l)
                    ? "#f87171"
                    : "#94a3b8",
                }}>
                  {l}
                </div>
              ))}
              {["PENDING", "CLONING", "BUILDING"].includes(selected.status) && (
                <span
                  style={{
                    display: "inline-flex",
                    color: "#3b82f6",
                  }}
                >
                  <LoaderCircle
                    size={14}
                    className="icon-spin"
                    aria-label="Deployment running"
                  />
                </span>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
