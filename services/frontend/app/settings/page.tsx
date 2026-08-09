"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Zap } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useTranslation } from "@/lib/i18n/context";
import { SettingsModule } from "@/components/modules/SettingsModule";

export default function SettingsPage() {
  const { t } = useTheme();
  const { t: tr } = useTranslation();
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: t.pageBg, display: "flex", flexDirection: "column" }}>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 24px",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: t.accentSoft,
              border: `1px solid ${t.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: t.accent,
              flexShrink: 0,
            }}
          >
            <Zap size={15} aria-hidden="true" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, color: t.text, fontFamily: "'JetBrains Mono', monospace" }}>
            Deploy<span style={{ color: t.accent }}>Hub</span>
          </span>
        </div>

        <button
          onClick={() => router.push("/login")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            borderRadius: 999,
            cursor: "pointer",
            background: "transparent",
            border: `1px solid ${t.border}`,
            color: t.muted,
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "inherit",
          }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          {tr("settings.backToLogin")}
        </button>
      </header>

      <main style={{ flex: 1, padding: "32px 20px 60px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 1080 }}>
          <SettingsModule t={t} />
        </div>
      </main>
    </div>
  );
}
