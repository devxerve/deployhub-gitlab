import { API_URL } from "@/lib/config";

export interface Deploy {
  id: string;
  repoUrl: string;
  projectId: string;
  status: string;
  commitHash?: string;
  branch?: string;
  envVariables?: string;
  port?: number;
  createdAt: string;
}

export interface CreateDeployDto {
  repoUrl: string;
  projectId: string;
  commitHash?: string;
  branch?: string;
  envVariables?: Record<string, string>;
}

export async function getDeployments(): Promise<Deploy[]> {
  const res = await fetch(`${API_URL}/deploy`);
  if (!res.ok) throw new Error("Error al obtener deployments");
  return res.json();
}

export async function createDeployment(dto: CreateDeployDto): Promise<Deploy> {
  const res = await fetch(`${API_URL}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Error al crear deployment");
  return res.json();
}

export async function getDeployment(id: string): Promise<Deploy> {
  const res = await fetch(`${API_URL}/deploy/${id}`);
  if (!res.ok) throw new Error("Error al obtener deployment");
  return res.json();
}

export async function deleteDeployment(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/deploy/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar deployment");
}

export async function getDeploymentStatus(id: string): Promise<{ id: string; status: string }> {
  const res = await fetch(`${API_URL}/deploy/${id}/status`);
  if (!res.ok) throw new Error("Error al obtener estado");
  return res.json();
}

export interface OverviewMetrics {
  cpuPct: number | null;
  memPct: number | null;
  memUsedBytes: number | null;
  memLimitBytes: number | null;
  netIoBytesPerSec: number | null;
  requestsPerMin: number | null;
  latencyP95Ms: number | null;
  uptimeSeconds: number;
}

export interface HistoryPoint {
  hour: string;
  cpu: number;
  mem: number;
}

export async function getMonitoringOverview(): Promise<OverviewMetrics> {
  const res = await fetch(`${API_URL}/monitoring/overview`);
  if (!res.ok) throw new Error("Error fetching monitoring overview");
  return res.json();
}

export async function getMonitoringHistory(hours: number = 24): Promise<HistoryPoint[]> {
  const res = await fetch(`${API_URL}/monitoring/history?hours=${hours}`);
  if (!res.ok) throw new Error("Error fetching monitoring history");
  return res.json();
}

export interface LogEntry {
  ts: string;
  level: "INFO" | "WARN" | "ERROR";
  app: string;
  msg: string;
}

export async function getLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${API_URL}/deploy/logs`);
  if (!res.ok) throw new Error("Error fetching logs");
  return res.json();
}
