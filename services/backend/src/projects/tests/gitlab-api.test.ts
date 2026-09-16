import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

import axios from "axios";
import { HttpService } from "@nestjs/axios";

import {
  GitLabApiService,
} from "../gitlab-api.service.js";
import {
  RepoBranch,
  RepoCommit
} from "../api-shared-interfaces";

const execFileAsync = promisify(execFile);

const SELF_HOSTED_REPO_URL =
  "https://git.xerve.es/devxerve/ARES.git";

const GITLAB_COM_REPO_URL =
  "https://gitlab.com/gitlab-tests/sample-project.git";

const CLONE_PATHS = {
  selfHosted: "/home/xerve/ARES",
  gitlabCom: "/home/xerve/gitlab",
};

let passed = 0;
let failed = 0;

function logSuite(name: string) {
  console.log(`\n━━━ ${name} ━━━`);
}

function pass(description: string) {
  passed++;
  console.log(`  ✓ ${description}`);
}

function fail(description: string, error: unknown) {
  failed++;
  console.error(`  ✗ ${description}`);
  console.error(
    `    ${error instanceof Error ? error.message : error}`,
  );
}

async function testAsync(
  description: string,
  callback: () => Promise<void>,
) {
  try {
    await callback();
    pass(description);
  } catch (error) {
    fail(description, error);
  }
}

function createService(): GitLabApiService {
  const httpService = new HttpService(axios);
  return new GitLabApiService(httpService);
}

/* -------------------------------------------------------------------------- */
/* Branches                                                                    */
/* -------------------------------------------------------------------------- */

