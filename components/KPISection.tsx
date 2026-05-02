import KPICard from "./KPICard";
import StatusCard from "./StatusCard";

import { Cpu, MemoryStick, Clock } from "lucide-react";

export default function KPISection() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: "24px",
        marginTop: "25px",
      }}
    >
      <KPICard
        title="CPU Usage"
        value={78}
        color="#f43f5e"
        trend="up"
        percent={32}
        icon={<Cpu color="#f43f5e" />}
      />

      <KPICard
        title="Memory Usage"
        value={62}
        color="#22c55e"
        trend="up"
        percent={18}
        icon={<MemoryStick color="#22c55e" />}
      />

      <KPICard
        title="Response Time"
        value={65}
        color="#3b82f6"
        trend="down"
        percent={12}
        icon={<Clock color="#3b82f6" />}
      />

      <StatusCard status="WARNING" />
    </div>
  );
}