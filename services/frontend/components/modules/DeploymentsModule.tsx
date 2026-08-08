"use client";

import { useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  GitBranch,
  LoaderCircle,
  Play,
  Rocket,
  Trash2,
  X,
} from "lucide-react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Badge, Bar, Btn, Card, TextInput } from "@/components/ui";
import {
  createDeployment,
  deleteDeployment,
  getDeploymentLogs,
  getDeployments,
  getProjects,
  type Deploy,
  type Project,
} from "@/lib/api";
import { joinDeployRoom, onDeployLog, onDeployStatus } from "@/lib/socket";
import { deploySiteUrl } from "@/lib/config";
import { useTranslation, type TranslateFn } from "@/lib/i18n/context";

const STATUS_PROGRESS: Record<string, number> = {
  pending: 5,
  cloning: 20,
  building: 60,
  running: 90,
  success: 100,
  failed: 100,
};

function timeAgo(dateStr: string, tr: TranslateFn) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return tr("common.time.justNow");
  if (min < 60) return tr("common.time.minAgo", { n: min });
  const h = Math.floor(min / 60);
  if (h < 24) return tr("common.time.hrAgo", { n: h });
  return tr("common.time.daysAgo", { n: Math.floor(h / 24) });
}

export function DeploymentsModule({ t }: { t: Theme }) {
  const { t: tr } = useTranslation();
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selected, setSelected] = useState<Deploy | null>(null);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [projectId, setProjectId] = useState("");
  const [commitHash, setCommitHash] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  const selectedProject = projects.find((project) => project.id === projectId);

  useEffect(() => {
    let cancelled = false;
    getProjects()
      .then((fetched) => {
        if (cancelled) return;
        setProjects(fetched);
        setProjectId((current) => current || fetched[0]?.id || "");
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
  getDeployments()
    .then(setDeploys)
    .catch(() => setError(tr("deployments.apiError")));
}, [tr]);

  useEffect(() => {
    const active = deploys.some((deploy) => ["pending", "cloning", "building", "running"].includes(deploy.status.toLowerCase()));
    if (!active) return;

    const interval = window.setInterval(() => {
      getDeployments().then((fresh) => {
        setDeploys(fresh);
        setSelected((current) => current ? fresh.find((deploy) => deploy.id === current.id) ?? current : null);
      }).catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [deploys]);

  const selectedId = selected?.id;

  useEffect(() => {
    if (!selectedId) return;
    let cancelled = false;
    setLiveLogs([]);
    getDeploymentLogs(selectedId)
      .then((history) => {
        if (cancelled) return;
        setLiveLogs((previous) => [...history, ...previous]);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  useEffect(() => {
    if (!selectedId) return;

    joinDeployRoom(selectedId);

    const offLog = onDeployLog((log) => {
      setLiveLogs((previous) => [...previous, log]);
      window.requestAnimationFrame(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      });
    });

    const offStatus = onDeployStatus(({ deployId, status }) => {
      if (deployId !== selectedId) return;
      setDeploys((previous) => previous.map((deploy) => deploy.id === deployId ? { ...deploy, status } : deploy));
      setSelected((previous) => previous?.id === deployId ? { ...previous, status } : previous);
    });

    return () => {
      offLog();
      offStatus();
    };
  }, [selectedId]);

  async function handleCreate() {
    if (!selectedProject) return;
    setLoading(true);
    setError(null);

    try {
      const deployment = await createDeployment({
        repoUrl: selectedProject.repoUrl,
        projectId: selectedProject.id,
        branch: selectedProject.defaultBranch,
        commitHash: commitHash.trim() || undefined,
      });
      setDeploys((previous) => [deployment, ...previous]);
      setSelected(deployment);
      setShowForm(false);
      setCommitHash("");
    } catch {
      setError(tr("deployments.createError"));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    if (!window.confirm(tr("deployments.confirmDelete"))) return;

    try {
      await deleteDeployment(id);
      setDeploys((previous) => previous.filter((deployment) => deployment.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError(tr("deployments.deleteError"));
    }
  }

  return (
    <div className={`deployments-layout${selected ? " deployments-layout--split" : ""}`}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, color: t.text, fontSize: 16, fontWeight: 650 }}>{tr("deployments.history")}</h3>
            <p style={{ margin: "4px 0 0", color: t.muted, fontSize: 12 }}>
              {tr("deployments.historySubtitle")}
            </p>
          </div>
          <Btn t={t} onClick={() => setShowForm((current) => !current)} disabled={projects.length === 0}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Rocket size={15} /> {tr("deployments.newDeployment")}
            </span>
          </Btn>
        </div>

        {projects.length === 0 && (
          <Card t={t} style={{ marginBottom: 16, padding: 20, borderColor: t.accentBorder }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <GitBranch size={22} color={t.accent} />
              <div>
                <div style={{ color: t.text, fontSize: 13, fontWeight: 650 }}>{tr("deployments.registerFirst")}</div>
                <div style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>
                  {tr("deployments.registerFirstBody")}
                </div>
              </div>
            </div>
          </Card>
        )}

        {error && (
          <div role="alert" style={{ color: t.danger, fontSize: 13, marginBottom: 12, padding: "9px 12px", background: `${t.danger}12`, border: `1px solid ${t.danger}35`, borderRadius: 8 }}>
            {error}
          </div>
        )}

        {showForm && projects.length > 0 && (
          <Card t={t} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, color: t.muted, marginBottom: 2 }}>{tr("deployments.project")}</div>
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
                {projects.map((project) => {
                  const active = project.id === projectId;
                  return (
                    <button
                      key={project.id}
                      type="button"
                      onClick={() => setProjectId(project.id)}
                      aria-pressed={active}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        flexShrink: 0,
                        padding: "9px 14px",
                        borderRadius: 10,
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        whiteSpace: "nowrap",
                        transition: "all 0.2s",
                        background: active ? t.accentSoft : "transparent",
                        border: active ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
                        color: active ? t.accent : t.text,
                      }}
                    >
                      <GitBranch size={14} />
                      {project.name}
                    </button>
                  );
                })}
              </div>

              {selectedProject && (
                <div style={{ display: "grid", gap: 7, padding: 12, borderRadius: 10, border: `1px solid ${t.border}`, background: t.hover }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, color: t.text, fontSize: 12 }}>
                    <GitBranch size={14} color={t.accent} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProject.repoUrl}</span>
                    <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" aria-label={tr("deployments.openGithubRepoAria")} style={{ color: t.accent, display: "inline-flex", marginLeft: "auto" }}>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.muted, fontSize: 12 }}>
                    <GitBranch size={14} /> {tr("deployments.configuredBranch", { branch: selectedProject.defaultBranch })}
                  </div>
                </div>
              )}

              <label style={{ fontSize: 12, color: t.muted }}>
                {tr("deployments.commitHashLabel")}
                <TextInput
                  t={t}
                  value={commitHash}
                  onChange={setCommitHash}
                  placeholder={tr("deployments.commitHashPlaceholder")}
                  style={{ marginTop: 6 }}
                />
              </label>

              <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5 }}>
                {tr("deployments.commitHashHelp")}
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn t={t} onClick={handleCreate} disabled={loading || !selectedProject} style={{ flex: 1 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    {loading ? <LoaderCircle size={15} className="icon-spin" /> : <Play size={15} />}
                    {loading ? tr("deployments.starting") : tr("deployments.deployProject")}
                  </span>
                </Btn>
                <Btn t={t} variant="ghost" onClick={() => setShowForm(false)}>{tr("common.cancel")}</Btn>
              </div>
            </div>
          </Card>
        )}

        {deploys.length === 0 && !error && (
          <Card t={t} style={{ textAlign: "center", padding: 34 }}>
            <Rocket size={30} color={t.muted} style={{ marginBottom: 10 }} />
            <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>{tr("deployments.noDeployments")}</div>
            <div style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>{tr("deployments.noDeploymentsBody")}</div>
          </Card>
        )}

        {deploys.map((deployment) => {
          const color = statusColor(t, deployment.status);
          const isActive = selected?.id === deployment.id;
          const statusLower = deployment.status.toLowerCase();
          const progress = STATUS_PROGRESS[statusLower] ?? 0;
          const isBuilding = ["pending", "cloning", "building", "running"].includes(statusLower);
          const statusLabel = tr(`status.${statusLower}`).toUpperCase();

          return (
            <Card
              key={deployment.id}
              t={t}
              style={{ marginBottom: 12, cursor: "pointer", border: isActive ? `1px solid ${t.accent}` : undefined, transition: "all 0.2s" }}
              onClick={() => setSelected(deployment)}
            >
              <div className="deployment-row">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{deployment.projectId}</div>
                  <div style={{ fontSize: 11, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {deployment.commitHash?.slice(0, 7) ?? deployment.branch ?? "default"} · {deployment.repoUrl.split("/").slice(-1)[0]}
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <Badge label={statusLabel} color={color} />
                </div>
                <span style={{ fontSize: 11, color: t.muted }}>{timeAgo(deployment.createdAt, tr)}</span>
                {statusLower === "success" && (
                  <a
                    href={deploySiteUrl(deployment.id)}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(event) => event.stopPropagation()}
                    aria-label={tr("deployments.openSiteAria", { project: deployment.projectId })}
                    title={tr("deployments.openSiteTitle")}
                    style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: `1px solid ${t.border}`, color: t.accent, display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button
                  aria-label={tr("deployments.deleteAria", { id: deployment.id })}
                  title={tr("deployments.deleteTitle")}
                  onClick={(event) => handleDelete(deployment.id, event)}
                  style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {isBuilding && (
                <div style={{ marginTop: 10 }}>
                  <Bar pct={progress} color={t.accent} h={4} />
                  <div style={{ fontSize: 10, color: t.muted, marginTop: 4 }}>{statusLabel} · {progress}%</div>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {selected && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div>
              <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("deployments.liveLogs")}</h3>
              <p style={{ margin: "3px 0 0", color: t.muted, fontSize: 11 }}>{selected.projectId}</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {selected.status.toLowerCase() === "success" && (
                <Btn t={t} onClick={() => window.open(deploySiteUrl(selected.id), "_blank", "noreferrer")}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><ExternalLink size={14} /> {tr("deployments.openSite")}</span>
                </Btn>
              )}
              <Btn t={t} variant="ghost" onClick={() => setSelected(null)}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><X size={14} /> {tr("common.close")}</span>
              </Btn>
            </div>
          </div>
          <Card t={t}>
            <div
              ref={logRef}
              aria-live="polite"
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: 12,
                lineHeight: 1.8,
                height: 420,
                overflowY: "auto",
                background: "#0b1220",
                borderRadius: 10,
                padding: 16,
              }}
            >
              {liveLogs.length === 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#94a3b8" }}>
                  <LoaderCircle size={14} className="icon-spin" /> {tr("deployments.waitingForEvents")}
                </span>
              )}
              {liveLogs.map((log, index) => (
                <div
                  key={`${index}-${log}`}
                  style={{
                    color: /success|completed|running on port/i.test(log)
                      ? "#4ade80"
                      : /failed|error/i.test(log)
                        ? "#f87171"
                        : "#94a3b8",
                  }}
                >
                  {log}
                </div>
              ))}
              {["pending", "cloning", "building", "running"].includes(selected.status.toLowerCase()) && (
                <span style={{ display: "inline-flex", color: "#60a5fa", marginTop: 4 }}>
                  <LoaderCircle size={14} className="icon-spin" />
                </span>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
