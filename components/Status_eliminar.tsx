"use client";

import { url } from "inspector";

export default function Status({ status }: { status: string }) {
  const colors: any = {
    GOOD: "#22c55e",
    WARNING: "#facc15",
    BAD: "#ef4444"
  };

  return (
    <div
      style={{
        
        width:"25%",
        padding: "10px 20px",
        paddingTop:"100px",
        borderRadius: "10px",
        background: "var(--sidebar)",
        border: `1px solid ${colors[status]}`,
        color: colors[status],
         boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
         textAlign:"center",
         fontSize:"50px",
         transition: "0.3s",
transform: "scale(1)",
        textShadow: `0 0 10px ${colors[status]}`
        
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "0 0 30px rgba(56, 189, 248, 0.8)";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 0 20px rgba(56, 189, 248, 0.3)";
        e.currentTarget.style.transform = "scale(1)";
      }}
      
    >
        
       {status}
    </div>
  );
}