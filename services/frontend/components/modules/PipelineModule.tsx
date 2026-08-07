"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Circle,
  Clock3,
  GitBranch,
  LoaderCircle,
  PackageCheck,
  Rocket,
  X,
  type LucideIcon,
} from "lucide-react";
import type { Theme } from "@/lib/themes";
import { Card } from "@/components/ui";
import { getDeployments, getProjects, type Deploy, type Project } from "@/lib/api";
import { joinDeployRoom, onDeployStatus } from "@/lib/socket";
import { useTranslation, type TranslateFn } from "@/lib/i18n/context";

const STAGE_ORDER = ["cloning", "building", "running"] as const;
type StageId = (typeof STAGE_ORDER)[number];

const STAGE_ICONS: Record<StageId, LucideIcon> = {
  cloning: GitBranch,
  building: PackageCheck,
  running: Rocket,
};

type StageStatus = "pending" | "running" | "success" | "failed";

function stageStatus(stageId: StageId, liveStatus: string | null, maxReachedIndex: number): StageStatus {
  const stageIdx = STAGE_ORDER.indexOf(stageId);
  if (!liveStatus) return "pending";
  if (liveStatus === "success") return "success";
  if (liveStatus === "failed") {
    if (stageIdx < maxReachedIndex) return "success";
    if (stageIdx === maxReachedIndex) return "failed";
    return "pending";
  }
  const currentIdx = STAGE_ORDER.indexOf(liveStatus as StageId);
  if (currentIdx === -1) return "pending";
  if (stageIdx < currentIdx) return "success";
  if (stageIdx === currentIdx) return "running";
  return "pending";
}

function stageColor(t: Theme, status: StageStatus) {
  return status === "success" ? t.success : status === "failed" ? t.danger : status === "running" ? t.accent : t.muted;
}

function StatusIcon({ status }: { status: StageStatus }) {
  if (status === "success") return <Check size={12} aria-hidden="true" />;
  if (status === "failed") return <X size={12} aria-hidden="true" />;
  if (status === "running") return <LoaderCircle size={12} className="icon-spin" aria-hidden="true" />;
  return <Circle size={10} aria-hidden="true" />;
}

function stageLabel(status: StageStatus, tr: TranslateFn) {
  if (status === "pending") return tr("status.pending");
  if (status === "running") return tr("status.running");
  if (status === "failed") return tr("status.failed");
  return tr("status.success");
}