async function testListBranches(
  name: string,
  repoUrl: string,
) {
  logSuite(`GitLabApiService.listBranches - ${name}`);

  const service = createService();

  await testAsync(
    `retrieves branches from ${name}`,
    async () => {
      const branches = await service.listBranches(repoUrl);

      assert.ok(
        Array.isArray(branches),
        "Expected branches to be an array",
      );

      assert.ok(
        branches.length > 0,
        "Expected at least one branch",
      );

      for (const branch of branches) {
        assert.equal(typeof branch.name, "string");
        assert.ok(branch.name.length > 0);

        assert.equal(typeof branch.commitSha, "string");
        assert.ok(branch.commitSha.length > 0);

        console.log(
          `    → ${branch.name} (${branch.commitSha})`,
        );
      }
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Commits                                                                     */
/* -------------------------------------------------------------------------- */

async function testListCommits(
  name: string,
  repoUrl: string,
) {
  logSuite(`GitLabApiService.listCommits - ${name}`);

  const service = createService();

  let branches: RepoBranch[] = [];

  await testAsync(
    "retrieves branches before testing commits",
    async () => {
      branches = await service.listBranches(repoUrl);

      assert.ok(
        branches.length > 0,
        "Expected at least one branch",
      );

      console.log(
        `    → Using branch: ${branches[0].name}`,
      );
    },
  );

  if (branches.length === 0) {
    console.log(
      "    Skipping commit test because no branches were found.",
    );
    return;
  }

  const branch = branches[0].name;

  await testAsync(
    `retrieves commits from branch "${branch}"`,
    async () => {
      const commits = await service.listCommits(
        repoUrl,
        branch,
      );

      assert.ok(
        Array.isArray(commits),
        "Expected commits to be an array",
      );

      assert.ok(
        commits.length > 0,
        "Expected at least one commit",
      );

      for (const commit of commits) {
        assert.equal(typeof commit.sha, "string");
        assert.ok(commit.sha.length > 0);

        assert.equal(typeof commit.message, "string");

        assert.equal(typeof commit.author, "string");

        assert.equal(typeof commit.date, "string");

        console.log(
          `    → ${commit.sha.slice(0, 10)} | ${commit.author} | ${commit.message}`,
        );
      }
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Invalid branch                                                              */
/* -------------------------------------------------------------------------- */

async function testInvalidBranch(
  name: string,
  repoUrl: string,
) {
  logSuite(`GitLabApiService invalid branch handling - ${name}`);

  const service = createService();

  await testAsync(
    "returns an empty array for a non-existent branch",
    async () => {
      const commits = await service.listCommits(
        repoUrl,
        "this-branch-definitely-does-not-exist",
      );

      assert.deepEqual(
        commits,
        [],
        "Expected no commits for a non-existent branch",
      );

      console.log(
        "    → GitLab returned an empty commit list for the unknown branch",
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Invalid repository                                                          */
/* -------------------------------------------------------------------------- */

async function testInvalidRepository() {
  logSuite("GitLabApiService invalid repository handling");

  const service = createService();

  await testAsync(
    "rejects a non-existent repository",
    async () => {
      await assert.rejects(
        service.listBranches(
          "https://git.xerve.es/devxerve/this-repository-does-not-exist",
        ),
        (error: unknown) => {
          assert.ok(
            error instanceof Error,
            "Expected an Error",
          );

          console.log(
            `    → Received expected error: ${error.message}`,
          );

          return true;
        },
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Clone                                                                       */
/* -------------------------------------------------------------------------- */

async function testCloneRepository(
  name: string,
  repoUrl: string,
  clonePath: string,
) {
  logSuite(`Git clone integration - ${name}`);

  await testAsync(
    `clones repository into ${clonePath}`,
    async () => {
      console.log(`    → Repository: ${repoUrl}`);
      console.log(`    → Destination: ${clonePath}`);

      await execFileAsync(
        "git",
        [
          "clone",
          repoUrl,
          clonePath,
        ],
        {
          maxBuffer: 10 * 1024 * 1024,
        },
      );

      console.log("    → Clone completed");

      const { stdout } = await execFileAsync(
        "git",
        [
          "-C",
          clonePath,
          "rev-parse",
          "--is-inside-work-tree",
        ],
      );

      assert.equal(
        stdout.trim(),
        "true",
        "Clone destination is not a Git repository",
      );

      const { stdout: remote } = await execFileAsync(
        "git",
        [
          "-C",
          clonePath,
          "remote",
          "get-url",
          "origin",
        ],
      );

      assert.equal(
        remote.trim(),
        repoUrl,
        "Origin URL does not match the expected repository",
      );

      const { stdout: branch } = await execFileAsync(
        "git",
        [
          "-C",
          clonePath,
          "branch",
          "--show-current",
        ],
      );

      console.log(
        `    → Checked out branch: ${branch.trim() || "(detached HEAD)"}`,
      );

      const { stdout: commit } = await execFileAsync(
        "git",
        [
          "-C",
          clonePath,
          "rev-parse",
          "HEAD",
        ],
      );

      assert.ok(
        commit.trim().length > 0,
        "Repository has no HEAD commit",
      );

      console.log(
        `    → HEAD: ${commit.trim()}`,
      );
    },
  );
}

/* -------------------------------------------------------------------------- */
/* Main                                                                        */
/* -------------------------------------------------------------------------- */

async function main() {
  console.log(`
╔════════════════════════════════════════════════════════════╗
║             GitLabApiService test suite                   ║
╚════════════════════════════════════════════════════════════╝
`);

  console.log("Repositories:");
  console.log(`  Self-hosted: ${SELF_HOSTED_REPO_URL}`);
  console.log(`  GitLab.com:  ${GITLAB_COM_REPO_URL}`);

  /* Self-hosted GitLab */

  await testListBranches(
    "self-hosted GitLab",
    SELF_HOSTED_REPO_URL,
  );

  await testListCommits(
    "self-hosted GitLab",
    SELF_HOSTED_REPO_URL,
  );

  await testInvalidBranch(
    "self-hosted GitLab",
    SELF_HOSTED_REPO_URL,
  );

  await testCloneRepository(
    "self-hosted GitLab",
    SELF_HOSTED_REPO_URL,
    CLONE_PATHS.selfHosted,
  );

  /* GitLab.com */

  await testListBranches(
    "GitLab.com",
    GITLAB_COM_REPO_URL,
  );

  await testListCommits(
    "GitLab.com",
    GITLAB_COM_REPO_URL,
  );

  await testInvalidBranch(
    "GitLab.com",
    GITLAB_COM_REPO_URL,
  );

  await testCloneRepository(
    "GitLab.com",
    GITLAB_COM_REPO_URL,
    CLONE_PATHS.gitlabCom,
  );

  /* Invalid repository */

  await testInvalidRepository();

  /* Summary */

  console.log(
    "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );

  console.log(`Tests passed: ${passed}`);
  console.log(`Tests failed: ${failed}`);

  console.log(
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  );

  if (failed > 0) {
    console.error("✗ Test suite failed");
    process.exit(1);
  }

  console.log("✓ All tests passed");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
