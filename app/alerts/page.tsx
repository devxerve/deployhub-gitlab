// app/logs/page.tsx
"use client";
import { useTheme } from "@/hooks/useTheme";
import { LogsModule } from "@/components/modules/LogsModule";
export default function LogsPage() {
  const { t } = useTheme();
  return <LogsModule t={t} />;
}