function elapsed(sinceIso: string): string {
  const ms = Date.now() - new Date(sinceIso).getTime();
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${s % 60}s`;
}

export function PipelineModule({ t }: { t: Theme }) {
  const { t: tr } = useTranslation();
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useState("");

  const [activeDeploy, setActiveDeploy] = useState<Deploy | null>(null);
  const [liveStatus, setLiveStatus] = useState<string | null>(null);
  const [, forceTick] = useState(0);
  const maxReachedIndexRef = useRef(-1);

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
    if (!activeDeploy) return;
    const interval = window.setInterval(() => forceTick((n) => n + 1), 1000);
    return () => window.clearInterval(interval);
  }, [activeDeploy]);

  useEffect(() => {
    if (!projectId) {
      setActiveDeploy(null);
      setLiveStatus(null);
      return;
    }

    let cancelled = false;
    getDeployments()
      .then((all) => {
        if (cancelled) return;
        const latest = all
          .filter((deploy) => deploy.projectId === projectId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] ?? null;
        maxReachedIndexRef.current = -1;
        setActiveDeploy(latest);
        setLiveStatus(latest ? latest.status.toLowerCase() : null);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const activeDeployId = activeDeploy?.id;

  useEffect(() => {
    if (!activeDeployId) return;
    const lower = liveStatus ?? "";
    if (["success", "failed"].includes(lower)) return;

    const interval = window.setInterval(() => {
      getDeployments()
        .then((all) => {
          const fresh = all.find((deploy) => deploy.id === activeDeployId);
          if (fresh) setLiveStatus(fresh.status.toLowerCase());
        })
        .catch(() => undefined);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [activeDeployId, liveStatus]);

  useEffect(() => {
    if (!activeDeployId) return;

    joinDeployRoom(activeDeployId);

    const offStatus = onDeployStatus(({ deployId, status }) => {
      if (deployId !== activeDeployId) return;
      const lower = status.toLowerCase();
      const idx = STAGE_ORDER.indexOf(lower as StageId);
      if (idx > maxReachedIndexRef.current) maxReachedIndexRef.current = idx;
      setLiveStatus(lower);
    });

    return () => {
      offStatus();
    };
  }, [activeDeployId]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("pipeline.title")}</h3>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: t.muted, maxWidth: 480 }}>{tr("pipeline.subtitle")}</p>
        </div>
      </div>

      {projects.length === 0 ? (
        <Card t={t} style={{ padding: 20, borderColor: t.accentBorder }}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <GitBranch size={22} color={t.accent} />
            <div>
              <div style={{ color: t.text, fontSize: 13, fontWeight: 650 }}>{tr("pipeline.noProjects")}</div>
              <div style={{ color: t.muted, fontSize: 12, marginTop: 4 }}>{tr("pipeline.noProjectsBody")}</div>
            </div>
          </div>
        </Card>
      ) : (
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, marginBottom: 20 }}>
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
      )}

      {!activeDeploy ? (
        <Card t={t} style={{ textAlign: "center", padding: 34, color: t.muted, fontSize: 13 }}>
          {tr("pipeline.idle")}
        </Card>
      ) : (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 650, color: t.text }}>{activeDeploy.projectId}</div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: t.muted }}>
              <Clock3 size={12} /> {tr("pipeline.duration")} {elapsed(activeDeploy.createdAt)}
            </span>
          </div>

          {liveStatus === "failed" && maxReachedIndexRef.current === -1 && (
            <div role="alert" style={{ color: t.danger, fontSize: 13, marginBottom: 20, padding: "9px 12px", background: `${t.danger}12`, border: `1px solid ${t.danger}35`, borderRadius: 8 }}>
              {tr("pipeline.unknownFailure")}
            </div>
          )}

          <div style={{ display: "flex", alignItems: "flex-start", overflowX: "auto", paddingBottom: 4 }}>
            {STAGE_ORDER.map((stageId, i) => {
              const status = stageStatus(stageId, liveStatus, maxReachedIndexRef.current);
              const c = stageColor(t, status);
              const StageIcon = STAGE_ICONS[stageId];
              const steps = [1, 2].map((n) => tr(`pipeline.stage.${stageId}.step${n}`));
              const isLast = i === STAGE_ORDER.length - 1;

              return (
                <div key={stageId} style={{ display: "flex", alignItems: "flex-start", flex: isLast ? "0 0 auto" : 1, minWidth: 180 }}>
                  <div style={{ minWidth: 180 }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: status === "pending" ? "transparent" : `${c}18`,
                          border: `2px solid ${c}`,
                          color: c,
                          flexShrink: 0,
                        }}
                      >
                        <StageIcon size={16} aria-hidden="true" />
                      </div>
                      {!isLast && (
                        <div
                          style={{
                            height: 2,
                            flex: 1,
                            minWidth: 24,
                            background: status === "success" ? c : t.border,
                            margin: "0 4px",
                          }}
                        />
                      )}
                    </div>

                    <div style={{ marginTop: 10, paddingRight: 12 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{tr(`pipeline.stage.${stageId}.name`)}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600, color: c, textTransform: "uppercase" }}>
                          <StatusIcon status={status} />
                          {stageLabel(status, tr)}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                        {steps.map((step) => (
                          <div key={step} style={{ fontSize: 12, color: t.muted }}>{step}</div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
