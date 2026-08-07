"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import type { Theme } from "@/lib/themes";
import Image from "next/image";
import { getDeployments } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useTranslation, useLanguage } from "@/lib/i18n/context";
import type { Language } from "@/lib/i18n/translations";
import {
  AlertTriangle,
  Bell,
  CheckCheck,
  CheckCircle2,
  CircleGauge,
  FileClock,
  FolderGit2,
  Gauge,
  GitPullRequestArrow,
  Info,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Rocket,
  Settings,
  ShieldCheck,
  Sun,
  X,
  XCircle,
  Zap,
  type LucideIcon,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

 
export const NAV: ReadonlyArray<{ id: PageId; icon: LucideIcon }> = [
  { id: "dashboard", icon: Gauge },
  { id: "projects", icon: FolderGit2 },
  { id: "deployments", icon: Rocket },
  { id: "pipeline", icon: GitPullRequestArrow },
  { id: "monitoring", icon: CircleGauge },
  { id: "logs", icon: FileClock },
  { id: "evaluation", icon: ShieldCheck },
  { id: "settings", icon: Settings },
];



export type PageId =
  | "dashboard"
  | "projects"
  | "deployments"
  | "pipeline"
  | "monitoring"
  | "logs"
  | "evaluation"
  | "settings";

 
export function Sidebar({
  t,
  active,
  onNav,
  collapsed,
  onLogout,
  logoutLoading,
}: {
  t: Theme;
  active: PageId;
  onNav: (id: PageId) => void;
  collapsed: boolean;
  onLogout: () => void;
  logoutLoading: boolean;
}) {
  const { t: tr } = useTranslation();
  return (
    <aside
      style={{
        width: collapsed ? 72 : 240,
        minWidth: collapsed ? 72 : 240,
        minHeight: "100vh",
        height: "100dvh",
        background: t.sidebar,
        borderRight: `1px solid ${t.border}`,
        backdropFilter: "blur(18px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: collapsed ? "20px 8px" : "20px 16px",
        transition: "width 0.22s ease, min-width 0.22s ease",
        flexShrink: 0,
        position: "sticky",
        overflow: "hidden",
        top: 0,
      }}
    >
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, paddingLeft: 4 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
              color: "white",
            }}
          >
            <Zap size={18} fill="currentColor" />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, fontSize: 15, color: t.accent, letterSpacing: "-0.3px" }}>
              Deploy<span style={{ color: t.text }}>Hub</span>
            </span>
          )}
        </div>

        <nav aria-label={tr("sidebar.mainNav")} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <nav
            style={{
              flex: 1,
              minHeight: 0,
              overflowY: "auto",
              overflowX: "hidden",
              padding: "8px 10px 16px",
            }}
          >
          {NAV.map((item) => {
            const isActive = active === item.id;
            const Icon = item.icon;
            const label = tr(`sidebar.${item.id}`);
            return (
              <button
                key={item.id}
                onClick={() => onNav(item.id)}
                title={collapsed ? label : undefined}
                aria-current={isActive ? "page" : undefined}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: collapsed ? 10 : "10px 12px",
                  borderRadius: 10,
                  cursor: "pointer",
                  background: isActive ? t.active : "transparent",
                  border: isActive ? `1px solid ${t.accentBorder}` : "1px solid transparent",
                  color: isActive ? t.menuActive : t.menuText,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  transition: "all 0.2s",
                  textAlign: "left",
                  width: "100%",
                  justifyContent: collapsed ? "center" : "flex-start",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(event) => { if (!isActive) event.currentTarget.style.background = t.hover; }}
                onMouseLeave={(event) => { if (!isActive) event.currentTarget.style.background = "transparent"; }}
              >
                <Icon size={17} aria-hidden="true" />
                {!collapsed && <span>{label}</span>}
              </button>
            );
          })}
          </nav>
        </nav>
      </div>

      <div
        style={{
          background: t.card,
          padding: collapsed ? "9px 6px" : "10px",
          borderRadius: 14,
          border: `1px solid ${t.border}`,
          display: "flex",
          flexDirection: collapsed ? "column" : "row",
          alignItems: "center",
          gap: collapsed ? 8 : 10,
          boxShadow: t.shadow,
        }}
      >
        <Image
          src="/avatars/giselle.png"
          width={32}
          height={32}
          alt={tr("sidebar.userAvatarAlt")}
          style={{
            borderRadius: 8,
            objectFit: "cover",
            flexShrink: 0,
            border: `2px solid ${t.accentBorder}`,
          }}
        />

        {!collapsed && (
          <div
            style={{
              flex: 1,
              minWidth: 0,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 600,
                color: t.text,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {tr("sidebar.user")}
            </p>

            <p
              style={{
                margin: 0,
                fontSize: 11,
                color: t.muted,
              }}
            >
              {tr("sidebar.role")}
            </p>
          </div>
        )}
        <div
        title={tr("sidebar.online")}
        aria-label={tr("sidebar.online")}
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: t.success,
          boxShadow: `0 0 0 3px ${t.successSoft}`,
          flexShrink: 0,
        }}
      />

        <button
          type="button"
          onClick={onLogout}
          disabled={logoutLoading}
          aria-label={tr("sidebar.signOut")}
          title={tr("sidebar.signOut")}
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            border: `1px solid ${t.border}`,
            background: "transparent",
            color: t.muted,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: logoutLoading
              ? "not-allowed"
              : "pointer",
            flexShrink: 0,
            transition:
              "background 0.2s ease, color 0.2s ease, border-color 0.2s ease",
            opacity: logoutLoading ? 0.65 : 1,
          }}
          onMouseEnter={(event) => {
            if (logoutLoading) return;
          
            event.currentTarget.style.background =
              "rgba(239,68,68,0.12)";
          
            event.currentTarget.style.borderColor =
              "rgba(239,68,68,0.35)";
          
            event.currentTarget.style.color =
              t.danger;
          }}
          onMouseLeave={(event) => {
            event.currentTarget.style.background =
              "transparent";
          
            event.currentTarget.style.borderColor =
              t.border;
          
            event.currentTarget.style.color =
              t.muted;
          }}
        >
          {logoutLoading ? (
            <LoaderCircle
              size={16}
              className="icon-spin"
              aria-hidden="true"
            />
          ) : (
            <LogOut
              size={16}
              aria-hidden="true"
            />
          )}
        </button>
      </div>
    </aside>
  );
}


 
const PAGE_TITLE_KEYS: Record<PageId, string> = {
  dashboard: "pageTitle.dashboard",
  projects: "pageTitle.projects",
  deployments: "pageTitle.deployments",
  pipeline: "pageTitle.pipeline",
  monitoring: "pageTitle.monitoring",
  logs: "pageTitle.logs",
  evaluation: "pageTitle.evaluation",
  settings: "pageTitle.settings",
};

