"use client";
export default function Card({ title, value }: { title: string; value: string }) {
  return (
    <div
      style={{
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        width: "400px",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(56, 189, 248, 0.2)",
        boxShadow: "0 0 20px rgba(56, 189, 248, 0.3)",
		    textAlign:"center",
		    fontSize:"25px",
        transition: "0.3s",
        transform: "scale(1)",
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
	  
	  <h4 style={{ color: "#94a3b8"}}>{title}</h4>
      <p style={{ fontSize: "26px", marginTop: "10px", color: "#38bdf8" }}>
        {value}
      </p>
    </div>
  );
}