"use client";
export default function ComparisonCard({
  title,
  before,
  after
}: any) {
  const isWorse = after > before;

  const color = isWorse
    ? "#ef4444"
    : after < before
    ? "#22c55e"
    : "#facc15";

  const progress = after;

  return (
    <div
      style={{
        background: "var(--card)",

        borderRadius: "20px",

        padding: "18px",

        border: "1px solid var(--border)",

        backdropFilter: "blur(16px)",

        boxShadow: `
          0 8px 30px rgba(15,23,42,0.08),
          0 0 15px ${color}11
        `,

        transition: "all 0.3s ease",

        position: "relative",

        overflow: "hidden"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform =
          "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform =
          "translateY(0px)";
      }}
    >
      {/* GLOW */}
      <div
        style={{
          position: "absolute",

          top: "-40px",
          right: "-40px",

          width: "100px",
          height: "100px",

          background: `${color}22`,

          borderRadius: "50%",

          filter: "blur(40px)"
        }}
      />

      {/* TITLE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <span
          style={{
            color: "var(--muted)",
            fontSize: "14px",
            fontWeight: 600
          }}
        >
          {title}
        </span>

        <span
          style={{
            color,
            fontSize: "13px",
            fontWeight: 700
          }}
        >
          {isWorse ? "+" : "-"}
          {Math.abs(after - before)}%
        </span>
      </div>

      {/* VALUES */}
      <div
        style={{
          marginTop: "18px",

          display: "flex",

          alignItems: "center",

          gap: "10px"
        }}
      >
        <span
          style={{
            color: "#3b82f6",
            fontSize: "26px",
            fontWeight: "700"
          }}
        >
          {before}%
        </span>

        <span
          style={{
            color: "var(--muted)",
            fontSize: "18px"
          }}
        >
          →
        </span>

        <span
          style={{
            color,
            fontSize: "26px",
            fontWeight: "700",

            textShadow: `0 0 12px ${color}55`
          }}
        >
          {after}%
        </span>
      </div>

      {/* PROGRESS */}
      <div
        style={{
          marginTop: "18px"
        }}
      >
        <div
          style={{
            height: "8px",

            borderRadius: "999px",

            background: "rgba(255,255,255,0.05)",

            overflow: "hidden"
          }}
        >
          <div
            style={{
              width: `${progress}%`,

              height: "100%",

              borderRadius: "999px",

              background: `
                linear-gradient(
                  90deg,
                  ${color},
                  ${color}99
                )
              `,

              boxShadow: `0 0 12px ${color}`
            }}
          />
        </div>
      </div>
    </div>
  );
}