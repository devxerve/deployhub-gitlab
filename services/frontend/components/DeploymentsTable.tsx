"use client";

const data = [
  {
    app: "deployhub-web",
    branch: "main",
    commit: "a1b2c3d",
    version: "v2.1.0",
    status: "SUCCESS",
    performance: 92,
    time: "2 min ago"
  },
  {
    app: "deployhub-api",
    branch: "develop",
    commit: "f4g5h6i",
    version: "v2.0.9",
    status: "FAILED",
    performance: 38,
    time: "1 hour ago"
  },
  {
    app: "deployhub-worker",
    branch: "feature/auth",
    commit: "x7y8z9k",
    version: "v2.0.8",
    status: "BUILDING",
    performance: 65,
    time: "5 min ago"
  }
];

function getStatusStyle(status: string) {
  switch (status) {
    case "SUCCESS":
      return "#22c55e";
    case "FAILED":
      return "#ef4444";
    case "WARNING":
      return "#facc15";
    case "BUILDING":
      return "#3b82f6";
    default:
      return "#64748b";
  }
}

export default function DeploymentsTable() {
  return (
    <div
      style={{
        flex: 1,
        background: "var(--card)",
        borderRadius: "24px",
        padding: "24px",
        border: "1px solid var(--border)",
        backdropFilter: "blur(18px)",
        boxShadow: "var(--shadow)",
        animation: "fadeIn 0.5s ease"
      }}
    >
      {/* TOP */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px"
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: "700",
              color: "var(--text)"
            }}
          >
            Recent Deployments
          </h2>

          <p
            style={{
              marginTop: "6px",
              color: "var(--muted)",
              fontSize: "14px"
            }}
          >
            Monitor latest deployment activity
          </p>
        </div>

        <button
          style={{
            background: "var(--hover)",
            border: "1px solid var(--border)",
            color: "var(--text)",
            padding: "10px 14px",
            borderRadius: "12px",
            cursor: "pointer",
            transition: "0.3s"
          }}
        >
          View All
        </button>
      </div>

      {/* HEADER */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr 2fr 1fr",
          padding: "0 12px",
          marginBottom: "14px",
          color: "var(--muted)",
          fontSize: "13px",
          fontWeight: 600,
          letterSpacing: "0.3px"
        }}
      >
        <span>Version</span>
        <span>Status</span>
        <span style={{ textAlign: "center" }}>Performance</span>
        <span style={{ textAlign: "right" }}>Date</span>
      </div>

      {/* ROWS */}
      {data.map((d, i) => {
  const color = getStatusStyle(d.status);

  return (
    <div
      key={i}
      style={{
        display: "grid",
        gridTemplateColumns: "1.5fr 1fr 2fr 1fr",
        alignItems: "center",

        padding: "16px",
        marginBottom: "12px",

        borderRadius: "16px",

        background: "rgba(255,255,255,0.03)",
        border: "1px solid var(--border)",

        transition: "all 0.25s ease",
        cursor: "pointer"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.border = `1px solid ${color}55`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.border = "1px solid var(--border)";
      }}
    >
      {/* APP + VERSION */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <span style={{ color: "var(--text)", fontWeight: 600 }}>
          {d.app}
        </span>

        <span style={{ fontSize: "12px", color: "var(--muted)" }}>
          {d.branch} • {d.commit}
        </span>
      </div>

      {/* STATUS */}
      <div>
        <span
          style={{
            padding: "6px 12px",
            borderRadius: "999px",
            background: `${color}22`,
            color,
            fontSize: "11px",
            fontWeight: 700,
            border: `1px solid ${color}33`
          }}
        >
          {d.status}
        </span>
      </div>

      {/* PERFORMANCE */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <div
          style={{
            flex: 1,
            height: "6px",
            background: `linear-gradient(90deg, ${color}, ${color}88)`,
            borderRadius: "999px",
            boxShadow: `0 0 4px ${color}`,
            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${d.performance}%`,
              height: "100%",
              background: color,
              transition: "width 0.4s ease"
            }}
          />
        </div>

        <span
          style={{
            fontSize: "12px",
            fontWeight: 600,
            color
          }}
        >
          {d.performance}%
        </span>
      </div>

      {/* TIME */}
      <span
  style={{
    textAlign: "right",
    color: "var(--muted)",
    fontSize: "13px",
    fontWeight: 500
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