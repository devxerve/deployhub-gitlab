export default function ComparisonCard({
  title,
  before,
  after
}: any) {
  const isWorse = after > before;

  const color = isWorse
    ? "#ef4444" // rojo
    : after < before
    ? "#22c55e" // verde
    : "#facc15"; // amarillo

  return (
    <div
      style={{
        flex: 1,
        background: "var(--card)",
        padding: "15px",
        borderRadius: "12px",
        border: `1px solid ${color}33`,
        boxShadow: `0 0 15px ${color}33`
      }}
    >
      <h4 style={{ color: "#94a3b8" }}>{title}</h4>

      <div style={{ fontSize: "18px", marginTop: "5px" }}>
        <span style={{ color: "#3b82f6"}}>{before}%</span>

        <span style={{ margin: "0 10px", color }}>
          →
        </span>

        <span style={{ color }}>{after}%</span>
      </div>
    </div>
  );
}