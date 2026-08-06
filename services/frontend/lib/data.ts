

export const PROJECTS = [
  { id: 1, name: "deployhub-web",    desc: "Main frontend portal",        framework: "Next.js", repo: "github.com/org/deployhub-web",    branch: "main",         status: "live",     envs: 3, score: "A+", lastDeploy: "2 min ago" },
  { id: 2, name: "deployhub-api",    desc: "REST API backend",            framework: "FastAPI", repo: "github.com/org/deployhub-api",    branch: "develop",      status: "failing",  envs: 5, score: "B",  lastDeploy: "1 hr ago"  },
  { id: 3, name: "deployhub-worker", desc: "Background jobs",             framework: "Node.js", repo: "github.com/org/deployhub-worker", branch: "feature/auth", status: "building", envs: 2, score: "A",  lastDeploy: "5 min ago" },
  { id: 4, name: "analytics-svc",   desc: "Event tracking service",      framework: "Go",      repo: "github.com/org/analytics-svc",   branch: "main",         status: "live",     envs: 4, score: "A+", lastDeploy: "1 day ago" },
  { id: 5, name: "ml-pipeline",     desc: "Model training pipeline",     framework: "Python",  repo: "github.com/org/ml-pipeline",     branch: "v2",           status: "idle",     envs: 1, score: "C",  lastDeploy: "3 days ago"},
];

export const DEPLOYMENTS = [
  { id: "dpl_001", app: "deployhub-web",    branch: "main",         commit: "a1b2c3d", version: "v2.1.0", status: "SUCCESS",  duration: "1m 42s", user: "giselle@deployhub.com", time: "2 min ago",   progress: 100 },
  { id: "dpl_002", app: "deployhub-api",    branch: "develop",      commit: "f4g5h6i", version: "v2.0.9", status: "FAILED",   duration: "3m 12s", user: "claudia@deployhub.com",    time: "1 hr ago",    progress: 100 },
  { id: "dpl_003", app: "deployhub-worker", branch: "feature/auth", commit: "x7y8z9k", version: "v2.0.8", status: "BUILDING", duration: "0m 38s", user: "giselle@deployhub.com", time: "5 min ago",   progress: 60  },
  { id: "dpl_004", app: "analytics-svc",   branch: "main",         commit: "m3n4o5p", version: "v1.5.2", status: "SUCCESS",  duration: "2m 05s", user: "daniel@deployhub.com",  time: "1 day ago",   progress: 100 },
  { id: "dpl_006", app: "analytics-svc",   branch: "main",         commit: "m3n4o5c", version: "v1.5.3", status: "SUCCESS",  duration: "2m 09s", user: "loreto@deployhub.com",  time: "1 day ago",   progress: 100 },
  { id: "dpl_005", app: "ml-pipeline",     branch: "v2",           commit: "q6r7s8t", version: "v2.0.0", status: "PENDING",  duration: "—",      user: "sam@deployhub.com",     time: "3 days ago",  progress: 0   },
];

export const PIPELINE_STAGES = [
  {
    name: "Build",
    status: "success",
    duration: "42s",
    steps: [
      "Install deps",
      "Compile TypeScript",
      "Bundle assets",
      "Optimize images",
    ],
  },
  {
    name: "Test",
    status: "success",
    duration: "1m 12s",
    steps: [
      "Unit tests (148/148)",
      "Integration tests",
      "Coverage: 89%",
      "Lint checks",
    ],
  },
  {
    name: "Security",
    status: "warning",
    duration: "28s",
    steps: [
      "SAST scan",
      "Dependency audit",
      "2 low severity",
      "Container scan",
    ],
  },
  {
    name: "Deploy",
    status: "running",
    duration: "38s",
    steps: [
      "Push to registry",
      "Update deployment",
      "Health check",
      "DNS propagation",
    ],
  },
];

