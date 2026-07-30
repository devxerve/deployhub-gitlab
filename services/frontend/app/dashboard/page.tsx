// app/dashboard/page.tsx
"use client";

import { useTheme } from "@/hooks/useTheme";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { DashboardShell } from "@/components/layout";
import { DashboardModule }   from "@/components/modules/DashboardModule";
import { ProjectsModule }    from "@/components/modules/ProjectsModule";
import { DeploymentsModule } from "@/components/modules/DeploymentsModule";
import { PipelineModule }    from "@/components/modules/PipelineModule";
import { MonitoringModule }  from "@/components/modules/MonitoringModule";
import { LogsModule }        from "@/components/modules/LogsModule";
import { EvaluationModule }  from "@/components/modules/EvaluationModule";
import { SettingsModule }    from "@/components/modules/SettingsModule";

export default function DashboardPage() {
  const { t, isDark, toggle } = useTheme();
  const { isLoading, isAuthenticated } = useAuthGuard();

  // Pantalla de carga mientras se verifica la sesión
  if (isLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#020617",
        color: "#64748b",
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: 14,
        gap: 12,
      }}>
        <div style={{
          width: 20,
          height: 20,
          borderRadius: "50%",
          border: "2px solid #3b82f6",
          borderTopColor: "transparent",
          animation: "spin 0.8s linear infinite",
        }} />
        Verificando sesión...
        <style>{"@keyframes spin { to { transform: rotate(360deg) } }"}</style>
      </div>
    );
  }

  // Si no está autenticado, useAuthGuard ya redirige. Esto evita flash del contenido.
  if (!isAuthenticated) return null;

  return (
    <DashboardShell t={t} isDark={isDark} toggle={toggle}>
      {({ page }) => (
        <>
          {page === "dashboard"   && <DashboardModule   t={t} />}
          {page === "projects"    && <ProjectsModule    t={t} />}
          {page === "deployments" && <DeploymentsModule t={t} />}
          {page === "pipeline"    && <PipelineModule    t={t} />}
          {page === "monitoring"  && <MonitoringModule  t={t} />}
          {page === "logs"        && <LogsModule        t={t} />}
          {page === "evaluation"  && <EvaluationModule  t={t} />}
          {page === "settings"    && <SettingsModule    t={t} />}
        </>
      )}
    </DashboardShell>
  );
}