"use client";

import { useState, useRef } from "react";
import type { Theme } from "@/lib/themes";
import { statusColor } from "@/lib/themes";
import { DEPLOYMENTS, BUILD_LOG_LINES } from "@/lib/data";
import { Card, Badge, Bar } from "@/components/ui";
import { useInterval } from "@/hooks/useInterval";

type Deploy = (typeof DEPLOYMENTS)[0] & { id: string; progress: number };

export function DeploymentsModule({ t }: { t: Theme }) {
  const [deploys, setDeploys] = useState<Deploy[]>(DEPLOYMENTS as Deploy[]);
  const [selected, setSelected] = useState<Deploy | null>(null);
  const [logRunning, setLogRunning] = useState(false);
  const [liveLogs, setLiveLogs] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  function launchDeploy(appName: string) {
    const id = `dpl_${Date.now()}`;
    const newDeploy: Deploy = {
      id, app: appName, branch: "main",
      commit: Math.random().toString(36).slice(2, 9),
      version: "v2.1.1", status: "BUILDING", duration: "—",
      user: "giselle@corp.com", time: "just now", progress: 0,
    };
    setDeploys((d) => [newDeploy, ...d]);
    setSelected(newDeploy);
    setLiveLogs([]);
    setLogRunning(true);
  }

  useInterval(() => {
    if (!logRunning) return;
    setLiveLogs((ll) => {
      if (ll.length >= BUILD_LOG_LINES.length) {
        setLogRunning(false);
        setDeploys((d) => d.map((x) => x.status === "BUILDING" ? { ...x, status: "SUCCESS", duration: "1m 48s", progress: 100 } : x));
        return ll;
      }
      const next = [...ll, BUILD_LOG_LINES[ll.length]];
      setDeploys((d) => d.map((x) => x.status === "BUILDING" ? { ...x, progress: Math.min(100, Math.round((next.length / BUILD_LOG_LINES.length) * 100)) } : x));
      if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
      return next;
    });
  }, 300);

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1.2fr 1fr" : "1fr", gap: 20 }}>
      {/* LEFT: DEPLOY LIST */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>All Deployments</h3>
          <button
            onClick={() => launchDeploy("deployhub-web")}
            style={{ padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg,#1d4ed8,#3b82f6)", border: "none", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            🚀 New Deploy
          </button>
        </div>

        {deploys.map((d) => {
          const c = statusColor(t, d.status);
          const isActive = selected?.id === d.id;
          return (
            <Card key={d.id} t={t}
              style={{ marginBottom: 12, cursor: "pointer", border: isActive ? `1px solid ${t.accent}` : undefined, transition: "all 0.2s" }}
              onClick={() => setSelected(d)}>
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", gap: 8 }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{d.app}</div>
                  <div style={{ fontSize: 11, color: t.muted }}>{d.branch} · {d.commit} · {d.version}</div>
                </div>
                <Badge label={d.status} color={c} />
                <div style={{ fontSize: 12, color: t.muted }}>
                  <div>⏱ {d.duration}</div>
                  <div style={{ marginTop: 2 }}>👤 {d.user.split("@")[0]}</div>
                </div>
                <span style={{ fontSize: 12, color: t.muted, textAlign: "right" }}>{d.time}</span>
              </div>
              {d.status === "BUILDING" && (
                <div style={{ marginTop: 10 }}>
                  <Bar pct={d.progress} color={t.accent} h={4} />
                  <div style={{ fontSize: 10, color: t.muted, marginTop: 4 }}>{d.progress}% complete</div>
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
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Build Logs · {selected.app}</h3>
            <button
              onClick={() => setSelected(null)}
              style={{ padding: "6px 12px", borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
            >
              ✕ Close
            </button>
          </div>
          <Card t={t}>
            <div
              ref={logRef}
              style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 12, lineHeight: "1.8",
                height: 420, overflowY: "auto", background: "rgba(0,0,0,0.3)", borderRadius: 10, padding: 16,
              }}
            >
              {liveLogs.length === 0 && <span style={{ color: t.muted }}>Waiting for logs...</span>}
              {liveLogs.map((l, i) => (
                <div key={i} style={{
                  color: l.startsWith("✓") || l.startsWith("🚀") ? "#22c55e"
                    : l.startsWith("$") ? "#3b82f6"
                    : "#94a3b8",
                }}>
                  {l}
                </div>
              ))}
              {logRunning && <span style={{ color: "#3b82f6" }}>▋</span>}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}