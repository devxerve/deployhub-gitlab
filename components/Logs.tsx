"use client";

import { useEffect, useState } from "react";

export default function Logs() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = [
        "🚀 Deploy iniciado...",
        "🧪 Ejecutando tests...",
        "⚙️ Analizando performance...",
        "✅ Deploy completado",
        "⚠️ CPU alta detectada"
      ];

      const random = newLog[Math.floor(Math.random() * newLog.length)];

      setLogs((prev) => [...prev.slice(-5), random]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        flex: 1,
        background: "var(--sidebar)",
        color: "#22c55e",
        padding: "20px",
        borderRadius: "16px",
        fontFamily: "monospace",
        boxShadow: "0 0 20px rgba(34,197,94,0.3)"
      }}
    >
      <h3>Live Logs</h3>

      {logs.map((log, i) => (
        <p key={i}>{log}</p>
      ))}
    </div>
  );
}