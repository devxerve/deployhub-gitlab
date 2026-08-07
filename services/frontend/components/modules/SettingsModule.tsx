"use client";

import { useState } from "react";
import type { Theme } from "@/lib/themes";
import { Card, Badge, Btn } from "@/components/ui";
import Image from "next/image";
import { useTranslation, type TranslateFn } from "@/lib/i18n/context";

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
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";






type TabId =
  | "users"
  | "tokens"
  | "notifs"
  | "integrations"
  | "env"
  | "privacy";

const SETTINGS_TABS: Array<{
  id: TabId;
  labelKey: string;
  icon: LucideIcon;
}> = [
  {
    id: "users",
    labelKey: "settings.tabs.users",
    icon: Users,
  },
  {
    id: "tokens",
    labelKey: "settings.tabs.tokens",
    icon: KeyRound,
  },
  {
    id: "notifs",
    labelKey: "settings.tabs.notifs",
    icon: Bell,
  },
  {
    id: "integrations",
    labelKey: "settings.tabs.integrations",
    icon: Link2,
  },
  {
    id: "env",
    labelKey: "settings.tabs.env",
    icon: Settings2,
  },
  {
    id: "privacy",
    labelKey: "settings.tabs.privacy",
    icon: ShieldCheck,
  },
];

function getPrivacySections(tr: TranslateFn): Array<{ title: string; body: string[] }> {
  return [
    {
      title: tr("settings.privacy.s1.title"),
      body: [
        tr("settings.privacy.s1.b1"),
        tr("settings.privacy.s1.b2"),
        tr("settings.privacy.s1.b3"),
      ],
    },
    {
      title: tr("settings.privacy.s2.title"),
      body: [
        tr("settings.privacy.s2.b1"),
        tr("settings.privacy.s2.b2"),
        tr("settings.privacy.s2.b3"),
      ],
    },
    {
      title: tr("settings.privacy.s3.title"),
      body: [
        tr("settings.privacy.s3.b1"),
        tr("settings.privacy.s3.b2"),
        tr("settings.privacy.s3.b3"),
      ],
    },
    {
      title: tr("settings.privacy.s4.title"),
      body: [
        tr("settings.privacy.s4.b1"),
        tr("settings.privacy.s4.b2"),
      ],
    },
    {
      title: tr("settings.privacy.s5.title"),
      body: [
        tr("settings.privacy.s5.b1"),
        tr("settings.privacy.s5.b2"),
        tr("settings.privacy.s5.b3"),
      ],
    },
  ];
}

const INTEGRATIONS: Array<{
  name: string;
  icon: LucideIcon;
  status: "connected" | "disconnected";
  descKey: string;
}> = [
  {
    name: "GitHub",
    icon: GitBranch,
    status: "connected",
    descKey: "settings.integrations.desc.github",
  },
  {
    name: "Slack",
    icon: MessageSquare,
    status: "connected",
    descKey: "settings.integrations.desc.slack",
  },
  {
    name: "Datadog",
    icon: Activity,
    status: "disconnected",
    descKey: "settings.integrations.desc.datadog",
  },
  {
    name: "PagerDuty",
    icon: AlertTriangle,
    status: "disconnected",
    descKey: "settings.integrations.desc.pagerduty",
  },
  {
    name: "Docker Hub",
    icon: Box,
    status: "connected",
    descKey: "settings.integrations.desc.dockerhub",
  },
  {
    name: "AWS S3",
    icon: Cloud,
    status: "connected",
    descKey: "settings.integrations.desc.awss3",
  },
];

