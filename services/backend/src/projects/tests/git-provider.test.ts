import "reflect-metadata";

import { HttpService } from "@nestjs/axios";
import { firstValueFrom, of } from "rxjs";

import { GitProviderService } from "../git-provider.service";
import { GithubApiService } from "../github-api.service";
import { GitLabApiService } from "../gitlab-api.service";

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(` ✗${message}`);
  }

  console.log(`✓ ${message}`);
}

async function testProviderResolution() {
  console.log("\n=== GitProviderService ===");

  const httpService = new HttpService();

  const githubApi = new GithubApiService(httpService);
  const gitlabApi = new GitLabApiService(httpService);

  const provider = new GitProviderService(githubApi, gitlabApi);

  const github = await provider.resolve(
    "https://github.com/devxerve-ares/ARES",
  );

  assert(
    github instanceof GithubApiService,
    "GitHub repository resolves to GithubApiService",
  );

  const gitlab = await provider.resolve(
    "https://gitlab.com/example/example",
  );

  assert(
    gitlab instanceof GitLabApiService,
    "GitLab repository resolves to GitLabApiService",
  );
}

async function testGitHubApi() {
  console.log("\n=== GitHub API ===");

  const httpService = new HttpService();
  const githubApi = new GithubApiService(httpService);

  const branches = await githubApi.listBranches(
    "https://github.com/devxerve-ares/ARES",
  );

  assert(
    Array.isArray(branches),
    "GitHub branches returns an array",
  );

  assert(
    branches.length > 0,
    "GitHub repository has at least one branch",
  );

  console.log(`  → ${branches.length} branches found`);

  const commits = await githubApi.listCommits(
    "https://github.com/devxerve-ares/ARES",
    branches[0].name,
  );

  assert(
    Array.isArray(commits),
    "GitHub commits returns an array",
  );

  console.log(`  → ${commits.length} commits found`);

  if (commits.length > 0) {
    console.log(`  → Latest commit: ${commits[0].sha}`);
    console.log(`  → Message: ${commits[0].message}`);
    console.log(`  → Author: ${commits[0].author}`);
  }
}

async function testGitLabApi() {
  console.log("\n=== GitLab API ===");

  const repoUrl = "https://gitlab.com/gitlab-org/gitlab";

  const httpService = new HttpService();
  const gitlabApi = new GitLabApiService(httpService);

  const branches = await gitlabApi.listBranches(repoUrl);

  assert(
    Array.isArray(branches),
    "GitLab branches returns an array",
  );

  assert(
    branches.length > 0,
    "GitLab repository has at least one branch",
  );

  console.log(`  → ${branches.length} branches found`);

  const commits = await gitlabApi.listCommits(
    repoUrl,
    branches[0].name,
  );

  assert(
    Array.isArray(commits),
    "GitLab commits returns an array",
  );

  console.log(`  → ${commits.length} commits found`);

  if (commits.length > 0) {
    console.log(`  → Latest commit: ${commits[0].sha}`);
    console.log(`  → Message: ${commits[0].message}`);
    console.log(`  → Author: ${commits[0].author}`);
  }
}
async function testSelfHostedGitLab() {
  console.log("\n=== Self-hosted GitLab ===");

  const repoUrl = "https://git.xerve.es/devxerve/ares.git";

  const httpService = new HttpService();
  const gitlabApi = new GitLabApiService(httpService);

  const branches = await gitlabApi.listBranches(repoUrl);

  assert(
    Array.isArray(branches),
    "Self-hosted GitLab branches returns an array",
  );

  assert(
    branches.length > 0,
    "Self-hosted GitLab repository has branches",
  );

  console.log(`→ ${branches.length} branches found`);

  const commits = await gitlabApi.listCommits(
    repoUrl,
    branches[0].name,
  );

  assert(
    Array.isArray(commits),
    "Self-hosted GitLab commits returns an array",
  );

  console.log(`→ ${commits.length} commits found`);
}

async function main() {
  console.log("========================================");
  console.log("   Git Provider Integration Tests");
  console.log("========================================");

  try {
    await testProviderResolution();
    await testGitHubApi();
    await testGitLabApi();
    await testSelfHostedGitLab();
    console.log("\n========================================");
    console.log(" ALL TESTS PASSED");
    console.log("========================================\n");
  } catch (error) {
    console.error("\n========================================");
    console.error(" TEST FAILED");
    console.error("========================================");

    console.error(error);

    process.exit(1);
  }
}

void main();
