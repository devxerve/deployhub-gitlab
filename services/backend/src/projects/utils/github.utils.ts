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
