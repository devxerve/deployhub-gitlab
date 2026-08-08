export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://localhost:8443/api/backend";

export const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "https://auth.localhost:8443";

// Traefik's websecure entrypoint port — every deployed app gets its own
// `Host(<deployId>.localhost)` router on that same entrypoint (see
// DockerUtil.runContainer), so its URL needs the same port as everything
// else. Derived from API_URL instead of hardcoded so it stays in sync if
// the port is ever changed again.
export function deploySiteUrl(deployId: string): string {
  if (typeof window !== "undefined" && window.location.port) {
    return `https://${deployId}.localhost:${window.location.port}`;
  }
  return `https://${deployId}.localhost:8443`;
}