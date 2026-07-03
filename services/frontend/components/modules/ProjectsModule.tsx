"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor, scoreColor } from "@/lib/themes";
import { PROJECTS } from "@/lib/data";
import { Card, Badge, Modal, Btn, TextInput } from "@/components/ui";

const FRAMEWORKS = ["Next.js","React","Vue","Svelte","Angular","FastAPI","Django","Node.js","Go","Python","Rust"];

type Project = typeof PROJECTS[0] & { id: number };

export function ProjectsModule({ t }: { t: Theme }) {
  const [projects, setProjects] = useState<Project[]>(PROJECTS as Project[]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modal, setModal] = useState<null | "create" | "edit" | "delete" | "detail">(null);
  const [selected, setSelected] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: "", desc: "", framework: "Next.js", repo: "", branch: "main" });

  const filtered = projects.filter((p) => {
    const q = search.toLowerCase();
    return (p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
      && (filter === "all" || p.status === filter);
  });

  const openCreate = () => { setForm({ name: "", desc: "", framework: "Next.js", repo: "", branch: "main" }); setModal("create"); };
  const openEdit   = (p: Project) => { setSelected(p); setForm({ name: p.name, desc: p.desc, framework: p.framework, repo: p.repo, branch: p.branch }); setModal("edit"); };
  const openDelete = (p: Project) => { setSelected(p); setModal("delete"); };
  const openDetail = (p: Project) => { setSelected(p); setModal("detail"); };

  const handleCreate = () => {
    if (!form.name.trim()) return;
    setProjects((ps) => [...ps, { id: Date.now(), ...form, status: "idle", envs: 0, score: "—", lastDeploy: "never" }]);
    setModal(null);
  };
  const handleEdit = () => {
    setProjects((ps) => ps.map((p) => (p.id === selected?.id ? { ...p, ...form } : p)));
    setModal(null);
  };
  const handleDelete = () => {
    setProjects((ps) => ps.filter((p) => p.id !== selected?.id));
    setModal(null);
  };

  return (
    <div>
      {/* TOOLBAR */}
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
        <Btn t={t} onClick={openCreate}>+ New Project</Btn>
      </div>

      {/* GRID */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 16 }}>
        {filtered.map((p) => {
          const sc = statusColor(t, p.status);
          const ec = scoreColor(t, p.score);
          return (
            <Card key={p.id} t={t} style={{ cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📦</div>
                <Badge label={p.status} color={sc} />
              </div>
              <h3 style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 700, color: t.text }}>{p.name}</h3>
              <p style={{ margin: "0 0 12px", fontSize: 12, color: t.muted }}>{p.desc}</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                <Badge label={p.framework} color={t.accent} />
                <Badge label={`Score: ${p.score}`} color={ec} />
                <Badge label={`${p.envs} envs`} color={t.muted} />
              </div>
              <div style={{ fontSize: 11, color: t.muted, marginBottom: 14 }}>Last deploy: {p.lastDeploy}</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => openDetail(p)} style={{ flex: 1, padding: "7px", borderRadius: 8, background: t.hover, border: `1px solid ${t.border}`, color: t.text, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>View</button>
                <button onClick={() => openEdit(p)} style={{ flex: 1, padding: "7px", borderRadius: 8, background: t.accentSoft, border: `1px solid ${t.accentBorder}`, color: t.accent, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
                <button onClick={() => openDelete(p)} style={{ padding: "7px 10px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: t.danger, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>🗑</button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(modal === "create" || modal === "edit") && (
        <Modal t={t} title={modal === "create" ? "New Project" : "Edit Project"} onClose={() => setModal(null)}>
          {(["name", "desc", "repo", "branch"] as const).map((field) => (
            <div key={field} style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>{field}</label>
              <TextInput t={t} value={form[field]} onChange={(v) => setForm((f) => ({ ...f, [field]: v }))} />
            </div>
          ))}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11, color: t.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 4 }}>Framework</label>
            <select value={form.framework} onChange={(e) => setForm((f) => ({ ...f, framework: e.target.value }))}
              style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${t.border}`, background: t.inputBg, color: t.text, fontSize: 13, outline: "none", fontFamily: "inherit" }}>
              {FRAMEWORKS.map((fw) => <option key={fw}>{fw}</option>)}
            </select>
          </div>
          <Btn t={t} style={{ width: "100%", textAlign: "center" }} onClick={modal === "create" ? handleCreate : handleEdit}>
            {modal === "create" ? "Create Project" : "Save Changes"}
          </Btn>
        </Modal>
      )}

      {/* DELETE MODAL */}
      {modal === "delete" && (
        <Modal t={t} title="Delete Project" onClose={() => setModal(null)}>
          <p style={{ color: t.text, marginBottom: 20 }}>Are you sure you want to delete <strong>{selected?.name}</strong>? This cannot be undone.</p>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn t={t} variant="secondary" style={{ flex: 1 }} onClick={() => setModal(null)}>Cancel</Btn>
            <Btn t={t} variant="danger" style={{ flex: 1 }} onClick={handleDelete}>Delete</Btn>
          </div>
        </Modal>
      )}

      {/* DETAIL MODAL */}
      {modal === "detail" && selected && (
        <Modal t={t} title={selected.name} onClose={() => setModal(null)}>
          {([["Framework", selected.framework], ["Repository", selected.repo], ["Branch", selected.branch], ["Status", selected.status], ["Quality Score", selected.score], ["Environments", String(selected.envs)], ["Last Deploy", selected.lastDeploy]] as [string, string][]).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontSize: 12, color: t.muted }}>{k}</span>
              <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{v}</span>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}