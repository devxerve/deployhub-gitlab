"use client";



const data = [
  {
    version: "v2.1.0",
    status: "SUCCESS",
    performance: 90,
    time: "2 min ago"
  },
  {
    version: "v2.0.9",
    status: "FAILED",
    performance: 40,
    time: "1 hour ago"
  },
  {
    version: "v2.0.8",
    status: "WARNING",
    performance: 65,
    time: "1 day ago"
  }
];

export default function DeploymentsTable() {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid rgba(56,189,248,0.2)"
      }}
    >
      <h3 style={{ marginBottom: "15px" }}>Recent Deployments</h3>

      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 2fr 1fr",
          color: "#94a3b8",
          fontSize: "14px",
          marginBottom: "10px"
        }}
      >
        <span>Version</span>
        <span>Status</span>
        <span>Performance</span>
        <span>Date</span>
      </div>

      {data.map((d, i) => {
        const color =
  d.performance > 80
    ? "#22c55e"
    : d.performance > 50
    ? "#facc15"
    : "#ef4444";

        return (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1.2fr 1fr 2fr 1fr",
              alignItems: "center",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "10px",
              background: "var(--sidebar)",
              transition: "0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(56,189,248,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(2,6,23,0.7)";
            }}
          >
            {/* VERSION + DOT */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 8px ${color}`
                }}
              />
              <span>{d.version}</span>
            </div>

            {/* STATUS BADGE */}
            <div>
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "8px",
                  background: `${color}22`,
                  color,
                  fontSize: "12px",
                  boxShadow: `0 0 10px ${color}55`
                }}
              >
                {d.status}
              </span>
            </div>

            {/* PERFORMANCE */}
               <div style={{ width: "100%" }}>
  {/* barra fondo */}
  <div
    style={{
      height: "6px",
      background: "var(--sidebar)",
      borderRadius: "10px",
      overflow: "hidden"
    }}
  >
    {/* barra progreso */}
    <div
      style={{
        width: `${d.performance}%`,
        height: "100%",
        background: color,
        borderRadius: "10px",
        boxShadow: `0 0 10px ${color}`,
        transition: "width 0.5s ease"
      }}
    />
  </div>

  {/* porcentaje */}
  <span
    style={{
      fontSize: "12px",
      color,
      marginTop: "4px",
      display: "inline-block"
    }}
  >
    {d.performance}%
  </span>
</div>

            {/* TIME */}
            <span
              style={{
                color,
                fontSize: "13px"
              }}
            >
              {d.time}
            </span>
          </div>
        );
      })}
    </div>
  );
}