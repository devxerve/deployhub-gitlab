"use client";

import { ArrowUp, ArrowDown } from "lucide-react";

export default function KPICard({
  title,
  value,
  color,
  trend,
  percent,
  icon
}: any) {
  const radius = 38;
  const stroke = 6;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div
      style={{
        flex: 1,
        minWidth: "220px",
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: `0 0 25px ${color}33`,
        transition: "0.3s",
        transform: "scale(1)",
        animation: "fadeIn 0.6s ease",
        border: `1px solid ${color}33`
      }}
      onMouseEnter={(e) => {
  e.currentTarget.style.transform = "scale(1.05)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.transform = "scale(1)";
}}
    >
      {/* TOP */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            background: `${color}22`,
            padding: "8px",
          
            borderRadius: "10px"
          }}
          
        >
          {icon}
        </div>
        <span>{title}</span>
      </div>

      {/* MINI GRAPH */}
      <div style={{ marginTop: "10px" }}>
        <svg width="100%" height="40">
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points="0,30 20,25 40,28 60,18 80,22 100,10 120,15 140,12"
            style={{
              filter: `drop-shadow(0 0 6px ${color})`
            }}
          />
        </svg>
      </div>

      {/* CIRCLE */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <svg height={90} width={90}>
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="45"
            cy="45"
          />

          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset: offset,
              transition: "0.6s",
              filter: `drop-shadow(0 0 6px ${color})`
            }}
            r={normalizedRadius}
            cx="45"
            cy="45"
          />
        </svg>

        <div style={{ fontSize: "28px", color }}>{value}%</div>
      </div>

      {/* TREND */}
      <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "5px" }}>
        {trend === "up" ? (
          <ArrowUp size={16} color={color} />
        ) : (
          <ArrowDown size={16} color={color} />
        )}

        <span style={{ color }}>
          {percent}% vs last deploy
        </span>
      </div>
    </div>
  );
}