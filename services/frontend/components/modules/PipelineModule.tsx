"use client";

import { useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Circle,
  Clock3,
  FlaskConical,
  LoaderCircle,
  PackageCheck,
  Play,
  Rocket,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Theme } from "@/lib/themes";
import { PIPELINE_STAGES } from "@/lib/data";
import { Badge, Card } from "@/components/ui";

const STAGE_ICONS: Record<string, LucideIcon> = {
  Build: PackageCheck,
  Test: FlaskConical,
  Security: ShieldCheck,
  Deploy: Rocket,
};

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

  const StatusIcon = ({ status }: { status: string }) => {
  if (status === "success") {
    return <Check size={11} aria-hidden="true" />;
  }

  if (status === "warning") {
    return <AlertTriangle size={11} aria-hidden="true" />;
  }

  if (status === "running") {
    return (
      <LoaderCircle
        size={11}
        className="icon-spin"
        aria-hidden="true"
      />
    );
  }

  if (status === "pending") {
    return <Circle size={10} aria-hidden="true" />;
  }

  return <X size={11} aria-hidden="true" />;
};

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
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
              }}
            >
              {running ? (
                <LoaderCircle
                  size={15}
                  className="icon-spin"
                  aria-hidden="true"
                />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}

              {running ? "Running..." : "Run Pipeline"}
            </span>
        </button>
      </div>

      {/* PIPELINE FLOW */}
      <Card t={t} style={{ marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 0, overflowX: "auto", paddingBottom: 8 }}>
          {stages.map((st, i) => {
            const c = stageColor(st.status); const StageIcon = STAGE_ICONS[st.name] ?? PackageCheck;
            return (
              <div key={st.name} style={{ display: "flex", alignItems: "center", flex: 1, minWidth: 120 }}>
                <div style={{ flex: 1, textAlign: "center", padding: "16px 8px", borderRadius: 12, border: `1px solid ${st.status === "running" ? t.accent : t.border}`, background: st.status === "running" ? t.accentSoft : "transparent", transition: "all 0.4s" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: 6,
                    }}
                  >
                    <StageIcon
                      size={24}
                      color={c}
                      aria-hidden="true"
                    />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 4 }}>{st.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, marginBottom: 6 }}>
                    <span style={{ width: 18, height: 18, borderRadius: "50%", background: `${c}22`, border: `1.5px solid ${c}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: c }}>
                      <StatusIcon status={st.status} />
                    </span>
                    <span style={{ fontSize: 11, color: c, fontWeight: 600, textTransform: "uppercase" }}>{st.status}</span>
                  </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 5,
                        fontSize: 11,
                        color: t.muted,
                      }}
                    >
                      <Clock3 size={12} aria-hidden="true" />
                      {st.duration}
                    </div>
                </div>
                      {i < stages.length - 1 && (
                      <div
                        style={{
                          width: 24,
                          flexShrink: 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: t.muted,
                        }}
                      >
                        <ArrowRight size={16} aria-hidden="true" />
                      </div>
                    )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* STAGE DETAIL CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        {stages.map((st) => {
          const c = stageColor(st.status); const StageIcon = STAGE_ICONS[st.name] ?? PackageCheck;
          return (
            <Card key={st.name} t={t}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    fontSize: 15,
                    fontWeight: 700,
                    color: t.text,
                  }}
                >
                  <StageIcon
                    size={17}
                    color={c}
                    aria-hidden="true"
                  />
                  {st.name}
                </div>                
                <Badge label={st.status} color={c} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {st.steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: t.muted }}>
                    <Circle
                      size={5}
                      fill={c}
                      color={c}
                      aria-hidden="true"
                    />
                    {s}
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