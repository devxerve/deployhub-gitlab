// app/dashboard/page.tsx
"use client";

import { useTheme } from "@/hooks/useTheme";
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