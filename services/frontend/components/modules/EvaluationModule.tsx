"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { scoreColor } from "@/lib/themes";
import { PROJECTS, EVALUATION_SCORES } from "@/lib/data";
import { Card, Bar } from "@/components/ui";
import { RadarChart } from "@/components/charts";
import { Lightbulb } from "lucide-react";

export function EvaluationModule({ t }: { t: Theme }) {
  const [selected, setSelected] = useState(PROJECTS[0]);
  const s = EVALUATION_SCORES[selected.name] ?? EVALUATION_SCORES["deployhub-web"];
  const gradeColor = scoreColor(t, s.overall);

  const dims = [
    { label: "Code Quality",    val: s.quality,  color: "#3b82f6" },
    { label: "Test Coverage",   val: s.coverage, color: "#22c55e" },
    { label: "Security",        val: s.security, color: "#a855f7" },
    { label: "Performance",     val: s.perf,     color: "#06b6d4" },
    { label: "Maintainability", val: s.maintain, color: "#f59e0b" },
  ];

  return (
    <div>
      {/* PROJECT PICKER */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {PROJECTS.map((p) => (
          <button key={p.id} onClick={() => setSelected(p)} style={{
            padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            background: selected.id === p.id ? t.accentSoft : "transparent",
            border: selected.id === p.id ? `1px solid ${t.accentBorder}` : `1px solid ${t.border}`,
            color: selected.id === p.id ? t.accent : t.muted, transition: "all 0.2s",
          }}>
            {p.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 20 }}>
        {/* SCORE CARD */}
        <Card t={t} style={{ textAlign: "center" }}>
          <div style={{ fontSize: 12, color: t.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 8 }}>Global Score</div>
          <div style={{ fontSize: 80, fontWeight: 700, color: gradeColor, lineHeight: 1, marginBottom: 8 }}>{s.overall}</div>
          <div style={{ fontSize: 13, color: t.muted, marginBottom: 24 }}>{selected.name}</div>
          <RadarChart t={t} dims={dims} />
        </Card>

        <div>
          {/* DIMENSIONS */}
          <Card t={t} style={{ marginBottom: 16 }}>
            <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Score Breakdown</h3>
            {dims.map((d) => (
              <div key={d.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 13, color: t.text }}>{d.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.val}/100</span>
                </div>
                <Bar pct={d.val} color={d.color} h={8} />
              </div>
            ))}
          </Card>

          {/* RECOMMENDATIONS */}
          <Card t={t}>
            <h3
              style={{
                margin: "0 0 12px",
                color: t.text,
                fontSize: 15,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Lightbulb
                size={17}
                color={t.accent}
                aria-hidden="true"
              />
              Recommendations
            </h3>
            {s.recs.map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < s.recs.length - 1 ? `1px solid ${t.border}` : "none" }}>
                <span style={{ color: t.accent, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 13, color: t.text }}>{r}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}