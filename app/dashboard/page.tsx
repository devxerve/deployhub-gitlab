import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import KPISection from "@/components/KPISection";
import PerformanceSection from "@/components/PerformanceSection";
import RecentActivity from "@/components/RecentActivity";
import DeploymentsSection from "@/components/DeploymentsSection";
import Card from "@/components/Card";
import Status from "@/components/Status";
import Chart from "@/components/Chart";
import Terminal from "@/components/Terminal";
import DeploymentsTable from "@/components/DeploymentsTable";
import Logs from "@/components/Logs";

export default function Home() {
  return (
    <div
	    style={{
	    	display: "flex",
	    	background: "var(--bg)",
	    	minHeight: "100vh"
	    }}
    >
      <Sidebar />

      <div style={{ flex: 1, padding: "20px" }}>
        <TopBar />
        <KPISection />

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <PerformanceSection />
          
          <Logs/>
        </div>

        <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
          <DeploymentsTable />
          <Terminal />
        </div>
      </div>
    </div>
  );
}