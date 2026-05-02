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
        <span>Performance</span>
        <span>Date</span>
      </div>

      {/* ROWS */}
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

              padding: "18px",
              marginBottom: "14px",

              borderRadius: "18px",

              background: "rgba(255,255,255,0.03)",

              border: "1px solid var(--border)",

              transition: "all 0.3s ease",

              cursor: "pointer"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 10px 30px rgba(0,0,0,0.12)";
              e.currentTarget.style.border =
                `1px solid ${color}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0px)";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.border =
                "1px solid var(--border)";
            }}
          >
            {/* VERSION */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px"
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  background: color,
                  boxShadow: `0 0 12px ${color}`
                }}
              />

              <span
                style={{
                  color: "var(--text)",
                  fontWeight: 600
                }}
              >
                {d.version}
              </span>
            </div>

            {/* STATUS */}
            <div>
              <span
                style={{
                  padding: "7px 14px",
                  borderRadius: "999px",

                  background: `${color}22`,
                  color,

                  fontSize: "12px",
                  fontWeight: "700",

                  border: `1px solid ${color}33`,

                  boxShadow: `0 0 12px ${color}22`
                }}
              >
                {d.status}
              </span>
            </div>

            {/* PERFORMANCE */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px"
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: "8px",
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: "999px",
                  overflow: "hidden",
                  position: "relative"
                }}
              >
                <div
                  style={{
                    width: `${d.performance}%`,
                    height: "100%",
                    borderRadius: "999px",

                    background: `
                      linear-gradient(
                        90deg,
                        ${color},
                        ${color}aa
                      )
                    `,

                    boxShadow: `0 0 12px ${color}`
                  }}
                />
              </div>

              <span
                style={{
                  minWidth: "45px",
                  color,
                  fontWeight: 700,
                  fontSize: "13px"
                }}
              >
                {d.performance}%
              </span>
            </div>

            {/* TIME */}
            <span
              style={{
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