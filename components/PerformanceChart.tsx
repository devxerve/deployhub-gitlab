"use client";

import {
  Line,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  ReferenceLine,
  ComposedChart,
  Label
} from "recharts";

const data = [
  { time: "00:00", before: 20, after: 30 },
  { time: "04:00", before: 25, after: 40 },
  { time: "08:00", before: 30, after: 50 },
  { time: "12:00", before: 35, after: 75 }, // 🔥 MOMENTO DEPLOY
  { time: "16:00", before: 40, after: 70 },
  { time: "20:00", before: 45, after: 80 },
  { time: "24:00", before: 50, after: 90 }
];

export default function PerformanceChart() {
  return (
        <div
  style={{
    width: "100%",

    height: "380px",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.02),
        rgba(255,255,255,0.01)
      )
    `,

    borderRadius: "24px",

    padding: "24px",

    border: "1px solid var(--border)",

    backdropFilter: "blur(16px)",

    boxShadow: `
      0 10px 40px rgba(15,23,42,0.08)
    `
  }}
>
        <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
          <defs>
            {/* GRADIENTE AZUL NEÓN (Cian Eléctrico) */}
            <linearGradient id="neonBlue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            {/* GRADIENTE ROSA NEÓN (Fucsia Eléctrico) */}
            <linearGradient id="neonPink" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff007f" stopOpacity={0.5}/>
              <stop offset="95%" stopColor="#ff007f" stopOpacity={0}/>
            </linearGradient>
          </defs>

          <CartesianGrid
            stroke="rgba(148,163,184,0.08)"
            vertical={false}
            strokeDasharray="3 3"
          />          
          <XAxis dataKey="time" stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} dy={10} />
          <YAxis stroke="#64748b" tickLine={false} axisLine={false} fontSize={12} />
          
          <Tooltip
  cursor={{
    stroke: "#475569",
    strokeWidth: 1.5,
    strokeDasharray: "4 4"
  }}

  contentStyle={{
    background: "rgba(15,23,42,0.92)",

    backdropFilter: "blur(18px)",

    border: "1px solid rgba(255,255,255,0.08)",

    borderRadius: "16px",

    boxShadow: `
      0 10px 40px rgba(0,0,0,0.4)
    `,

    color: "white",

    fontSize: "13px"
  }}

  labelStyle={{
    color: "#94a3b8",
    marginBottom: "8px"
  }}

  itemStyle={{
    fontWeight: 700
  }}
/>
          
          {/* FRANJAS NEÓN (Áreas) */}
          <Area
            type="monotone"
            dataKey="before"
            stroke="none"
            fill="url(#neonBlue)"
            tooltipType="none" // Evita duplicar en el tooltip
            activeDot={false}
          />
          <Area
            type="monotone"
            dataKey="after"
            stroke="none"
            fill="url(#neonPink)"
            tooltipType="none" // Evita duplicar en el tooltip
            activeDot={false}
          />

          {/* LÍNEAS DE CONTORNO NEÓN */}
          <Line 
            name="Before" 
            type="monotone" 
            dataKey="before" 
            stroke="#3b82f6" 
            strokeWidth={4} 
            dot={false}
            activeDot={{ r: 6, fill: "#3b82f6", stroke: "#020617", strokeWidth: 2 }}
            style={{
  filter: "drop-shadow(0 0 8px currentColor)"
}}
          />
          <Line 
            name="After" 
            type="monotone" 
            dataKey="after" 
            stroke="#ff007f" 
            strokeWidth={4} 
            dot={false}
            activeDot={{ r: 6, fill: "#ff007f", stroke: "#020617", strokeWidth: 2 }}
            style={{
              filter: "drop-shadow(0 0 8px currentColor)"
            }}
          />

          {/* MARCADOR DE DEPLOY */}
          <ReferenceLine
            x="12:00"
            stroke="#a855f7"
            strokeWidth={2}
            strokeDasharray="6 6"
          >
            <Label 
              value="🚀 DEPLOYMENT" 
              position="top" 
              fill="#a855f7" 
              fontSize={11} 
              fontWeight="800"
              offset={15}
              style={{ textShadow: "0px 0px 8px rgba(168, 85, 247, 0.8)" }}
            />
          </ReferenceLine>
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}