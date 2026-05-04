"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "v1", cpu: 30 },
  { name: "v2", cpu: 45 },
  { name: "v3", cpu: 80 },
  { name: "v4", cpu: 60 },
];

export default function Chart() {
  return (
    <div
      style={{
        width: "100%",
        height: "300px",
        background: "var(--card)",
        borderRadius: "16px",
        padding: "20px",
        boxShadow: "0 0 20px rgba(56,189,248,0.2)"
      }}
    >
      <h3 style={{ marginBottom: "10px" }}>CPU Usage</h3>

      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke="#38bdf8"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}