// app/metrics/page.tsx
"use client";
import { useTheme } from "@/hooks/useTheme";
import { MonitoringModule } from "@/components/modules/MonitoringModule";
export default function MetricsPage() {
  const { t } = useTheme();
  return <MonitoringModule t={t} />;
}