export const LOGS = [
  { ts: "2026-06-02 14:32:01", level: "INFO",  app: "deployhub-web",    msg: "Build started for commit a1b2c3d on branch main" },
  { ts: "2026-06-02 14:32:05", level: "INFO",  app: "deployhub-web",    msg: "Installing 342 npm packages..." },
  { ts: "2026-06-02 14:32:18", level: "INFO",  app: "deployhub-web",    msg: "TypeScript compilation successful (0 errors)" },
  { ts: "2026-06-02 14:32:45", level: "INFO",  app: "deployhub-web",    msg: "Running 148 unit tests..." },
  { ts: "2026-06-02 14:32:58", level: "INFO",  app: "deployhub-web",    msg: "All tests passed" },
  { ts: "2026-06-02 14:33:02", level: "WARN",  app: "deployhub-api",    msg: "2 low-severity vulnerabilities found in lodash@4.17.20" },
  { ts: "2026-06-02 14:33:15", level: "INFO",  app: "deployhub-worker", msg: "Docker image built: sha256:8f3a..." },
  { ts: "2026-06-02 14:33:22", level: "INFO",  app: "deployhub-web",    msg: "Deployment health check passed (200 OK)" },
  { ts: "2026-06-02 14:33:30", level: "ERROR", app: "deployhub-api",    msg: "Container crash loop: exit code 137 (OOM killed)" },
  { ts: "2026-06-02 14:33:31", level: "ERROR", app: "deployhub-api",    msg: "Rollback triggered — reverting to v2.0.8" },
  { ts: "2026-06-02 14:33:35", level: "INFO",  app: "analytics-svc",   msg: "Auto-scaling: added 2 replicas (total: 4)" },
  { ts: "2026-06-02 14:33:40", level: "INFO",  app: "deployhub-web",    msg: "Deployment v2.1.0 live at https://app.deployhub.io" },
];

export const METRICS_HISTORY = Array.from({ length: 24 }, (_, i) => ({
  hour: `${String(i).padStart(2, "0")}:00`,
  cpu:  20 + Math.round(Math.sin(i / 3) * 15 + (i % 3)),
  mem:  55 + Math.round(Math.cos(i / 4) * 12 + (i % 4)),
  req:  800 + Math.round(Math.sin(i / 2) * 400 + (i % 5) * 40),
  lat:  80 + Math.round(Math.sin(i / 5) * 30 + (i % 4) * 5),
}));

export const NOTIFICATIONS = [
  { id: 1, type: "success", title: "Deploy successful", body: "deployhub-web v2.1.0 is live",          time: "2 min ago", read: false },
  { id: 2, type: "error",   title: "Deploy failed",     body: "deployhub-api OOM in container",        time: "1 hr ago",  read: false },
  { id: 3, type: "warn",    title: "Security alert",    body: "2 vulnerabilities in lodash",           time: "1 hr ago",  read: true  },
  { id: 4, type: "info",    title: "Auto-scaling",      body: "analytics-svc scaled to 4 replicas",   time: "2 hr ago",  read: true  },
];

export const EVALUATION_SCORES: Record<string, {
  overall: string; quality: number; coverage: number;
  security: number; perf: number; maintain: number; recs: string[];
}> = {
  "deployhub-web":   { overall: "A+", quality: 94, coverage: 89, security: 96, perf: 92, maintain: 91, recs: ["Add E2E tests for checkout flow", "Upgrade axios to 1.6+", "Enable strict TypeScript mode"] },
  "deployhub-api":   { overall: "B",  quality: 72, coverage: 61, security: 68, perf: 75, maintain: 70, recs: ["Fix OOM issue: optimize Redis queries", "Increase test coverage to 80%+", "Patch lodash vulnerability (CVE-2024-1234)"] },
  "deployhub-worker":{ overall: "A",  quality: 88, coverage: 82, security: 91, perf: 85, maintain: 87, recs: ["Refactor job queue abstraction", "Add circuit breaker pattern", "Document public API methods"] },
  "analytics-svc":   { overall: "A+", quality: 95, coverage: 91, security: 97, perf: 93, maintain: 94, recs: ["Consider Go 1.22 migration", "Add OpenTelemetry tracing", "Improve error handling in ingestion"] },
  "ml-pipeline":     { overall: "C",  quality: 58, coverage: 32, security: 61, perf: 55, maintain: 50, recs: ["Critical: add unit tests (32% coverage)", "Upgrade Python 3.9 to 3.12", "Add type annotations throughout codebase", "Remove hardcoded credentials from config.py"] },
};

export const BUILD_LOG_LINES = [
  " npm ci --prefer-offline",
  " Installed 342 packages in 8.4s",
  " tsc --noEmit",
  " TypeScript: 0 errors, 0 warnings",
  " next build",
  "   Next.js 14.2.0",
  "   Compiled 47 pages",
  "   Collecting page data",
  "   Generating static pages (47/47)",
  " docker build -t deployhub-web:v2.1.0 .",
  " Step 1/8 : FROM node:20-alpine",
  " Step 8/8 : CMD [\"node\",\"server.js\"]",
  " Image pushed to registry",
  " kubectl rollout status deploy/deployhub-web",
  "  Waiting for rollout... (0/3 ready)",
  "  Waiting for rollout... (1/3 ready)",
  "  Waiting for rollout... (2/3 ready)",
  " Deployment complete (3/3 ready)",
  " Health check: 200 OK · 23ms",
  " v2.1.0 is live at https://app.deployhub.io",
];