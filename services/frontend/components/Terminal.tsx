"use client";

import { useState } from "react";
import {
  Circle,
  CircleCheck,
  CircleX,
  SquareTerminal,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/context";

export default function Terminal() {
  const { t: tr } = useTranslation();
  const [input, setInput] = useState("");

  const [logs, setLogs] = useState<string[]>([
    "DeployHub CLI v2.1.0",
    "Connected to production environment",
    "Monitoring active deployments..."
  ]);

  function runCommand() {
    if (!input.trim()) return;

    let response = "Command not found";

    if (input === "deploy") {
      response = "Deploy executed successfully";
    } else if (input === "test") {
      response = "All tests passed";
    } else if (input === "rollback") {
      response = "Rollback completed";
    } else if (input === "status") {
      response = "All systems operational";
    } else if (input === "build") {
      response = "Production build completed";
    }

    setLogs((prev) => [
      ...prev,
      `$ ${input}`,
      response
    ]);

    setInput("");
  }

  return (
    <div
      style={{
        flex: 1,

        background: "var(--card)",

        borderRadius: "24px",

        border: "1px solid var(--border)",

        overflow: "hidden",

        backdropFilter: "blur(18px)",

        boxShadow: "var(--shadow)",

        animation: "fadeIn 0.5s ease"
      }}
    >
      <div
        style={{
          height: "52px",

          background: "rgba(255,255,255,0.03)",

          borderBottom: "1px solid var(--border)",

          display: "flex",

          alignItems: "center",

          justifyContent: "space-between",

          padding: "0 18px"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#ef4444"
            }}
          />

          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#facc15"
            }}
          />

          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: "#22c55e"
            }}
          />
        </div>

        <span
          style={{
            color: "var(--muted)",
            fontSize: "13px",
            fontWeight: 600,
            letterSpacing: "0.4px"
          }}
        >
          {tr("terminal.title")}
        </span>

        <div
          style={{
            color: "#22c55e",
            fontSize: "12px",
            fontWeight: 700
          }}
        >
          <span
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  }}
>
  <Circle
    size={8}
    fill="#22c55e"
    color="#22c55e"
    aria-hidden="true"
  />
  {tr("terminal.online")}
</span>
        </div>
      </div>

      <div
        style={{
          padding: "20px",

          minHeight: "320px",

          maxHeight: "320px",

          overflowY: "auto",

          fontFamily: "monospace",

          background: `
            radial-gradient(
              circle at top right,
              rgba(34,197,94,0.08),
              transparent 30%
            ),
            var(--card)
          `
        }}
      >
        {logs.map((log, index) => {
          const isCommand = log.startsWith("$");
          const isTitle = index === 0;
          const isError = log === "Command not found";
                
          return (
            <div
              key={`${index}-${log}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 10,
                color: isCommand
                  ? "#38bdf8"
                  : isError
                    ? "#ef4444"
                    : "#22c55e",
                fontSize: 14,
                lineHeight: 1.6,
                animation: "fadeIn 0.3s ease",
              }}
            >
              {!isCommand && (
                isTitle ? (
                  <SquareTerminal size={15} aria-hidden="true" />
                ) : isError ? (
                  <CircleX size={15} aria-hidden="true" />
                ) : (
                  <CircleCheck size={15} aria-hidden="true" />
                )
              )}
        
              <span>{log}</span>
            </div>
          );
        })}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "10px"
          }}
        >
          <span
            style={{
              color: "#38bdf8",
              marginRight: "10px",
              fontWeight: "bold"
            }}
          >
            $
          </span>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={tr("terminal.placeholder")}

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                runCommand();
              }
            }}

            style={{
              flex: 1,

              background: "transparent",

              border: "none",

              outline: "none",

              color: "#22c55e",

              fontFamily: "monospace",

              fontSize: "14px"
            }}
          />
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid var(--border)",

          padding: "14px 18px",

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          background: "rgba(255,255,255,0.02)"
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          {["deploy", "test", "build", "rollback"].map((cmd) => (
            <button
              key={cmd}
              onClick={() => setInput(cmd)}
              style={{
                background: "var(--hover)",

                border: "1px solid var(--border)",

                color: "var(--text)",

                padding: "6px 12px",

                borderRadius: "10px",

                cursor: "pointer",

                fontSize: "12px",

                transition: "0.3s"
              }}
            >
              {cmd}
            </button>
          ))}
        </div>

        <button
          onClick={runCommand}
          style={{
            background: `
              linear-gradient(
                135deg,
                #7c3aed,
                #8b5cf6
              )
            `,

            border: "none",

            color: "white",

            padding: "10px 18px",

            borderRadius: "12px",

            cursor: "pointer",

            fontWeight: "bold",

            boxShadow: `
              0 10px 20px
              rgba(124,58,237,0.3)
            `
          }}
        >
          {tr("terminal.run")}
        </button>
      </div>
    </div>
  );
}