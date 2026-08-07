
"use client";
import { useTheme } from "@/hooks/useTheme";
import { SettingsModule } from "@/components/modules/SettingsModule";
export default function SettingsPage() {
  const { t } = useTheme();
  return <SettingsModule t={t} />;
}