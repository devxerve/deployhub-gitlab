import DeploymentsTable from "@/components/DeploymentsTable";
export default function DeploymentsPage() {
  return (
    <div style={{
      padding: "30px",
      display: "flex",
      flexDirection: "column",
      gap: "20px"
    }}>
      <h1 style={{ color: "var(--text)" }}>Deployments</h1>

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        boxShadow: "var(--shadow)",
        padding: "20px"
      }}>
        {<div style={{ marginTop: "24px" }}>
  <DeploymentsTable />
</div>}
      </div>
    </div>
  );
}