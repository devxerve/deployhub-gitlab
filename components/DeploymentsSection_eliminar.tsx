export default function DeploymentsSection() {
  return (
    <div
      style={{
        flex: 2,
        background: "var(--sidebar)",
        padding: "20px",
        borderRadius: "16px"
      }}
    >
      <h3>Recent Deployments</h3>

      <p>v2.1.0 SUCCESS</p>
      <p>v2.0.9 FAILED</p>
      <p>v2.0.8 SUCCESS</p>
    </div>
  );
}