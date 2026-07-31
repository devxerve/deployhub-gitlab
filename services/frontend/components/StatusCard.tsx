"use client";
import type { ReactNode } from "react";

import {
  ShieldCheck,
  AlertTriangle,
  ShieldX
} from "lucide-react";

type SystemStatus = "GOOD" | "BAD" | "WARNING";

interface StatusConfig {
  color: string;
  text: string;
  icon: ReactNode;
}

interface StatusCardProps {
  status: SystemStatus;
}

export default function StatusCard({
  status,
}: StatusCardProps) {
  const config: Record<SystemStatus, StatusConfig> = {
    GOOD: {
      color: "#22c55e",
      text: "All systems operational",
      icon: <ShieldCheck color="#22c55e" size={28} />
    },

    BAD: {
      color: "#ef4444",
      text: "System failure detected",
      icon: <ShieldX color="#ef4444" size={28} />
    },

    WARNING: {
      color: "#facc15",
      text: "Performance issues detected",
      icon: <AlertTriangle color="#facc15" size={28} />
    }
  };

  const { color, text, icon } = config[status];

  return (
    <div
      style={{
        position: "relative",

        background: "var(--card)",

        padding: "24px",

        borderRadius: "22px",

        border: "1px solid var(--border)",

        overflow: "hidden",

        backdropFilter: "blur(16px)",

        boxShadow: "0 10px 25px rgba(15,23,42,0.18)",

        transition: "all 0.3s ease",

        minHeight: "200px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
      }}
    >
      {/* GLOW BACKGROUND */}
      <div
        style={{
          position: "absolute",

          top: "-40px",
          right: "-40px",

          width: "180px",
          height: "180px",

          background: `radial-gradient(circle, ${color}22, transparent 70%)`,

          filter: "blur(45px)"
        }}
      />

      {/* ICON */}
      <div
        style={{
          width: "58px",
          height: "58px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          borderRadius: "18px",

          background: `${color}15`,

          border: `1px solid ${color}33`,

          boxShadow: "0 10px 25px rgba(15,23,42,0.18)",

          marginBottom: "18px",

          position: "relative",
          zIndex: 1
        }}
      >
        {icon}
      </div>

      {/* LABEL */}
      <p
        style={{
          margin: 0,

          fontSize: "13px",

          color: "var(--muted)",

          letterSpacing: "0.5px",

          position: "relative",
          zIndex: 1
        }}
      >
        System Status
      </p>

      {/* STATUS */}
      <h2
        style={{
          marginTop: "10px",
          marginBottom: "10px",

          fontSize: "36px",

          fontWeight: "bold",

          color,

          textShadow: `0 0 12px ${color}55`,

          position: "relative",
          zIndex: 1
        }}
      >
        {status}
      </h2>

      {/* DESCRIPTION */}
      <p
        style={{
          color: "var(--muted)",

          lineHeight: "1.6",

          maxWidth: "220px",

          position: "relative",
          zIndex: 1
        }}
      >
        {text}
      </p>

      {/* DECORATIVE LINES */}
      <div
        style={{
          position: "absolute",

          bottom: "20px",
          right: "20px",

          width: "90px",
          height: "90px",

          borderRadius: "50%",

          border: `1px solid ${color}22`
        }}
      />

      <div
        style={{
          position: "absolute",

          bottom: "35px",
          right: "35px",

          width: "60px",
          height: "60px",

          borderRadius: "50%",

          border: `1px solid ${color}22`
        }}
      />
    </div>
  );
}