const LANGUAGE_OPTIONS: ReadonlyArray<Language> = ["en", "es", "fr"];

function LanguageSwitcher({ t }: { t: Theme }) {
  const { language, setLanguage } = useLanguage();
  const { t: tr } = useTranslation();

  return (
    <div
      role="group"
      aria-label={tr("topbar.selectLanguage")}
      style={{ display: "inline-flex", alignItems: "center", gap: 2, padding: 3, borderRadius: 999, background: t.card, border: `1px solid ${t.border}` }}
    >
      {LANGUAGE_OPTIONS.map((option) => {
        const active = language === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => setLanguage(option)}
            aria-pressed={active}
            style={{
              padding: "5px 10px",
              borderRadius: 999,
              border: "none",
              cursor: "pointer",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "inherit",
              letterSpacing: "0.3px",
              background: active ? t.accentSoft : "transparent",
              color: active ? t.accent : t.muted,
              transition: "all 0.2s",
            }}
          >
            {option.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}

export function TopBar({
  t,
  page,
  isDark,
  onToggleTheme,
  onToggleSidebar,
  notifCount,
  onNotif,
}: {
  t: Theme;
  page: PageId;
  isDark: boolean;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  notifCount: number;
  onNotif: (event: React.MouseEvent) => void;
}) {
  const { t: tr } = useTranslation();
  return (
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, padding: "14px 20px", marginBottom: 20, backdropFilter: "blur(16px)", boxShadow: t.shadow, gap: 14, flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          onClick={onToggleSidebar}
          aria-label={tr("topbar.toggleSidebar")}
          style={{ width: 36, height: 36, borderRadius: 10, background: "transparent", border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: t.text }}
        >
          <Menu size={17} />
        </button>
        <div>
          <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: t.text }}>{tr(PAGE_TITLE_KEYS[page])}</h1>
          <p style={{ margin: 0, fontSize: 12, color: t.muted }}>{tr("topbar.platformTag")}</p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 14px", background: t.accentSoft, border: `1px solid ${t.accentBorder}`, borderRadius: 999, fontSize: 12, color: t.accent }}>
          <span aria-hidden="true" style={{ width: 7, height: 7, borderRadius: "50%", background: t.success, display: "inline-block" }} />
          {tr("topbar.systemsOperational")}
        </div>

        <button
          onClick={onNotif}
          aria-label={`${tr("topbar.notifications")}${notifCount ? `, ${notifCount} ${tr("topbar.unread")}` : ""}`}
          style={{ width: 36, height: 36, borderRadius: 10, background: t.hover, border: `1px solid ${t.border}`, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: t.text }}
        >
          <Bell size={17} />
          {notifCount > 0 && <span aria-hidden="true" style={{ position: "absolute", top: 6, right: 6, width: 8, height: 8, borderRadius: "50%", background: t.danger }} />}
        </button>

        <LanguageSwitcher t={t} />

        <button
          onClick={onToggleTheme}
          aria-label={isDark ? tr("topbar.switchToLight") : tr("topbar.switchToDark")}
          style={{ padding: "8px 13px", borderRadius: 999, background: t.card, border: `1px solid ${t.border}`, cursor: "pointer", fontSize: 12, color: t.muted, fontWeight: 500, fontFamily: "inherit", display: "inline-flex", alignItems: "center", gap: 7 }}
        >
          {isDark ? (
            <>
              <Sun size={14} aria-hidden="true" />
              {tr("topbar.light")}
            </>
              ) : (
            <>
              <Moon size={14} aria-hidden="true" />
              {tr("topbar.dark")}
            </>
          )}
        </button>
      </div>
    </header>
  );
}

 
export interface AppNotification {
  id: string | number;
  type: "success" | "error" | "warn" | "info";
  title?: string;
  titleKey?: string;
  body?: string;
  bodyKey?: string;
  bodyVars?: Record<string, string | number>;
  time?: string;
  timeKey?: string;
  read: boolean;
}

function NotificationIcon({ type, color }: { type: string; color: string }) {
  if (type === "success") return <CheckCircle2 size={17} color={color} />;
  if (type === "error") return <XCircle size={17} color={color} />;
  if (type === "warn") return <AlertTriangle size={17} color={color} />;
  return <Info size={17} color={color} />;
}

export function NotifPanel({
  t,
  notifications,
  onClose,
  onMarkAllRead,
}: {
  t: Theme;
  notifications: AppNotification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}) {
  const { t: tr } = useTranslation();
  const hasUnread = notifications.some((notification) => !notification.read);
  return (
    <div style={{ position: "fixed", top: 70, right: 20, width: 340, maxWidth: "calc(100vw - 40px)", maxHeight: "70vh", overflowY: "auto", background: t.card, border: `1px solid ${t.border}`, borderRadius: 16, boxShadow: t.shadow, zIndex: 999, backdropFilter: "blur(24px)" }} onClick={(event) => event.stopPropagation()}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{tr("notif.title")}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={onMarkAllRead}
            disabled={!hasUnread}
            title={tr("notif.markAllRead")}
            aria-label={tr("notif.markAllRead")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              padding: "5px 9px",
              borderRadius: 7,
              background: "transparent",
              border: `1px solid ${t.border}`,
              color: hasUnread ? t.accent : t.muted,
              fontSize: 11,
              fontWeight: 600,
              cursor: hasUnread ? "pointer" : "not-allowed",
              opacity: hasUnread ? 1 : 0.5,
              fontFamily: "inherit",
            }}
          >
            <CheckCheck size={13} aria-hidden="true" />
            {tr("notif.markAllRead")}
          </button>
          <button onClick={onClose} aria-label={tr("notif.close")} style={{ width: 28, height: 28, borderRadius: 7, background: t.hover, border: `1px solid ${t.border}`, color: t.muted, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <X size={14} />
          </button>
        </div>
      </div>
      {notifications.length === 0 && (
        <div style={{ padding: "20px 16px", fontSize: 12, color: t.muted, textAlign: "center" }}>{tr("notif.empty")}</div>
      )}
      {notifications.map((notification) => {
        const color = notification.type === "success" ? t.success : notification.type === "error" ? t.danger : notification.type === "warn" ? t.warning : t.accent;
        const title = notification.titleKey ? tr(notification.titleKey) : notification.title ?? "";
        const body = notification.bodyKey ? tr(notification.bodyKey, notification.bodyVars) : notification.body ?? "";
        const time = notification.timeKey ? tr(notification.timeKey) : notification.time ?? "";
        return (
          <div key={notification.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${t.border}`, background: notification.read ? "transparent" : t.accentSoft }}>
            <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
              <NotificationIcon type={notification.type} color={color} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{title}</div>
                <div style={{ fontSize: 12, color: t.muted }}>{body}</div>
                <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{time}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

 
function LogoutDialog({
  t,
  open,
  loading,
  onCancel,
  onConfirm,
}: {
  t: Theme;
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const { t: tr } = useTranslation();
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (
        event.key === "Escape" &&
        !loading
      ) {
        onCancel();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [loading, onCancel, open]);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={() => {
        if (!loading) {
          onCancel();
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        background: "rgba(2,6,23,0.64)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
        aria-describedby="logout-description"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 18,
          padding: 22,
          background: t.card,
          border: `1px solid ${t.border}`,
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.32)",
          animation: "fadeIn 0.2s ease",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.danger,
            background:
              "rgba(239,68,68,0.12)",
            border:
              "1px solid rgba(239,68,68,0.25)",
            marginBottom: 16,
          }}
        >
          <LogOut
            size={21}
            aria-hidden="true"
          />
        </div>

        <h2
          id="logout-title"
          style={{
            margin: "0 0 8px",
            color: t.text,
            fontSize: 18,
            fontWeight: 700,
          }}
        >
          {tr("logout.title")}
        </h2>

        <p
          id="logout-description"
          style={{
            margin: 0,
            color: t.muted,
            fontSize: 13,
            lineHeight: 1.6,
          }}
        >
          {tr("logout.description")}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 22,
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            style={{
              padding: "10px 15px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: t.hover,
              color: t.text,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontFamily: "inherit",
            }}
          >
            {tr("common.cancel")}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              minWidth: 116,
              padding: "10px 15px",
              borderRadius: 10,
              border:
                "1px solid rgba(239,68,68,0.4)",
              background: t.danger,
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
              cursor: loading
                ? "not-allowed"
                : "pointer",
              fontFamily: "inherit",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 7,
              opacity: loading ? 0.75 : 1,
            }}
          >
            {loading ? (
              <>
                <LoaderCircle
                  size={15}
                  className="icon-spin"
                  aria-hidden="true"
                />
                {tr("logout.signingOut")}
              </>
            ) : (
              <>
                <LogOut
                  size={15}
                  aria-hidden="true"
                />
                {tr("logout.signOut")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 


 
export function DashboardShell({
  t,
  isDark,
  toggle,
  children,
}: {
  t: Theme;
  isDark: boolean;
  toggle: () => void;
  children: (props: { page: PageId }) => React.ReactNode;
}) {
  const router = useRouter();
  const [page, setPage] = useState<PageId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showLogout, setShowLogout] =useState(false);
  const [logoutLoading, setLogoutLoading] =useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const lastStatusRef = useRef<Record<string, string>>({});
  const firstPollRef = useRef(true);
  const unread = notifications.filter((notification) => !notification.read).length;

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const deploys = await getDeployments();
        if (cancelled) return;

        const newNotifications: AppNotification[] = [];
        for (const deploy of deploys) {
          const status = deploy.status.toLowerCase();
          const previousStatus = lastStatusRef.current[deploy.id];

          if (!firstPollRef.current && previousStatus !== status && (status === "success" || status === "failed")) {
            newNotifications.push({
              id: `deploy-${deploy.id}-${status}-${Date.now()}`,
              type: status === "success" ? "success" : "error",
              titleKey: status === "success" ? "notif.deploySuccessTitle" : "notif.deployFailedTitle",
              bodyKey: status === "success" ? "notif.deploySuccessBody" : "notif.deployFailedBody",
              bodyVars: { project: deploy.projectId },
              timeKey: "common.time.justNow",
              read: false,
            });
          }

          lastStatusRef.current[deploy.id] = status;
        }

        firstPollRef.current = false;

        if (newNotifications.length > 0) {
          setNotifications((current) => [...newNotifications, ...current]);
        }
      } catch {
         
      }
    }

    poll();
    const interval = window.setInterval(poll, 5000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  function markAllNotificationsRead() {
    setNotifications((current) => current.map((notification) => ({ ...notification, read: true })));
  }

  async function handleLogout() {
  if (logoutLoading) return;

  setLogoutLoading(true);

  try {
    window.localStorage.removeItem(
      "deployhub-demo-session",
    );

    await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
} finally {
  router.replace("/login");
  router.refresh();
}
}


  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: isDark
          ? `radial-gradient(circle at 20% 10%,rgba(59,130,246,0.07),transparent 40%), radial-gradient(circle at 80% 90%,rgba(37,99,235,0.05),transparent 40%), ${t.pageBg}`
          : t.pageBg,
        fontFamily: "'Space Grotesk',sans-serif",
        transition: "background 0.4s",
      }}
      onClick={() => setShowNotif(false)}
    >
      <Sidebar
        t={t}
        active={page}
        onNav={setPage}
        collapsed={collapsed}
        onLogout={() => setShowLogout(true)}
        logoutLoading={logoutLoading}
      />

      <main style={{ flex: 1, padding: 20, minWidth: 0, overflowX: "hidden" }}>
        <TopBar
          t={t}
          page={page}
          isDark={isDark}
          onToggleTheme={toggle}
          onToggleSidebar={() => setCollapsed((current) => !current)}
          notifCount={unread}
          onNotif={(event) => { event.stopPropagation(); setShowNotif((current) => !current); }}
        />
        <div style={{ animation: "fadeIn 0.3s ease" }}>{children({ page })}</div>
      </main>

      {showNotif && (
        <NotifPanel
          t={t}
          notifications={notifications}
          onClose={() => setShowNotif(false)}
          onMarkAllRead={markAllNotificationsRead}
        />
      )}
      <LogoutDialog
       t={t}
       open={showLogout}
       loading={logoutLoading}
       onCancel={() => {
         if (!logoutLoading) {
           setShowLogout(false);
         }
       }}
       onConfirm={handleLogout}
      />
    </div>
  );
}