"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { PIPELINE_STAGES } from "@/lib/data";
import { Card, Badge, Bar } from "@/components/ui";
import { useInterval } from "@/hooks/useInterval";

export function PipelineModule({ t }: { t: Theme }) {
  const [stages, setStages] = useState(PIPELINE_STAGES);
  const [running, setRunning] = useState(false);

  function runPipeline() {
    setRunning(true);
    setStages((s) => s.map((st) => ({ ...st, status: "pending" })));
    let i = 0;
    const run = () => {
      if (i >= stages.length) { setRunning(false); return; }
      const idx = i;
      setStages((s) => s.map((st, j) => (j === idx ? { ...st, status: "running" } : st)));
      setTimeout(() => {
        setStages((s) => s.map((st, j) => (j === idx ? { ...st, status: idx === 2 ? "warning" : "success" } : st)));
        i++;
        run();
      }, 1800);
    };
    run();
  }

  const stageColor = (s: string) =>
    s === "success" ? t.success : s === "warning" ? t.warning : s === "running" ? t.accent : s === "pending" ? t.muted : t.danger;
  const stageIcon  = (s: string) =>
    s === "success" ? "✓" : s === "warning" ? "⚠" : s === "running" ? "⟳" : s === "pending" ? "◯" : "✕";

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>CI/CD Pipeline · deployhub-web</h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: t.muted }}>Commit a1b2c3d · branch main · triggered by giselle</p>
        </div>
        <button
          onClick={runPipeline} disabled={running}
          style={{ padding: "10px 20px", borderRadius: 10, background: running ? "rgba(59,130,246,0.2)" : "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: running ? `1px solid ${t.accentBorder}` : "none", color: "white", fontSize: 13, fontWeight: 600, cursor: running ? "not-allowed" : "pointer", opacity: running ? 0.7 : 1, fontFamily: "inherit" }}
        >
          {running ? "⟳ Running..." : "▶ Run Pipeline"}
        </button>
      </div>

      {/* PIPELINE FLOW */}
      <Card t={t} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {stages.map((st, i) => {
            const c = stageColor(st.status);
            return (
              <div key={st.name} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 120 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRadius: 12, border: `1px solid ${st.status === "running" ? t.accent : t.border}`, background: st.status === "running" ? t.accentSoft : "transparent", transition: "all 0.4s" }}>
                  <div style={{ fontSize: 24, marginBottom: 6 }}>{st.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>{st.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${c}22`, border: `1.5px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: c }}>
                      {stageIcon(st.status)}
                    </span>
                    <span style={{ fontSize: 11, color: c, fontWeight: 600, textTransform: "uppercase" }}>{st.status}</span>
                  </div>
                  <div style={{ fontSize: 11, color: t.muted }}>⏱ {st.duration}</div>
                </div>
                {i < stages.length - 1 && <div style={{ width: 24, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: t.muted }}>→</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* STAGE DETAIL CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        {stages.map((st) => {
          const c = stageColor(st.status);
          return (
            <Card key={st.name} t={t}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>{st.icon} {st.name}</div>
                <Badge label={st.status} color={c} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {st.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.muted }}>
                    <span style={{ color: c }}>•</span>{s}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: t.muted, borderTop: `1px solid ${t.border}`, paddingTop: 8 }}>
                Duration: {st.duration}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}