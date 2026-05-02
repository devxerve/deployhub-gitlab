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
        color="var(--danger)"
        trend="up"
        percent={32}
        icon={<Cpu color="var(--danger)" />}
      />

      <KPICard
        title="Memory Usage"
        value={62}
        color="var(--success)"
        trend="up"
        percent={18}
        icon={<MemoryStick color="var(--success)" />}
      />

      <KPICard
        title="Response Time"
        value={65}
        color="var(--info)"
        trend="down"
        percent={12}
        icon={<Clock color="var(--info)" />}
      />

      <StatusCard status="WARNING" />
    </div>
  );
}