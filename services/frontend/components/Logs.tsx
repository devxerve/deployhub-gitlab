"use client";

import { useEffect, useState } from "react";
import {
  CircleCheck,
  FlaskConical,
  Gauge,
  Rocket,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

type LogType =
  | "deployment"
  | "test"
  | "performance"
  | "success"
  | "warning";

  interface LogItem {
  id: number;
  message: string;
  type: LogType;
}

const LOG_OPTIONS: Array<Omit<LogItem, "id">> = [
  {
    message: "Deploy iniciado...",
    type: "deployment",
  },
  {
    message: "Ejecutando tests...",
    type: "test",
  },
  {
    message: "Analizando performance...",
    type: "performance",
  },
  {
    message: "Deploy completado",
    type: "success",
  },
  {
    message: "CPU alta detectada",
    type: "warning",
  },
];

const LOG_ICONS: Record<LogType, LucideIcon> = {
  deployment: Rocket,
  test: FlaskConical,
  performance: Gauge,
  success: CircleCheck,
  warning: TriangleAlert,
};

const LOG_COLORS: Record<LogType, string> = {
  deployment: "#3b82f6",
  test: "#a855f7",
  performance: "#06b6d4",
  success: "#22c55e",
  warning: "#f59e0b",
};

export default function Logs() {
  const [logs, setLogs] = useState<LogItem[]>([]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const selected =
        LOG_OPTIONS[Math.floor(Math.random() * LOG_OPTIONS.length)];

      setLogs((previous) => [
        ...previous.slice(-5),
        {
          ...selected,
          id: Date.now(),
        },
      ]);
    }, 2000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        background: "var(--sidebar)",
        padding: 20,
        borderRadius: 16,
        fontFamily: "monospace",
        boxShadow: "0 0 20px rgba(34,197,94,0.3)",
      }}
    >
      <h3 style={{ color: "var(--text)" }}>Live Logs</h3>

      {logs.map((log) => {
        const Icon = LOG_ICONS[log.type];
        const color = LOG_COLORS[log.type];

        return (
          <div
            key={log.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              marginBottom: 10,
              color,
            }}
          >
            <Icon size={15} aria-hidden="true" />
            <span>{log.message}</span>
          </div>
        );
      })}
    </div>
  );
}