"use client";

import { useState } from "react";

export default function Terminal() {
  const [input, setInput] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const runCommand = () => {
    let response = "Comando desconocido";

    if (input === "deploy") {
      response = "🚀 Deploy ejecutado correctamente";
    } else if (input === "test") {
      response = "🧪 Tests OK";
    } else if (input === "rollback") {
      response = "↩️ Rollback completado";
    }

    setLogs([...logs, `> ${input}`, response]);
    setInput("");
  };

  return (
    <div
      style={{
         flex:1,
        background: "var(--sidebar)",
        color: "#22c55e",
        padding: "20px",
        borderRadius: "12px",
        fontFamily: "monospace",
        boxShadow: "0 0 20px rgba(34,197,94,0.4)"
      }}
    >
      <h3 style={{ color: "#22c55e" }}>Terminal</h3>

      <div style={{ minHeight: "100px" }}>
        {logs.map((log, i) => (
          <p key={i}>{log}</p>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{
          width: "80%",
          background: "var(--sidebar)",
          color: "#22c55e",
          border: "none",
          outline: "none"
        }}
        placeholder="Escribe comando..."
        onKeyDown={(e) => {
          if (e.key === "Enter") runCommand();
        }}
      />

      <button
        onClick={runCommand}
        style={{
          marginLeft: "10px",
          background: "var(--sidebar)",
          border: "none",
          padding: "5px 10px",
          cursor: "pointer"
        }}
      >
        Run
      </button>
    </div>
  );
}