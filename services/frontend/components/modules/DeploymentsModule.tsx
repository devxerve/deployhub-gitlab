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
  getDeployments,
  type Deploy,
} from "@/lib/api";
import { joinDeployRoom, onDeployLog, onDeployStatus } from "@/lib/socket";
import {
  getStoredProjects,
  PROJECTS_UPDATED_EVENT,
  type DeployProject,
} from "@/lib/projects";

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
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function DeploymentsModule({ t }: { t: Theme }) {
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [projects, setProjects] = useState<DeployProject[]>([]);
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
    const syncProjects = () => {
      const stored = getStoredProjects();
      setProjects(stored);
      setProjectId((current) => current || stored[0]?.id || "");
    };

    syncProjects();
    window.addEventListener(PROJECTS_UPDATED_EVENT, syncProjects);
    window.addEventListener("storage", syncProjects);
    return () => {
      window.removeEventListener(PROJECTS_UPDATED_EVENT, syncProjects);
      window.removeEventListener("storage", syncProjects);
    };
  }, []);

  useEffect(() => {
    getDeployments()
      .then(setDeploys)
      .catch(() => setError("Unable to connect to the deployment API."));
  }, []);

  useEffect(() => {
    const active = deploys.some((deploy) => ["PENDING", "CLONING", "BUILDING", "RUNNING"].includes(deploy.status));
    if (!active) return;

    const interval = window.setInterval(() => {
      getDeployments().then((fresh) => {
        setDeploys(fresh);
        setSelected((current) => current ? fresh.find((deploy) => deploy.id === current.id) ?? current : null);
      }).catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [deploys]);

  useEffect(() => {
    if (!selected) return;

    joinDeployRoom(selected.id);

    const offLog = onDeployLog((log) => {
      setLiveLogs((previous) => [...previous, log]);
      window.requestAnimationFrame(() => {
        if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      });
    });

    const offStatus = onDeployStatus(({ deployId, status }) => {
      if (deployId !== selected.id) return;
      setDeploys((previous) => previous.map((deploy) => deploy.id === deployId ? { ...deploy, status } : deploy));
      setSelected((previous) => previous?.id === deployId ? { ...previous, status } : previous);
    });

    return () => {
      offLog();
      offStatus();
    };
  }, [selected?.id]);

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
      setLiveLogs([]);
      setShowForm(false);
      setCommitHash("");
    } catch {
      setError("The deployment could not be created. Verify that the backend is running.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, event: React.MouseEvent) {
    event.stopPropagation();
    if (!window.confirm("Delete this deployment record?")) return;

    try {
      await deleteDeployment(id);
      setDeploys((previous) => previous.filter((deployment) => deployment.id !== id));
      if (selected?.id === id) setSelected(null);
    } catch {
      setError("The deployment record could not be deleted.");
    }
  }

  return (
    <div className={`deployments-layout${selected ? " deployments-layout--split" : ""}`}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ margin: 0, color: t.text, fontSize: 16, fontWeight: 650 }}>Deployment history</h3>
            <p style={{ margin: "4px 0 0", color: t.muted, fontSize: 12 }}>
              Execute a project previously registered in Projects.
            </p>
          </div>
          <Btn t={t} onClick={() => setShowForm((current) => !current)} disabled={projects.length === 0}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Rocket size={15} /> New deployment
            </span>
          </Btn>
        </div>

        {projects.length === 0 && (
          <Card t={t} style={{ marginBottom: 16, padding: 20, borderColor: t.accentBorder }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <GitBranch size={22} color={t.accent} />
              <div>
                <div style={{ color: t.text, fontSize: 13, fontWeight: 650 }}>Register a GitHub project first</div>
                <div style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>
                  Open Projects, add a public GitHub repository, then return here to deploy it.
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
            <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
              <label style={{ fontSize: 12, color: t.muted }}>
                Project
                <select
                  value={projectId}
                  onChange={(event) => setProjectId(event.target.value)}
                  style={{ width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, fontFamily: "inherit", outline: "none" }}
                >
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </label>

              {selectedProject && (
                <div style={{ display: "grid", gap: 7, padding: 12, borderRadius: 10, border: `1px solid ${t.border}`, background: t.hover }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, color: t.text, fontSize: 12 }}>
                    <GitBranch size={14} color={t.accent} />
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedProject.repoUrl}</span>
                    <a href={selectedProject.repoUrl} target="_blank" rel="noreferrer" aria-label="Open GitHub repository" style={{ color: t.accent, display: "inline-flex", marginLeft: "auto" }}>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: t.muted, fontSize: 12 }}>
                    <GitBranch size={14} /> Configured branch: {selectedProject.defaultBranch}
                  </div>
                </div>
              )}

              <label style={{ fontSize: 12, color: t.muted }}>
                Commit hash (optional)
                <TextInput
                  t={t}
                  value={commitHash}
                  onChange={setCommitHash}
                  placeholder="Leave empty to deploy the configured project branch"
                  style={{ marginTop: 6 }}
                />
              </label>

              <div style={{ fontSize: 11, color: t.muted, lineHeight: 1.5 }}>
                The current backend supports public GitHub repositories containing a Dockerfile. A commit hash can pin an exact revision.
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Btn t={t} onClick={handleCreate} disabled={loading || !selectedProject} style={{ flex: 1 }}>
                  <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                    {loading ? <LoaderCircle size={15} className="icon-spin" /> : <Play size={15} />}
                    {loading ? "Starting..." : "Deploy project"}
                  </span>
                </Btn>
                <Btn t={t} variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
              </div>
            </div>
          </Card>
        )}

        {deploys.length === 0 && !error && (
          <Card t={t} style={{ textAlign: "center", padding: 34 }}>
            <Rocket size={30} color={t.muted} style={{ marginBottom: 10 }} />
            <div style={{ color: t.text, fontSize: 13, fontWeight: 600 }}>No deployments yet</div>
            <div style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>Your execution history will appear here.</div>
          </Card>
        )}

        {deploys.map((deployment) => {
          const color = statusColor(t, deployment.status);
          const isActive = selected?.id === deployment.id;
          const progress = STATUS_PROGRESS[deployment.status] ?? 0;
          const isBuilding = ["PENDING", "CLONING", "BUILDING", "RUNNING"].includes(deployment.status);

          return (
            <Card
              key={deployment.id}
              t={t}
              style={{ marginBottom: 12, cursor: "pointer", border: isActive ? `1px solid ${t.accent}` : undefined, transition: "all 0.2s" }}
              onClick={() => { setSelected(deployment); setLiveLogs([]); }}
            >
              <div className="deployment-row">
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{deployment.projectId}</div>
                  <div style={{ fontSize: 11, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {deployment.commitHash?.slice(0, 7) ?? deployment.branch ?? "default"} · {deployment.repoUrl.split("/").slice(-1)[0]}
                  </div>
                </div>
                <Badge label={deployment.status} color={color} />
                <span style={{ fontSize: 11, color: t.muted }}>{timeAgo(deployment.createdAt)}</span>
                <button
                  aria-label={`Delete deployment ${deployment.id}`}
                  title="Delete deployment record"
                  onClick={(event) => handleDelete(deployment.id, event)}
                  style={{ width: 30, height: 30, borderRadius: 7, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {isBuilding && (
                <div style={{ marginTop: 10 }}>
                  <Bar pct={progress} color={t.accent} h={4} />
                  <div style={{ fontSize: 10, color: t.muted, marginTop: 4 }}>{deployment.status} · {progress}%</div>
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
              <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Live logs</h3>
              <p style={{ margin: "3px 0 0", color: t.muted, fontSize: 11 }}>{selected.projectId}</p>
            </div>
            <Btn t={t} variant="ghost" onClick={() => setSelected(null)}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><X size={14} /> Close</span>
            </Btn>
          </div>
          <Card t={t}>
            <div
              ref={logRef}
              aria-live="polite"
              style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: 1.8, height: 420, overflowY: "auto", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16 }}
            >
              {liveLogs.length === 0 && (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: t.muted }}>
                  <LoaderCircle size={14} className="icon-spin" /> Waiting for deployment events...
                </span>
              )}
              {liveLogs.map((log, index) => (
                <div
                  key={`${index}-${log}`}
                  style={{
                    color: /success|completed|running on port/i.test(log)
                      ? t.success
                      : /failed|error/i.test(log)
                        ? t.danger
                        : "#94a3b8",
                  }}
                >
                  {log}
                </div>
              ))}
              {["PENDING", "CLONING", "BUILDING", "RUNNING"].includes(selected.status) && (
                <span style={{ display: "inline-flex", color: t.accent, marginTop: 4 }}>
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
