"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { Card, Badge, Btn } from "@/components/ui";
import Image from "next/image";

import {
  Activity,
  AlertTriangle,
  Bell,
  Box,
  Check,
  Cloud,
  GitBranch,
  KeyRound,
  Link2,
  MessageSquare,
  Plus,
  Settings2,
  Users,
  type LucideIcon,
} from "lucide-react";






type TabId =
  | "users"
  | "tokens"
  | "notifs"
  | "integrations"
  | "env";

const SETTINGS_TABS: Array<{
  id: TabId;
  label: string;
  icon: LucideIcon;
}> = [
  {
    id: "users",
    label: "Users",
    icon: Users,
  },
  {
    id: "tokens",
    label: "API Tokens",
    icon: KeyRound,
  },
  {
    id: "notifs",
    label: "Notifications",
    icon: Bell,
  },
  {
    id: "integrations",
    label: "Integrations",
    icon: Link2,
  },
  {
    id: "env",
    label: "Env Variables",
    icon: Settings2,
  },
];

const INTEGRATIONS: Array<{
  name: string;
  icon: LucideIcon;
  status: "connected" | "disconnected";
  desc: string;
}> = [
  {
    name: "GitHub",
    icon: GitBranch,
    status: "connected",
    desc: "Source control and webhooks",
  },
  {
    name: "Slack",
    icon: MessageSquare,
    status: "connected",
    desc: "Deployment notifications",
  },
  {
    name: "Datadog",
    icon: Activity,
    status: "disconnected",
    desc: "Metrics and APM",
  },
  {
    name: "PagerDuty",
    icon: AlertTriangle,
    status: "disconnected",
    desc: "Incident management",
  },
  {
    name: "Docker Hub",
    icon: Box,
    status: "connected",
    desc: "Container registry",
  },
  {
    name: "AWS S3",
    icon: Cloud,
    status: "connected",
    desc: "Artifact storage",
  },
];

