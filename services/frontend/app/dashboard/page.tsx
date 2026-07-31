"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { LoaderCircle } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";
import { DashboardShell } from "@/components/layout";
import { DashboardModule } from "@/components/modules/DashboardModule";
import { ProjectsModule } from "@/components/modules/ProjectsModule";
import { DeploymentsModule } from "@/components/modules/DeploymentsModule";
import { PipelineModule } from "@/components/modules/PipelineModule";
import { MonitoringModule } from "@/components/modules/MonitoringModule";
import { LogsModule } from "@/components/modules/LogsModule";
import { EvaluationModule } from "@/components/modules/EvaluationModule";
import { SettingsModule } from "@/components/modules/SettingsModule";

export default function DashboardPage() {
  const { t, isDark, toggle } = useTheme();
  const router = useRouter();

  const [checkingSession, setCheckingSession] =
    useState(true);

  useEffect(() => {
    let cancelled = false;

    async function verifySession() {
      const hasDemoSession =
        window.localStorage.getItem(
          "deployhub-demo-session",
        ) === "active";

      if (hasDemoSession) {
        if (!cancelled) {
          setCheckingSession(false);
        }

        return;
      }

      const oauthSession = await getSession();

      if (cancelled) return;

      if (!oauthSession) {
        router.replace("/login");
        return;
      }

      setCheckingSession(false);
    }

    void verifySession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          background: t.pageBg,
          color: t.muted,
        }}
      >
        <LoaderCircle
          size={20}
          className="icon-spin"
        />

        Verifying session…
      </div>
    );
  }

  return (
    <DashboardShell
      t={t}
      isDark={isDark}
      toggle={toggle}
    >
      {({ page }) => (
        <>
          {page === "dashboard" && (
            <DashboardModule t={t} />
          )}

          {page === "projects" && (
            <ProjectsModule t={t} />
          )}

          {page === "deployments" && (
            <DeploymentsModule t={t} />
          )}

          {page === "pipeline" && (
            <PipelineModule t={t} />
          )}

          {page === "monitoring" && (
            <MonitoringModule t={t} />
          )}

          {page === "logs" && (
            <LogsModule t={t} />
          )}

          {page === "evaluation" && (
            <EvaluationModule t={t} />
          )}

          {page === "settings" && (
            <SettingsModule t={t} />
          )}
        </>
      )}
    </DashboardShell>
  );
}