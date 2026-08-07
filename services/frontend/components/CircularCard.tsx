"use client";

interface CircularCardProps {
  title: string;
  value: number;
  color: string;
}

export default function CircularCard({
  title,
  value,
  color,
}: CircularCardProps) {
  const radius = 40;
  const stroke = 8;
  const normalizedRadius = radius - stroke;
  const circumference = normalizedRadius * 2 * Math.PI;

  const strokeDashoffset =
    circumference - (value / 100) * circumference;

  return (
    <div
      style={{
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        width: "220px",
        boxShadow: `0 0 20px ${color}33`
      }}
    >
        
      <h4 style={{ color: "#94a3b8" }}>{title}</h4>

      <div style={{ position: "relative", marginTop: "10px" }}>
        <svg height={100} width={100}>
          <circle
            stroke="#1e293b"
            fill="transparent"
            strokeWidth={stroke}
            r={normalizedRadius}
            cx="50"
            cy="50"
          />

          <circle
            stroke={color}
            fill="transparent"
            strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{
              strokeDashoffset,
              transition: "0.5s",
              filter: `drop-shadow(0 0 6px ${color})`
            }}
            r={normalizedRadius}
            cx="50"
            cy="50"
          />
        </svg>

        <div
          style={{
            position: "absolute",
            top: "30px",
            left: "35px",
            fontSize: "20px",
            color
          }}
        >
          {value}%
        </div>
      </div>
    </div>
  );
}