export function SettingsModule({ t }: { t: Theme }) {
  const [tab, setTab] = useState<TabId>("users");

  const users = [
    { name: "Giselle Maccha", email: "giselle@deployhub.com", role: "Admin",  avatar: "26"  },
    { name: "Loreto Uzquiano", email: "loreto@deployhub.com",     role: "Dev",    avatar: "20" },
    { name: "Claudia Gil",      email: "claudia@deployhub.com",    role: "Dev",    avatar: "44"  },
    { name: "Daniel",     email: "daniel@deployhub.com",     role: "Dev",    avatar: "7" },
    { name: "Sam",    email: "sam@deployhub.com",  role: "Viewer", avatar: "8" },
  ];

  return (
    <div>
      {/* TAB STRIP */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {SETTINGS_TABS.map((tabItem) => {
            const Icon = tabItem.icon;
            return (
              <button
                key={tabItem.id}
                onClick={() => setTab(tabItem.id)}
                style={{
                  padding: "9px 14px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  background:
                    tab === tabItem.id
                      ? t.accentSoft
                      : "transparent",
                  border:
                    tab === tabItem.id
                      ? `1px solid ${t.accentBorder}`
                      : `1px solid ${t.border}`,
                  color:
                    tab === tabItem.id
                      ? t.accent
                      : t.muted,
                  transition: "all 0.2s",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Icon size={14} aria-hidden="true" />
                {tabItem.label}
              </button>
            );
          })}
      </div>

      {/* ── USERS ── */}
      {tab === "users" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Team Members</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                Invite
              </span>
            </Btn>

          </div>
          {users.map((u) => (
            <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
              <Image
                src={`https://i.pravatar.cc/36?img=${u.avatar}`}
                width={36}
                height={36}
                alt={`${u.name} profile`}
                style={{
                  borderRadius: "50%",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{u.name}</div>
                <div style={{ fontSize: 12, color: t.muted }}>{u.email}</div>
              </div>
              <Badge label={u.role} color={u.role === "Admin" ? t.accent : u.role === "Dev" ? t.success : t.muted} />
              <button style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
            </div>
          ))}
        </Card>
      )}

      {/* ── TOKENS ── */}
      {tab === "tokens" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>API Tokens</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                Generate
              </span>
            </Btn>

          </div>
          {[
            { name: "CI/CD Pipeline Token", prefix: "dhk_ci_••••••••••••8f3a",  created: "2026-01-15", expires: "2026-12-31", scopes: "deploy:write,logs:read" },
            { name: "Monitoring Token",     prefix: "dhk_mn_••••••••••••2e9b",  created: "2026-03-01", expires: "Never",      scopes: "metrics:read,logs:read" },
            { name: "Webhook Secret",       prefix: "dhk_wh_••••••••••••7c12",  created: "2026-05-10", expires: "Never",      scopes: "webhooks:receive" },
          ].map((tk, i) => (
            <div key={i} style={{ padding: "14px", borderRadius: 12, border: `1px solid ${t.border}`, marginBottom: 10, background: t.hover }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tk.name}</span>
                <button style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: t.danger, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Revoke</button>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: t.muted, marginBottom: 6 }}>{tk.prefix}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: t.muted, flexWrap: "wrap" }}>
                <span>Created: {tk.created}</span>
                <span>Expires: {tk.expires}</span>
                <Badge label={tk.scopes} color={t.accent} />
              </div>
            </div>
          ))}
        </Card>
      )}

      {/* ── NOTIFICATIONS ── */}
      {tab === "notifs" && (
        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>Notification Preferences</h3>
          {[
            { label: "Deploy Success",     email: true,  slack: true,  sms: false },
            { label: "Deploy Failed",      email: true,  slack: true,  sms: true  },
            { label: "Critical Errors",    email: true,  slack: true,  sms: true  },
            { label: "Performance Alerts", email: false, slack: true,  sms: false },
            { label: "Security Warnings",  email: true,  slack: false, sms: false },
          ].map((n, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
              <span style={{ fontSize: 13, color: t.text }}>{n.label}</span>
              {(["email", "slack", "sms"] as const).map((ch) => (
                <div key={ch} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  <div style={{ width: 18, height: 18, borderRadius: 4, border: `1.5px solid ${n[ch] ? t.accent : t.border}`, background: n[ch] ? t.accentSoft : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                   {n[ch] && (
                      <Check
                        size={11}
                        color={t.accent}
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <span style={{ color: t.muted, textTransform: "capitalize" }}>{ch}</span>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}

      {/* ── INTEGRATIONS ── */}
{tab === "integrations" && (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: 14,
    }}
  >
    {INTEGRATIONS.map((integration) => {
      const Icon = integration.icon;

      return (
        <Card
          key={integration.name}
          t={t}
          style={{ padding: 18 }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: t.accentSoft,
              border: `1px solid ${t.accentBorder}`,
              color: t.accent,
              marginBottom: 10,
            }}
          >
            <Icon size={21} aria-hidden="true" />
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: t.text,
              marginBottom: 4,
            }}
          >
            {integration.name}
          </div>

          <div
            style={{
              fontSize: 12,
              color: t.muted,
              marginBottom: 12,
            }}
          >
            {integration.desc}
          </div>

          <Badge
            label={integration.status}
            color={
              integration.status === "connected"
                ? t.success
                : t.muted
            }
          />

          <button
            type="button"
            style={{
              display: "block",
              width: "100%",
              marginTop: 10,
              padding: 7,
              borderRadius: 8,
              background:
                integration.status === "connected"
                  ? t.hover
                  : t.accentSoft,
              border: `1px solid ${
                integration.status === "connected"
                  ? t.border
                  : t.accentBorder
              }`,
              color:
                integration.status === "connected"
                  ? t.muted
                  : t.accent,
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {integration.status === "connected"
              ? "Configure"
              : "Connect"}
          </button>
        </Card>
      );
    })}
  </div>
)}

      {/* ── ENV VARIABLES ── */}
      {tab === "env" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>Global Environment Variables</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                Add Variable
              </span>
            </Btn>
          </div>
          {[
            { key: "DEPLOYHUB_API_URL", val: "https://api.deployhub.io",   scope: "Global"       },
            { key: "REGISTRY_URL",      val: "registry.deployhub.io",      scope: "Global"       },
            { key: "LOG_LEVEL",         val: "info",                       scope: "Global"       },
            { key: "MAX_BUILD_TIME",    val: "600",                        scope: "Global"       },
            { key: "SLACK_WEBHOOK",     val: "••••••••••••••••••••••••",   scope: "Notification" },
          ].map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 60px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: t.accent }}>{e.key}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: t.text }}>{e.val}</span>
              <Badge label={e.scope} color={t.muted} />
              <button style={{ padding: "5px 8px", borderRadius: 6, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>Edit</button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
