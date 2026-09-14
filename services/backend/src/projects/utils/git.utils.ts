export function normalizeGitUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";

  try {
    const url = new URL(trimmed);
    const path = url.pathname
      .replace(/^\/+|\/+$/g, "")
      .replace(/\.git$/i, "");
    return `${url.origin}/${path}`;
  } catch {
    return trimmed;
  }
}

export function isValidGitRepoUrl(value: string): boolean {
  try {
    const url = new URL(normalizeGitUrl(value));
    const segments = url.pathname.split("/").filter(Boolean);
    return url.protocol === "https:" && segments.length >= 2;
  } catch {
    return false;
  }
}

export function parseGitRepo(
  value: string,
): { owner: string; repo: string } | null {
  try {
    const url = new URL(normalizeGitUrl(value));
    const segments = url.pathname.split("/").filter(Boolean);

    if (segments.length < 2) return null;

    const repo = segments.at(-1)!;
    const owner = segments.slice(0, -1).join("/");

    return { owner, repo };
  } catch {
    return null;
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