export function SettingsModule({ t }: { t: Theme }) {
  const { t: tr } = useTranslation();
  const [tab, setTab] = useState<TabId>("users");
  const privacySections = getPrivacySections(tr);

  const users = [
    { name: "Giselle Maccha",  email: "giselle@deployhub.com", role: "Admin",  avatar: "/avatars/giselle.png" },
    { name: "Loreto Uzquiano", email: "loreto@deployhub.com",  role: "Dev",    avatar: "/avatars/lore.png" },
    { name: "Claudia Gil",     email: "claudia@deployhub.com", role: "Dev",    avatar: "/avatars/clau.png" },
    { name: "Daniel",          email: "daniel@deployhub.com",  role: "Dev",    avatar: "/avatars/daniel.png" },
    { name: "Sam",             email: "sam@deployhub.com",     role: "Viewer", avatar: "/avatars/sam.png" },
  ];

  return (
    <div>
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
                {tr(tabItem.labelKey)}
              </button>
            );
          })}
      </div>

      {tab === "users" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.users.title")}</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                {tr("settings.users.invite")}
              </span>
            </Btn>

          </div>
          {users.map((u) => (
            <div key={u.email} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
              <Image
                src={u.avatar}
                width={36}
                height={36}
                alt={`${u.name} profile`}
                style={{
                  borderRadius: 8,
                  objectFit: "cover",
                }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{u.name}</div>
                <div style={{ fontSize: 12, color: t.muted }}>{u.email}</div>
              </div>
              <Badge label={tr(`settings.users.role.${u.role.toLowerCase()}`)} color={u.role === "Admin" ? t.accent : u.role === "Dev" ? t.success : t.muted} />
              <button style={{ padding: "6px 10px", borderRadius: 8, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{tr("common.edit")}</button>
            </div>
          ))}
        </Card>
      )}

      {tab === "tokens" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.tokens.title")}</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                {tr("settings.tokens.generate")}
              </span>
            </Btn>

          </div>
          {[
            { name: tr("settings.tokens.ciCdName"), prefix: "dhk_ci_••••••••••••8f3a",  created: "2026-01-15", expires: "2026-12-31", scopes: "deploy:write,logs:read" },
            { name: tr("settings.tokens.monitoringName"),     prefix: "dhk_mn_••••••••••••2e9b",  created: "2026-03-01", expires: tr("common.time.never"),      scopes: "metrics:read,logs:read" },
            { name: tr("settings.tokens.webhookName"),       prefix: "dhk_wh_••••••••••••7c12",  created: "2026-05-10", expires: tr("common.time.never"),      scopes: "webhooks:receive" },
          ].map((tk, i) => (
            <div key={i} style={{ padding: "14px", borderRadius: 12, border: `1px solid ${t.border}`, marginBottom: 10, background: t.hover }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{tk.name}</span>
                <button style={{ padding: "4px 10px", borderRadius: 6, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: t.danger, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{tr("settings.tokens.revoke")}</button>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 12, color: t.muted, marginBottom: 6 }}>{tk.prefix}</div>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: t.muted, flexWrap: "wrap" }}>
                <span>{tr("settings.tokens.created")}: {tk.created}</span>
                <span>{tr("settings.tokens.expires")}: {tk.expires}</span>
                <Badge label={tk.scopes} color={t.accent} />
              </div>
            </div>
          ))}
        </Card>
      )}

      {tab === "notifs" && (
        <Card t={t}>
          <h3 style={{ margin: "0 0 16px", color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.notifs.title")}</h3>
          {[
            { labelKey: "settings.notifs.deploySuccess",     email: true,  slack: true,  sms: false },
            { labelKey: "settings.notifs.deployFailed",      email: true,  slack: true,  sms: true  },
            { labelKey: "settings.notifs.criticalErrors",    email: true,  slack: true,  sms: true  },
            { labelKey: "settings.notifs.performanceAlerts", email: false, slack: true,  sms: false },
            { labelKey: "settings.notifs.securityWarnings",  email: true,  slack: false, sms: false },
          ].map((n, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}`, gap: 8 }}>
              <span style={{ fontSize: 13, color: t.text }}>{tr(n.labelKey)}</span>
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
                  <span style={{ color: t.muted }}>{tr(`settings.notifs.channel.${ch}`)}</span>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}

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
            {tr(integration.descKey)}
          </div>

          <Badge
            label={tr(`settings.integrations.status.${integration.status}`)}
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
              ? tr("settings.integrations.configure")
              : tr("settings.integrations.connect")}
          </button>
        </Card>
      );
    })}
  </div>
)}

      {tab === "env" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.env.title")}</h3>
            <Btn t={t}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 7,
                }}
              >
                <Plus size={14} aria-hidden="true" />
                {tr("settings.env.addVariable")}
              </span>
            </Btn>
          </div>
          {[
            { key: "DEPLOYHUB_API_URL", val: "https://api.deployhub.io",   scopeKey: "settings.env.scope.global"       },
            { key: "REGISTRY_URL",      val: "registry.deployhub.io",      scopeKey: "settings.env.scope.global"       },
            { key: "LOG_LEVEL",         val: "info",                       scopeKey: "settings.env.scope.global"       },
            { key: "MAX_BUILD_TIME",    val: "600",                        scopeKey: "settings.env.scope.global"       },
            { key: "SLACK_WEBHOOK",     val: "••••••••••••••••••••••••",   scopeKey: "settings.env.scope.notification" },
          ].map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1fr 60px", gap: 8, alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: t.accent }}>{e.key}</span>
              <span style={{ fontFamily: "monospace", fontSize: 12, color: t.text }}>{e.val}</span>
              <Badge label={tr(e.scopeKey)} color={t.muted} />
              <button style={{ padding: "5px 8px", borderRadius: 6, background: "transparent", border: `1px solid ${t.border}`, color: t.muted, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{tr("common.edit")}</button>
            </div>
          ))}
        </Card>
      )}
      {tab === "privacy" && (
        <Card t={t}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 12, flexWrap: "wrap" }}>
            <div>
              <h3 style={{ margin: 0, color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.privacy.title")}</h3>
              <p style={{ margin: "4px 0 0", color: t.muted, fontSize: 12 }}>{tr("settings.privacy.subtitle")}</p>
            </div>
            <Badge label={tr("settings.privacy.lastUpdated", { date: "2026-08-06" })} color={t.muted} />
          </div>

          {privacySections.map((section) => (
            <div key={section.title} style={{ marginBottom: 20 }}>
              <h4 style={{ margin: "0 0 8px", color: t.text, fontSize: 13, fontWeight: 700 }}>{section.title}</h4>
              <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 6 }}>
                {section.body.map((line) => (
                  <li key={line} style={{ color: t.muted, fontSize: 12.5, lineHeight: 1.6 }}>{line}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ paddingTop: 12, borderTop: `1px solid ${t.border}`, color: t.muted, fontSize: 12 }}>
            {tr("settings.privacy.contact")}
          </div>
        </Card>
      )}
    </div>
  );
}
