// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
// Single source of truth for all modules

export const PROJECTS = [
  { id: 1, name: "deployhub-web",    desc: "Main frontend portal",        framework: "Next.js", repo: "github.com/org/deployhub-web",    branch: "main",         status: "live",     envs: 3, score: "A+", lastDeploy: "2 min ago" },
  { id: 2, name: "deployhub-api",    desc: "REST API backend",            framework: "FastAPI", repo: "github.com/org/deployhub-api",    branch: "develop",      status: "failing",  envs: 5, score: "B",  lastDeploy: "1 hr ago"  },
  { id: 3, name: "deployhub-worker", desc: "Background jobs",             framework: "Node.js", repo: "github.com/org/deployhub-worker", branch: "feature/auth", status: "building", envs: 2, score: "A",  lastDeploy: "5 min ago" },
  { id: 4, name: "analytics-svc",   desc: "Event tracking service",      framework: "Go",      repo: "github.com/org/analytics-svc",   branch: "main",         status: "live",     envs: 4, score: "A+", lastDeploy: "1 day ago" },
  { id: 5, name: "ml-pipeline",     desc: "Model training pipeline",     framework: "Python",  repo: "github.com/org/ml-pipeline",     branch: "v2",           status: "idle",     envs: 1, score: "C",  lastDeploy: "3 days ago"},
];

export const PIPELINE_STAGES = [
  { id: "build", status: "success", duration: "42s" },
  { id: "test", status: "success", duration: "1m 12s" },
  { id: "security", status: "warning", duration: "28s" },
  { id: "deploy", status: "running", duration: "38s" },
];

export const EVALUATION_SCORES: Record<string, {
  overall: string; quality: number; coverage: number;
  security: number; perf: number; maintain: number; recKeys: string[];
}> = {
  "deployhub-web":   { overall: "A+", quality: 94, coverage: 89, security: 96, perf: 92, maintain: 91, recKeys: ["evaluation.recs.deployhubWeb.1", "evaluation.recs.deployhubWeb.2", "evaluation.recs.deployhubWeb.3"] },
  "deployhub-api":   { overall: "B",  quality: 72, coverage: 61, security: 68, perf: 75, maintain: 70, recKeys: ["evaluation.recs.deployhubApi.1", "evaluation.recs.deployhubApi.2", "evaluation.recs.deployhubApi.3"] },
  "deployhub-worker":{ overall: "A",  quality: 88, coverage: 82, security: 91, perf: 85, maintain: 87, recKeys: ["evaluation.recs.deployhubWorker.1", "evaluation.recs.deployhubWorker.2", "evaluation.recs.deployhubWorker.3"] },
  "analytics-svc":   { overall: "A+", quality: 95, coverage: 91, security: 97, perf: 93, maintain: 94, recKeys: ["evaluation.recs.analyticsSvc.1", "evaluation.recs.analyticsSvc.2", "evaluation.recs.analyticsSvc.3"] },
  "ml-pipeline":     { overall: "C",  quality: 58, coverage: 32, security: 61, perf: 55, maintain: 50, recKeys: ["evaluation.recs.mlPipeline.1", "evaluation.recs.mlPipeline.2", "evaluation.recs.mlPipeline.3", "evaluation.recs.mlPipeline.4"] },
};