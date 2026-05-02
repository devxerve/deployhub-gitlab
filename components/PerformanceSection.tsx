import PerformanceChart from "./PerformanceChart";
import ComparisonCard from "./ComparisonCard";

export default function PerformanceSection() {
  return (
    <div
      style={{
        flex: 2,
        background: "var(--card)",
        padding: "20px",
        borderRadius: "16px",
        border: "1px solid rgba(56,189,248,0.2)"
      }}
      
    >
        <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "10px"
}}>
  <h3>Performance Overview</h3>

  <select
    style={{
      background: "var(--sidebar)",
      color: "white",
      border: "1px solid #334155",
      padding: "5px 10px",
      borderRadius: "8px"
    }}
  >
    <option>Last Deploy</option>
    <option>Last 24h</option>
    <option>Last 7 days</option>
  </select>
</div>

      {/* legend */}
      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <span style={{ color: "#3b82f6" }}>● Before Deploy</span>
        <span style={{ color: "#f43f5e" }}>● After Deploy</span>
      </div>

      <PerformanceChart />
      <div
  style={{
    display: "flex",
    gap: "15px",
    marginTop: "20px"
  }}
  
>
    
  <ComparisonCard title="CPU" before={30} after={78} />
  <ComparisonCard title="Memory" before={80} after={62} />
  <ComparisonCard title="Disk" before={33} after={33} />
  <ComparisonCard title="Network" before={15} after={32} />
</div>
    </div>
    
  );
}