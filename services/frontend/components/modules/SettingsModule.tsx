"use client";

import { useEffect, useState } from "react";
import type { Theme } from "@/lib/themes";
import { Card, Badge, Btn, Modal, TextInput } from "@/components/ui";
import { registerUser } from "@/lib/api";
import { useTranslation, type TranslateFn } from "@/lib/i18n/context";

import {
  Info,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
  type LucideIcon,
} from "lucide-react";

type TabId = "users" | "about" | "privacy";

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
    id: "about",
    labelKey: "settings.tabs.about",
    icon: Info,
  },
  {
    id: "privacy",
    labelKey: "settings.tabs.privacy",
    icon: ShieldCheck,
  },
];

const NON_ADMIN_TAB_IDS: TabId[] = ["about", "privacy"];

const EMPTY_FORM = { username: "", email: "", password: "" };

interface TeamMember {
  user_id: string;
  username: string;
  email: string;
  provider: string | null;
  role: string | null;
  created_at: string;
}

function initials(name: string): string {
  return name.slice(0, 2).toUpperCase();
}

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

export function SettingsModule({
  t,
  isAdmin = false,
  currentUserId,
}: {
  t: Theme;
  isAdmin?: boolean;
  currentUserId?: string | null;
}) {
  const { t: tr } = useTranslation();
  const visibleTabs = isAdmin
    ? SETTINGS_TABS
    : SETTINGS_TABS.filter((tabItem) => NON_ADMIN_TAB_IDS.includes(tabItem.id));
  const [tab, setTab] = useState<TabId>(isAdmin ? "users" : "about");
  const privacySections = getPrivacySections(tr);

  const [members, setMembers] = useState<TeamMember[] | null>(null);
  const [membersError, setMembersError] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  async function loadMembers() {
    try {
      const res = await fetch("/api/auth/users", { credentials: "include" });
      if (!res.ok) throw new Error("failed");
      const data: { users: TeamMember[] } = await res.json();
      setMembers(data.users);
      setMembersError(false);
    } catch {
      setMembersError(true);
    }
  }

  useEffect(() => {
    if (!isAdmin || tab !== "users") return;
    loadMembers();
  }, [isAdmin, tab]);

  async function handleCreate() {
    setFormError(null);
    setCreating(true);
    try {
      await registerUser(form);
      setForm(EMPTY_FORM);
      setShowCreate(false);
      await loadMembers();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : tr("settings.users.form.error"));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!window.confirm(tr("settings.users.deleteConfirm", { name: member.username }))) return;

    setDeleteError(null);
    try {
      const res = await fetch(`/api/auth/users/${member.user_id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("failed");
      setMembers((current) => current?.filter((item) => item.user_id !== member.user_id) ?? null);
    } catch {
      setDeleteError(tr("settings.users.deleteError"));
    }
  }

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {visibleTabs.map((tabItem) => {
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
            <Btn t={t} onClick={() => { setFormError(null); setForm(EMPTY_FORM); setShowCreate(true); }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
                <Plus size={14} aria-hidden="true" />
                {tr("settings.users.invite")}
              </span>
            </Btn>
          </div>

          {deleteError && (
            <div role="alert" style={{ color: t.danger, fontSize: 13, marginBottom: 12, padding: "9px 12px", background: `${t.danger}12`, border: `1px solid ${t.danger}35`, borderRadius: 8 }}>
              {deleteError}
            </div>
          )}

          {members === null && !membersError && (
            <div style={{ color: t.muted, fontSize: 13, padding: "8px 0" }}>{tr("settings.users.loading")}</div>
          )}

          {membersError && (
            <div style={{ color: t.danger, fontSize: 13, padding: "8px 0" }}>{tr("settings.users.error")}</div>
          )}

          {members !== null && members.length === 0 && (
            <div style={{ color: t.muted, fontSize: 13, padding: "8px 0" }}>{tr("settings.users.empty")}</div>
          )}

          {members?.map((member) => {
            const isMemberAdmin = member.role === "admin";
            const isSelf = member.user_id === currentUserId;
            return (
              <div key={member.user_id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${t.border}` }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 8,
                    background: t.accentSoft,
                    color: t.accent,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {initials(member.username)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{member.username}</div>
                  <div style={{ fontSize: 12, color: t.muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{member.email}</div>
                </div>
                {member.provider && (
                  <Badge label={member.provider} color={t.muted} />
                )}
                <Badge
                  label={tr(`settings.users.role.${isMemberAdmin ? "admin" : "dev"}`)}
                  color={isMemberAdmin ? t.accent : t.success}
                />
                <button
                  onClick={() => handleDelete(member)}
                  disabled={isSelf}
                  title={isSelf ? tr("settings.users.selfDeleteTitle") : tr("settings.users.delete")}
                  aria-label={tr("settings.users.deleteConfirm", { name: member.username })}
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 8,
                    background: "transparent",
                    border: `1px solid ${t.border}`,
                    color: isSelf ? t.border : t.danger,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: isSelf ? "not-allowed" : "pointer",
                    opacity: isSelf ? 0.5 : 1,
                    flexShrink: 0,
                  }}
                >
                  <Trash2 size={14} aria-hidden="true" />
                </button>
              </div>
            );
          })}
        </Card>
      )}

      {tab === "about" && (
        <Card t={t}>
          <h3 style={{ margin: "0 0 6px", color: t.text, fontSize: 15, fontWeight: 600 }}>{tr("settings.about.title")}</h3>
          <p style={{ margin: "0 0 18px", color: t.muted, fontSize: 12.5 }}>{tr("settings.about.subtitle")}</p>

          <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 10 }}>
            {["settings.about.f1", "settings.about.f2", "settings.about.f3", "settings.about.f4"].map((key) => (
              <li key={key} style={{ color: t.text, fontSize: 13, lineHeight: 1.6 }}>{tr(key)}</li>
            ))}
          </ul>

          <div style={{ marginTop: 18, paddingTop: 14, borderTop: `1px solid ${t.border}`, color: t.muted, fontSize: 12 }}>
            {tr("settings.about.stack")}
          </div>
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

      {showCreate && (
        <Modal t={t} title={tr("settings.users.modalTitle")} onClose={() => setShowCreate(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, color: t.muted }}>{tr("settings.users.form.username")}</label>
              <TextInput t={t} value={form.username} onChange={(value) => setForm((current) => ({ ...current, username: value }))} style={{ marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: t.muted }}>{tr("settings.users.form.email")}</label>
              <TextInput t={t} value={form.email} onChange={(value) => setForm((current) => ({ ...current, email: value }))} type="email" style={{ marginTop: 6 }} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: t.muted }}>{tr("settings.users.form.password")}</label>
              <TextInput t={t} value={form.password} onChange={(value) => setForm((current) => ({ ...current, password: value }))} type="password" style={{ marginTop: 6 }} />
            </div>

            {formError && (
              <div role="alert" style={{ color: t.danger, fontSize: 12.5 }}>
                {formError}
              </div>
            )}

            <Btn t={t} onClick={handleCreate} disabled={creating || !form.username || !form.email || !form.password}>
              {tr("settings.users.form.submit")}
            </Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}
