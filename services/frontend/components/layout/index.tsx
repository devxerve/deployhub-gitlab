"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { NOTIFICATIONS } from "@/lib/data";

/* ─── NAV ITEMS ──────────────────────────────────────────────────────────── */
export const NAV = [
  { id: "dashboard",   icon: "⬡",  label: "Dashboard"     },
  { id: "projects",    icon: "📁", label: "Projects"      },
  { id: "deployments", icon: "🚀", label: "Deployments"   },
  { id: "pipeline",    icon: "⚙️",  label: "CI/CD Pipeline"},
  { id: "monitoring",  icon: "📊", label: "Monitoring"    },
  { id: "logs",        icon: "📋", label: "Logs"          },
  { id: "evaluation",  icon: "⭐", label: "Evaluation"    },
  { id: "settings",    icon: "🔧", label: "Settings"      },
] as const;

export type PageId = typeof NAV[number]["id"];

/* ─── SIDEBAR ────────────────────────────────────────────────────────────── */
export function Sidebar({
  t, active, onNav, collapsed,
}: { t: Theme; active: PageId; onNav: (id: PageId) => void; collapsed: boolean }) {
  return (
    <div style={{
      width: collapsed ? 64 : 240,
      minHeight: "100vh",
      background: t.sidebar,
      borderRight: `1px solid ${t.border}`,
      backdropFilter: "blur(18px)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: collapsed ? "20px 8px" : "20px 16px",
      transition: "width 0.3s ease",
      flexShrink: 0,
      position: "sticky",
      top: 0,
    }}>
      <div>
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 10,
            background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0, boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}>
            <span style={{ color: "white", fontSize: 16 }}>⚡</span>
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: 15, color: t.accent, letterSpacing: "-0.3px" }}>
              Deploy<span style={{ color: t.text }}>Hub</span>
            </span>
          )}
        </div>

        {/* NAV ITEMS */}
        <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((n) => {
            const isActive = active === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onNav(n.id as PageId)}
                style={{
                  display: "flex", alignItems: "center",
                  gap: 10, padding: collapsed ? "10px" : "10px 12px",
                  borderRadius: 10, cursor: "pointer",
                  background: isActive ? t.active : "transparent",
                  border: isActive ? `1px solid ${t.accentBorder}` : "1px solid transparent",
                  color: isActive ? t.menuActive : t.menuText,
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s", textAlign: "left", width: "100%",
                  justifyContent: collapsed ? "center" : "flex-start",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = t.hover; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{n.icon}</span>
                {!collapsed && <span>{n.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* USER CARD */}
      <div style={{
        background: t.card, padding: "10px 12px", borderRadius: 14,
        border: `1px solid ${t.border}`, display: "flex", alignItems: "center", gap: 8,
      }}>
        <img src="https://i.pravatar.cc/32?img=5" style={{ borderRadius: "50%", width: 32, height: 32, flexShrink: 0 }} alt="avatar" />
        {!collapsed && (
          <div>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.text }}>Giselle</p>
            <p style={{ margin: 0, fontSize: 11, color: t.muted }}>Administrator</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TOPBAR ─────────────────────────────────────────────────────────────── */
const PAGE_TITLES: Record<PageId, string> = {
  dashboard:   "Dashboard",
  projects:    "Projects",
  deployments: "Deployments",
  pipeline:    "CI/CD Pipeline",
  monitoring:  "Monitoring",
  logs:        "Logs",
  evaluation:  "Project Evaluation",
  settings:    "Settings",
};

export function TopBar({
  t, page, isDark, onToggleTheme, onToggleSidebar, notifCount, onNotif,
}: {
  t: Theme; page: PageId; isDark: boolean;
  onToggleTheme: () => void; onToggleSidebar: () => void;
  notifCount: number; onNotif: (e: React.MouseEvent) => void;
}) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      background: t.card, border: `1px solid ${t.border}`, borderRadius: 16,
      padding: "14px 20px", marginBottom: 20, backdropFilter: "blur(16px)",
      boxShadow: t.shadow,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onToggleSidebar}
          style={{ width: 36, height: 36, borderRadius: 10, background: "transparent", border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text, fontSize: 16 }}
        >
          ☰
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: t.text }}>{PAGE_TITLES[page]}</h1>
          <p style={{ margin: 0, fontSize: 12, color: t.muted }}>DeployHub Platform · v1.0.1</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* STATUS PILL */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: t.accentSoft, border: `1px solid ${t.accentBorder}`, borderRadius: 999, fontSize: 12, color: t.accent }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.success, display: "inline-block" }} />
          All systems operational
        </div>

        {/* BELL */}
        <button
          onClick={onNotif}
          style={{ width: 36, height: 36, borderRadius: 10, background: t.hover, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: t.text, fontSize: 16 }}
        >
          🔔
          {notifCount > 0 && (
            <span style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: t.danger }} />
          )}
        </button>

        {/* THEME TOGGLE */}
        <button
          onClick={onToggleTheme}
          style={{ padding: "8px 14px", borderRadius: 999, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 12, color: t.muted, fontWeight: 500, fontFamily: "inherit" }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </div>
  );
}

