export const PROJECTS_STORAGE_KEY = "deployhub.projects.v1";
export const PROJECTS_UPDATED_EVENT = "deployhub:projects-updated";

export interface DeployProject {
  id: string;
  name: string;
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

export function normalizeGitHubUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    if (url.hostname.toLowerCase() !== "github.com") return trimmed;
    const path = url.pathname.replace(/^\/+|\/+$/g, "").replace(/\.git$/i, "");
    return `https://github.com/${path}`;
  } catch {
    return trimmed;
  }
}

export function isValidGitHubRepoUrl(value: string): boolean {
  try {
    const url = new URL(normalizeGitHubUrl(value));
    const segments = url.pathname.split("/").filter(Boolean);
    return url.protocol === "https:" && url.hostname === "github.com" && segments.length === 2;
  } catch {
    return false;
  }
}

export function slugifyProjectName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function getStoredProjects(): DeployProject[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DeployProject[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveProjects(projects: DeployProject[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  window.dispatchEvent(new CustomEvent(PROJECTS_UPDATED_EVENT));
}

export function addStoredProject(input: CreateProjectInput): DeployProject {
  const projects = getStoredProjects();
  const repoUrl = normalizeGitHubUrl(input.repoUrl);
  const id = slugifyProjectName(input.name);

  if (!id) throw new Error("El nombre del proyecto no es válido.");
  if (!isValidGitHubRepoUrl(repoUrl)) {
    throw new Error("Introduce una URL válida de un repositorio de GitHub.");
  }
  if (projects.some((project) => project.id === id)) {
    throw new Error("Ya existe un proyecto con ese nombre.");
  }
  if (projects.some((project) => normalizeGitHubUrl(project.repoUrl) === repoUrl)) {
    throw new Error("Ese repositorio ya está registrado.");
  }

  const project: DeployProject = {
    id,
    name: input.name.trim(),
    repoUrl,
    defaultBranch: input.defaultBranch?.trim() || "main",
    description: input.description?.trim() || undefined,
    createdAt: new Date().toISOString(),
  };

  saveProjects([project, ...projects]);
  return project;
}

export function removeStoredProject(id: string): void {
  saveProjects(getStoredProjects().filter((project) => project.id !== id));
}

export function mergeProjects(projects: DeployProject[]): DeployProject[] {
  const current = getStoredProjects();
  const merged = [...current];

  for (const project of projects) {
    const exists = merged.some(
      (item) => item.id === project.id || normalizeGitHubUrl(item.repoUrl) === normalizeGitHubUrl(project.repoUrl),
    );
    if (!exists) merged.push(project);
  }

  if (merged.length !== current.length) saveProjects(merged);
  return merged;
}