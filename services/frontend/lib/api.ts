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
  const res = await fetch(`${API_URL}/deploy`, { credentials: "include" });
  if (!res.ok) throw new Error("Error al obtener deployments");
  return res.json();
}

export async function createDeployment(dto: CreateDeployDto): Promise<Deploy> {
  const res = await fetch(`${API_URL}/deploy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error("Error al crear deployment");
  return res.json();
}

export async function deleteDeployment(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/deploy/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar deployment");
}

export async function getDeploymentLogs(id: string): Promise<string[]> {
  const res = await fetch(`${API_URL}/deploy/${id}/logs`, { credentials: "include" });
  if (!res.ok) throw new Error("Error al obtener los logs");
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

export interface ActiveAlert {
  id: string;
  severity: string;
  message: string;
  startsAt: string;
}

export async function getActiveAlerts(): Promise<ActiveAlert[]> {
  const res = await fetch(`${API_URL}/monitoring/alerts`);
  if (!res.ok) throw new Error("Error fetching active alerts");
  return res.json();
}

export interface Project {
  id: string;
  name: string;
  provider: "github" | "gitlab";
  repoUrl: string;
  defaultBranch: string;
  description?: string;
  createdAt: string;
}

export interface CreateProjectInput {
  name: string;
  repoUrl: string;
  defaultBranch?: string;
  description?: string;
}

export async function getProjects(): Promise<Project[]> {
  const res = await fetch(`${API_URL}/projects`, { credentials: "include" });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function createProject(input: CreateProjectInput): Promise<Project> {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body: { message?: string } | null = await res.json().catch(() => null);
    throw new Error(body?.message || "Error al crear el proyecto");
  }
  return res.json();
}

export async function deleteProject(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Error al eliminar el proyecto");
}

export interface RepoBranch {
  name: string;
  commitSha: string;
}

export interface RepoCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

export async function getProjectBranches(projectId: string): Promise<RepoBranch[]> {
  const res = await fetch(`${API_URL}/projects/${projectId}/branches`, { credentials: "include" });
  if (!res.ok) {
    const body: { message?: string } | null = await res.json().catch(() => null);
    throw new Error(body?.message || "Error al obtener las ramas del repositorio");
  }
  return res.json();
}

export async function getProjectCommits(projectId: string, branch: string): Promise<RepoCommit[]> {
  const res = await fetch(`${API_URL}/projects/${projectId}/commits?branch=${encodeURIComponent(branch)}`, { credentials: "include" });
  if (!res.ok) {
    const body: { message?: string } | null = await res.json().catch(() => null);
    throw new Error(body?.message || "Error al obtener los commits del repositorio");
  }
  return res.json();
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export async function registerUser(input: RegisterUserInput): Promise<void> {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const body: { message?: string } | null = await res.json().catch(() => null);
    throw new Error(body?.message || "Error al crear el usuario");
  }
}

export interface LogEntry {
  ts: string;
  level: "INFO" | "WARN" | "ERROR";
  app: string;
  msg: string;
}

export async function getLogs(): Promise<LogEntry[]> {
  const res = await fetch(`${API_URL}/deploy/logs`, { credentials: "include" });
  if (!res.ok) throw new Error("Error fetching logs");
  return res.json();
}