/* ─── NOTIFICATION PANEL ─────────────────────────────────────────────────── */
export function NotifPanel({ t, onClose }: { t: Theme; onClose: () => void }) {
  const notifs = NOTIFICATIONS;
  const typeIcon = (type: string) =>
    type === "success" ? "✅" : type === "error" ? "❌" : type === "warn" ? "⚠️" : "ℹ️";

  return (
    <div
      style={{
        position: "fixed", top: 70, right: 20, width: 340,
        background: t.card, border: `1px solid ${t.border}`,
        borderRadius: 16, boxShadow: t.shadow, zIndex: 999, backdropFilter: "blur(24px)",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${t.border}` }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Notifications</span>
        <button onClick={onClose} style={{ width: 26, height: 26, borderRadius: 6, background: t.hover, border: `1px solid ${t.border}`, color: t.muted, cursor: "pointer", fontSize: 12 }}>✕</button>
      </div>
      {notifs.map((n) => (
        <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, background: n.read ? "transparent" : t.accentSoft }}>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
            <span style={{ fontSize: 16 }}>{typeIcon(n.type)}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{n.title}</div>
              <div style={{ fontSize: 12, color: t.muted }}>{n.body}</div>
              <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{n.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── DASHBOARD SHELL (shared layout wrapper) ────────────────────────────── */
export function DashboardShell({
  t, isDark, toggle, children,
}: { t: Theme; isDark: boolean; toggle: () => void; children: (props: { page: PageId }) => React.ReactNode }) {
  const [page, setPage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <div
      style={{
        display: "flex", minHeight: "100vh",
        background: isDark
          ? `radial-gradient(circle at 20% 10%,rgba(59,130,246,0.07),transparent 40%), radial-gradient(circle at 80% 90%,rgba(37,99,235,0.05),transparent 40%), ${t.pageBg}`
          : t.pageBg,
        fontFamily: "'Space Grotesk',sans-serif",
        transition: "background 0.4s",
      }}
      onClick={() => setShowNotif(false)}
    >
      <Sidebar t={t} active={page} onNav={setPage} collapsed={collapsed} />

      <div style={{ flex: 1, padding: 20, minWidth: 0, overflowX: "hidden" }}>
        <TopBar
          t={t} page={page} isDark={isDark}
          onToggleTheme={toggle}
          onToggleSidebar={() => setCollapsed((c) => !c)}
          notifCount={unread}
          onNotif={(e) => { e.stopPropagation(); setShowNotif((s) => !s); }}
        />
        <div style={{ animation: "fadeIn 0.3s ease" }}>
          {children({ page })}
        </div>
      </div>

      {showNotif && <NotifPanel t={t} onClose={() => setShowNotif(false)} />}
    </div>
  );
}