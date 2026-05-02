"use client";
import { ShieldCheck, AlertTriangle, ShieldX } from "lucide-react";

export default function StatusCard({ status }: { status: string }) {
  const config: any = {
    GOOD: {
      color: "#22c55e",
      text: "All systems operational",
      imagen:"status.jpg",
      icon: <ShieldCheck color="#22c55e" size={28} />
    },
    BAD: {
      color: "#ef4444",
      text: "System failure detected",
      imagen:"status2.jpg",
      icon: <ShieldX color="#ef4444" size={28} />
      
    },
    WARNING: {
      color: "#facc15",
      text: "Performance issues detected",
      imagen:"status3.jpg",
      icon: <AlertTriangle color="#facc15" size={28} />
    }
  };

  const { color, text, icon,imagen } = config[status];

  return (
    <div
      style={{
        position: "relative",
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${color}33`,
        boxShadow: `0 0 30px ${color}33`,
        transition: "0.3s",
        transform: "scale(1)",
        animation: "fadeIn 0.6s ease",
        minHeight: "180px"
      }}
      onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      }}
      
    >
      
      {/* ICON TOP */}
      <div
        style={{
          background: `${color}22`,
          padding: "10px",
          borderRadius: "12px",
          width: "fit-content",
          marginBottom: "10px"
        }}
        
      >
        
        {icon}
      </div>

      {/* TEXT */}
      <h4>Status</h4>

      <h2
        style={{
          color,
          fontSize: "28px",
          textShadow: `0 0 12px ${color}`
        }}
      >
        {status}
      </h2>

      <p style={{ color }}>{text}</p>

      {/* GLOW IMAGE (decoración estilo imagen) */}
      <div
        style={{
          position: "absolute",
          right: "-20px",
          bottom: "-20px",
          width: "140px",
          height: "140px",
          background: `radial-gradient(circle, ${color}55, transparent 70%)`,
          filter: "blur(20px)"
        }}
        
      />

      {/* FIGURA TECNOLÓGICA (simulación imagen) */}
      <img src={imagen} 
  style={{ position: "absolute", right: 0, bottom: 0, width: "120px" }} 
/>
    </div>
  );
}