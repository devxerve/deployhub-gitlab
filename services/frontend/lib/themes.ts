// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
// Matches the login page palette exactly — both DARK and LIGHT

export const DARK = {
  pageBg: "#020617",
  card: "rgba(11,18,32,0.97)",
  sidebar: "rgba(2,6,23,0.92)",
  border: "rgba(59,130,246,0.18)",
  borderHover: "rgba(59,130,246,0.4)",
  text: "#f1f5f9",
  muted: "#64748b",
  accent: "#3b82f6",
  accentSoft: "rgba(59,130,246,0.12)",
  accentBorder: "rgba(59,130,246,0.28)",
  success: "#22c55e",
  danger: "#ef4444",
  warning: "#facc15",
  info: "#3b82f6",
  hover: "rgba(59,130,246,0.08)",
  active: "rgba(59,130,246,0.18)",
  menuText: "#94a3b8",
  menuActive: "#f8fafc",
  inputBg: "rgba(15,23,42,0.8)",
  shadow: "0 10px 35px rgba(15,23,42,0.5)",
  gridImg:
    "linear-gradient(rgba(59,130,246,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(59,130,246,0.04) 1px,transparent 1px)",
  scrollbar: "#1e293b",
  successSoft: "rgba(34,197,94,0.12)",
  dangerSoft: "rgba(239,68,68,0.12)",
  warningSoft: "rgba(250,204,21,0.12)",
  infoSoft: "rgba(59,130,246,0.12)",
};

export const LIGHT = {
  pageBg: "linear-gradient(145deg,#e0f7f4 0%,#dbeafe 45%,#d1fae5 100%)",
  card: "rgba(255,255,255,0.82)",
  sidebar: "rgba(255,255,255,0.92)",
  border: "rgba(6,182,212,0.22)",
  borderHover: "rgba(6,182,212,0.5)",
  text: "#0c4a6e",
  muted: "#0891b2",
  accent: "#0891b2",
  accentSoft: "rgba(6,182,212,0.1)",
  accentBorder: "rgba(6,182,212,0.28)",
  success: "#16a34a",
  danger: "#dc2626",
  warning: "#ca8a04",
  info: "#0891b2",
  hover: "rgba(6,182,212,0.08)",
  active: "rgba(6,182,212,0.18)",
  menuText: "#0891b2",
  menuActive: "#0c4a6e",
  inputBg: "rgba(255,255,255,0.9)",
  shadow: "0 6px 24px rgba(6,182,212,0.12)",
  gridImg:
    "linear-gradient(rgba(6,182,212,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.06) 1px,transparent 1px)",
  scrollbar: "#bae6fd",
  successSoft: "rgba(22,163,74,0.1)",
  dangerSoft: "rgba(220,38,38,0.1)",
  warningSoft: "rgba(202,138,4,0.1)",
  infoSoft: "rgba(6,182,212,0.1)",
};

export type Theme = typeof DARK;

// Helper: pick a status colour from any theme
export function statusColor(t: Theme, s: string): string {
  const map: Record<string, string> = {
    SUCCESS: "#22c55e",
    FAILED: "#ef4444",
    BUILDING: "#3b82f6",
    PENDING: "#94a3b8",
    WARNING: "#facc15",
    live: "#22c55e",
    failing: "#ef4444",
    building: "#3b82f6",
    idle: "#94a3b8",
    success: "#22c55e",
    failed: "#ef4444",
    active: "#22c55e",
    warning: "#facc15",
    error: "#ef4444",
    inactive: "#94a3b8",
    running: "#3b82f6",
    pending: "#94a3b8",
  };
  return map[s] || t.muted;
}

export function scoreColor(t: Theme, sc: string): string {
  if (sc === "A+" || sc === "A") return t.success;
  if (sc === "B") return t.accent;
  if (sc === "C") return t.warning;
  return t.danger;
}

export function logColor(t: Theme, lv: string): string {
  if (lv === "ERROR") return t.danger;
  if (lv === "WARN") return t.warning;
  return t.success;
}