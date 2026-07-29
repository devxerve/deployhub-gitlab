"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Clock3,
  ExternalLink,
  FolderGit2,
  GitBranch,
  PackageCheck,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { Badge, Btn, Card, Modal, TextInput } from "@/components/ui";
import { getDeployments, type Deploy } from "@/lib/api";
import {
  addStoredProject,
  getStoredProjects,
  mergeProjects,
  removeStoredProject,
  type DeployProject,
} from "@/lib/projects";

interface ProjectStats {
  status: "live" | "building" | "failing" | "idle";
  lastDeploy: string;
  totalDeploys: number;
  port?: number;
}

const EMPTY_FORM = {
  name: "",
  repoUrl: "",
  defaultBranch: "main",
  description: "",
};

function deriveStatus(deploys: Deploy[]): ProjectStats["status"] {
  if (deploys.length === 0) return "idle";
  const latest = deploys[0];
  if (["PENDING", "CLONING", "BUILDING", "RUNNING"].includes(latest.status)) return "building";
  if (latest.status === "FAILED") return "failing";
  if (latest.status === "SUCCESS") return "live";
  return "idle";
}

function timeAgo(dateStr?: string) {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} hr ago`;
  return `${Math.floor(h / 24)} days ago`;
}

export function ProjectsModule({ t }: { t: Theme }) {
  const [projects, setProjects] = useState<DeployProject[]>([]);
  const [deploys, setDeploys] = useState<Deploy[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<DeployProject | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const stored = getStoredProjects();
      if (!cancelled) setProjects(stored);

      try {
        const history = await getDeployments();
        if (cancelled) return;
        setDeploys(history);

        const imported = Array.from(
          new Map(history.map((deploy) => [deploy.projectId, deploy])).values(),
        ).map((deploy) => ({
          id: deploy.projectId,
          name: deploy.projectId,
          repoUrl: deploy.repoUrl,
          defaultBranch: deploy.branch || "main",
          description: "Imported from deployment history",
          createdAt: deploy.createdAt,
        }));

        setProjects(mergeProjects(imported));
      } catch {
        // Projects remain usable from browser storage when the API is offline.
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const statsByProject = useMemo(() => {
    const grouped = deploys.reduce<Record<string, Deploy[]>>((acc, deploy) => {
      if (!acc[deploy.projectId]) acc[deploy.projectId] = [];
      acc[deploy.projectId].push(deploy);
      return acc;
    }, {});

    return Object.fromEntries(
      projects.map((project) => {
        const history = grouped[project.id] ?? [];
        return [
          project.id,
          {
            status: deriveStatus(history),
            lastDeploy: timeAgo(history[0]?.createdAt),
            totalDeploys: history.length,
            port: history.find((deploy) => deploy.port)?.port,
          } satisfies ProjectStats,
        ];
      }),
    ) as Record<string, ProjectStats>;
  }, [deploys, projects]);

  const filtered = projects.filter((project) => {
    const query = search.toLowerCase();
    const stats = statsByProject[project.id];
    return (
      project.name.toLowerCase().includes(query) ||
      project.repoUrl.toLowerCase().includes(query)
    ) && (filter === "all" || stats?.status === filter);
  });

  function handleCreate() {
    setFormError(null);
    try {
      const project = addStoredProject(form);
      setProjects((current) => [project, ...current]);
      setForm(EMPTY_FORM);
      setShowCreate(false);
    } catch (error) {
      setFormError(error instanceof Error ? error.message : "Unable to add project.");
    }
  }

  function handleRemove(project: DeployProject) {
    const hasDeployments = (statsByProject[project.id]?.totalDeploys ?? 0) > 0;
    const question = hasDeployments
      ? `Remove ${project.name} from Projects? Deployment history will not be deleted.`
      : `Remove ${project.name} from Projects?`;

    if (!window.confirm(question)) return;
    removeStoredProject(project.id);
    setProjects((current) => current.filter((item) => item.id !== project.id));
    if (selected?.id === project.id) setSelected(null);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 19, color: t.text }}>Projects</h2>
          <p style={{ margin: "5px 0 0", color: t.muted, fontSize: 12 }}>
            Register GitHub repositories here. Deployments only executes registered projects.
          </p>
        </div>
        <Btn t={t} onClick={() => { setFormError(null); setShowCreate(true); }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
            <Plus size={15} /> Add project
          </span>
        </Btn>
      </div>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: 220 }}>
          <Search size={16} style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: t.muted, pointerEvents: "none" }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects..."
            aria-label="Search projects"
            style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px 10px 39px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}
          />
        </div>
        {["all", "live", "building", "failing", "idle"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
              background: filter === item ? t.accentSoft : "transparent",
              border: filter === item ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
              color: filter === item ? t.accent : t.muted,
              transition: "all 0.2s",
            }}
          >
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      {!loading && projects.length === 0 && (
        <Card t={t} style={{ textAlign: "center", padding: 48 }}>
          <FolderGit2 size={36} color={t.accent} style={{ marginBottom: 12 }} />
          <h3 style={{ margin: "0 0 6px", color: t.text, fontSize: 15 }}>No projects registered</h3>
          <p style={{ margin: "0 0 16px", color: t.muted, fontSize: 12 }}>
            Add a public GitHub repository with a Dockerfile to make it deployable.
          </p>
          <Btn t={t} onClick={() => setShowCreate(true)}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <Plus size={15} /> Add first project
            </span>
          </Btn>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))", gap: 16 }}>
        {filtered.map((project) => {
          const stats = statsByProject[project.id] ?? { status: "idle", lastDeploy: "Never", totalDeploys: 0 };
          const status = stats.status === "live" ? "SUCCESS" : stats.status === "building" ? "BUILDING" : stats.status === "failing" ? "FAILED" : "PENDING";
          const color = statusColor(t, status);

          return (
            <Card
              key={project.id}
              t={t}
              style={{ cursor: "pointer", transition: "all 0.2s", position: "relative" }}
              onMouseEnter={(event) => { event.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(event) => { event.currentTarget.style.transform = "translateY(0)"; }}
              onClick={() => setSelected(project)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                <div style={{ width: 42, height: 42, borderRadius: 12, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", color: t.accent }}>
                  <GitBranch size={21} />
                </div>
                <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                  <Badge label={stats.status} color={color} />
                  <button
                    aria-label={`Remove ${project.name}`}
                    title="Remove project"
                    onClick={(event) => { event.stopPropagation(); handleRemove(project); }}
                    style={{ width: 30, height: 30, borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: t.text }}>{project.name}</h3>
              <p style={{ margin: "0 0 12px", minHeight: 34, fontSize: 12, lineHeight: 1.45, color: t.muted }}>
                {project.description || "GitHub project ready for deployment."}
              </p>

              <div style={{ display: "flex", alignItems: "center", gap: 7, color: t.muted, fontSize: 11, marginBottom: 8 }}>
                <GitBranch size={13} /> {project.defaultBranch}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, color: t.muted, fontSize: 11, marginBottom: 14, minWidth: 0 }}>
                <GitBranch size={13} />
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{project.repoUrl.replace("https://", "")}</span>
              </div>

              <div style={{ display: "flex", gap: 8, marginBottom: 13, flexWrap: "wrap" }}>
                <Badge label={`${stats.totalDeploys} deployments`} color={t.accent} />
                {stats.port && <Badge label={`port ${stats.port}`} color={t.success} />}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 11, color: t.muted }}>
                <Clock3 size={13} /> Last deployment: {stats.lastDeploy}
              </div>
            </Card>
          );
        })}
      </div>

      {showCreate && (
        <Modal t={t} title="Add GitHub project" onClose={() => setShowCreate(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            <label style={{ fontSize: 12, color: t.muted }}>
              Project name
              <TextInput t={t} value={form.name} onChange={(value) => setForm((current) => ({ ...current, name: value }))} placeholder="Example: customer-portal" style={{ marginTop: 6 }} />
            </label>
            <label style={{ fontSize: 12, color: t.muted }}>
              GitHub repository URL
              <TextInput t={t} value={form.repoUrl} onChange={(value) => setForm((current) => ({ ...current, repoUrl: value }))} placeholder="https://github.com/organization/repository" style={{ marginTop: 6 }} />
            </label>
            <label style={{ fontSize: 12, color: t.muted }}>
              Default branch
              <TextInput t={t} value={form.defaultBranch} onChange={(value) => setForm((current) => ({ ...current, defaultBranch: value }))} placeholder="main" style={{ marginTop: 6 }} />
            </label>
            <label style={{ fontSize: 12, color: t.muted }}>
              Description
              <TextInput t={t} value={form.description} onChange={(value) => setForm((current) => ({ ...current, description: value }))} placeholder="What does this project deploy?" style={{ marginTop: 6 }} />
            </label>

            {formError && (
              <div role="alert" style={{ color: t.danger, fontSize: 12, padding: "9px 11px", borderRadius: 8, border: `1px solid ${t.danger}40`, background: `${t.danger}12` }}>
                {formError}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
              <Btn t={t} variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Btn>
              <Btn t={t} onClick={handleCreate} disabled={!form.name.trim() || !form.repoUrl.trim()}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                  <Plus size={15} /> Add project
                </span>
              </Btn>
            </div>
          </div>
        </Modal>
      )}

      {selected && (
        <Modal t={t} title={selected.name} onClose={() => setSelected(null)}>
          {([
            ["Repository", selected.repoUrl],
            ["Project ID", selected.id],
            ["Default branch", selected.defaultBranch],
            ["Status", statsByProject[selected.id]?.status ?? "idle"],
            ["Total deployments", String(statsByProject[selected.id]?.totalDeploys ?? 0)],
            ["Last deployment", statsByProject[selected.id]?.lastDeploy ?? "Never"],
          ] as [string, string][]).map(([key, value]) => (
            <div key={key} style={{ display: "flex", justifyContent: "space-between", gap: 18, padding: "9px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 12, color: t.muted }}>{key}</span>
              <span style={{ fontSize: 12, color: t.text, fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}>{value}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 17 }}>
            <a href={selected.repoUrl} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration: "none" }}>
              <Btn t={t} variant="secondary" style={{ width: "100%" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <ExternalLink size={14} /> Open GitHub
                </span>
              </Btn>
            </a>
            <Btn t={t} style={{ flex: 1 }} onClick={() => setSelected(null)}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                <PackageCheck size={14} /> Ready to deploy
              </span>
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
