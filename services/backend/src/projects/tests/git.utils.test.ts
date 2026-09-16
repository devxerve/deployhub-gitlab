import assert from "node:assert/strict";
import {
  identifyGitProvider,
  isValidGitRepoUrl,
  normalizeGitRepoUrl,
  parseGitRepo,
  parseGitRepoUrl,
  probeGitLab,
  slugifyProjectName,
} from "../utils/git.utils.js";

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
  console.error(`    ${error instanceof Error ? error.message : error}`);
}

function test(
  description: string,
  callback: () => void,
) {
  try {
    callback();
    pass(description);
  } catch (error) {
    fail(description, error);
  }
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

async function testNormalizeGitRepoUrl() {
  logSuite("normalizeGitRepoUrl");

  test("removes surrounding whitespace and trailing slash", () => {
    assert.equal(
      normalizeGitRepoUrl(" https://github.com/devxerve/ARES/ "),
      "https://github.com/devxerve/ARES",
    );
  });

  test("removes .git suffix", () => {
    assert.equal(
      normalizeGitRepoUrl("https://github.com/devxerve/ARES.git"),
      "https://github.com/devxerve/ARES",
    );
  });

  test("handles empty string", () => {
    assert.equal(normalizeGitRepoUrl(""), "");
  });

  test("returns invalid input unchanged", () => {
    assert.equal(normalizeGitRepoUrl("not-a-url"), "not-a-url");
  });
}

async function testParseGitRepoUrl() {
  logSuite("parseGitRepoUrl");

  test("parses GitHub repository URL", () => {
    assert.deepEqual(
      parseGitRepoUrl(
        new URL("https://github.com/devxerve/ARES"),
      ),
      {
        host: "github.com",
        path: "devxerve/ARES",
      },
    );
  });

  test("parses self-hosted GitLab repository URL", () => {
    assert.deepEqual(
      parseGitRepoUrl(
        new URL("https://git.xerve.es/group/subgroup/project"),
      ),
      {
        host: "git.xerve.es",
        path: "group/subgroup/project",
      },
    );
  });

  test("removes leading and trailing slashes from path", () => {
    assert.deepEqual(
      parseGitRepoUrl(
        new URL("https://gitlab.com/group/project/"),
      ),
      {
        host: "gitlab.com",
        path: "group/project",
      },
    );
  });
}

async function testIsValidGitRepoUrl() {
  logSuite("isValidGitRepoUrl");

  test("accepts GitHub repository URL", () => {
    assert.equal(
      isValidGitRepoUrl("https://github.com/devxerve/ARES"),
      true,
    );
  });

  test("accepts GitLab.com repository URL", () => {
    assert.equal(
      isValidGitRepoUrl("https://gitlab.com/group/project"),
      true,
    );
  });

  test("accepts self-hosted GitLab repository URL", () => {
    assert.equal(
      isValidGitRepoUrl("https://git.xerve.es/group/project"),
      true,
    );
  });

  test("rejects HTTP URLs", () => {
    assert.equal(
      isValidGitRepoUrl("http://github.com/devxerve/ARES"),
      false,
    );
  });

  test("rejects URL without repository path", () => {
    assert.equal(
      isValidGitRepoUrl("https://github.com"),
      false,
    );
  });

  test("rejects malformed URL", () => {
    assert.equal(
      isValidGitRepoUrl("not-a-url"),
      false,
    );
  });

  test("rejects empty string", () => {
    assert.equal(isValidGitRepoUrl(""), false);
  });
}

async function testParseGitRepo() {
  logSuite("parseGitRepo");

  test("parses GitHub owner/repository", () => {
    assert.deepEqual(
      parseGitRepo("https://github.com/devxerve/ARES"),
      {
        owner: "devxerve",
        repo: "ARES",
      },
    );
  });

  test("parses GitLab owner/repository", () => {
    assert.deepEqual(
      parseGitRepo("https://gitlab.com/gitlab-org/gitlab"),
      {
        owner: "gitlab-org",
        repo: "gitlab",
      },
    );
  });

  test("parses self-hosted GitLab with nested groups", () => {
    assert.deepEqual(
      parseGitRepo(
        "https://git.xerve.es/group/subgroup/project",
      ),
      {
        owner: "group/subgroup",
        repo: "project",
      },
    );
  });

  test("returns null for URL without repository", () => {
    assert.equal(
      parseGitRepo("https://github.com"),
      null,
    );
  });

  test("returns null for malformed URL", () => {
    assert.equal(
      parseGitRepo("not-a-url"),
      null,
    );
  });
}

async function testProbeGitLab() {
  logSuite("probeGitLab");

  const originalFetch = globalThis.fetch;

  try {
    await testAsync(
      "detects GitLab through x-gitlab-meta header",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 401,
            headers: {
              "x-gitlab-meta": '{"version":"1"}',
            },
          });

        assert.equal(
          await probeGitLab(
            new URL("https://git.xerve.es/group/project"),
          ),
          true,
        );
      },
    );

    await testAsync(
      "detects GitLab even when API returns 401",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 401,
            headers: {
              "x-gitlab-meta": '{"version":"1"}',
            },
          });

        assert.equal(
          await probeGitLab(
            new URL("https://gitlab.com/group/project"),
          ),
          true,
        );
      },
    );

    await testAsync(
      "rejects host without x-gitlab-meta",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 404,
          });

        assert.equal(
          await probeGitLab(
            new URL("https://example.com/group/project"),
          ),
          false,
        );
      },
    );

    await testAsync(
      "handles network errors gracefully",
      async () => {
        globalThis.fetch = async () => {
          throw new Error("Network error");
        };

        assert.equal(
          await probeGitLab(
            new URL("https://git.xerve.es/group/project"),
          ),
          false,
        );
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testIdentifyGitProvider() {
  logSuite("identifyGitProvider");

  const originalFetch = globalThis.fetch;

  try {
    await testAsync(
      "identifies GitHub by hostname",
      async () => {
        let fetchCalled = false;

        globalThis.fetch = async () => {
          fetchCalled = true;

          return new Response(null, {
            status: 401,
            headers: {
              "x-gitlab-meta": '{"version":"1"}',
            },
          });
        };

        const provider = await identifyGitProvider(
          new URL("https://github.com/devxerve/ARES"),
        );

        assert.equal(provider, "github");
        assert.equal(
          fetchCalled,
          false,
          "GitHub detection should not probe GitLab",
        );
      },
    );

    await testAsync(
      "identifies GitLab.com through API probe",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 401,
            headers: {
              "x-gitlab-meta": '{"version":"1"}',
            },
          });

        const provider = await identifyGitProvider(
          new URL("https://gitlab.com/gitlab-org/gitlab"),
        );

        assert.equal(provider, "gitlab");
      },
    );

    await testAsync(
      "identifies self-hosted GitLab",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 401,
            headers: {
              "x-gitlab-meta": '{"version":"1"}',
            },
          });

        const provider = await identifyGitProvider(
          new URL("https://git.xerve.es/group/project"),
        );

        assert.equal(provider, "gitlab");
      },
    );

    await testAsync(
      "returns unknown for non-GitLab host",
      async () => {
        globalThis.fetch = async () =>
          new Response(null, {
            status: 404,
          });

        const provider = await identifyGitProvider(
          new URL("https://example.com/group/project"),
        );

        assert.equal(provider, "unknown");
      },
    );

    await testAsync(
      "returns unknown when GitLab probe fails",
      async () => {
        globalThis.fetch = async () => {
          throw new Error("Network error");
        };

        const provider = await identifyGitProvider(
          new URL("https://unknown-git.example.com/group/project"),
        );

        assert.equal(provider, "unknown");
      },
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}

async function testSlugifyProjectName() {
  logSuite("slugifyProjectName");

  test("converts project name to lowercase slug", () => {
    assert.equal(
      slugifyProjectName("ARES Project"),
      "ares-project",
    );
  });

  test("removes accents", () => {
    assert.equal(
      slugifyProjectName("Mi Proyecto Español"),
      "mi-proyecto-espanol",
    );
  });

  test("collapses special characters", () => {
    assert.equal(
      slugifyProjectName("hello---world___test"),
      "hello-world-test",
    );
  });

  test("trims whitespace", () => {
    assert.equal(
      slugifyProjectName("  my project  "),
      "my-project",
    );
  });

  test("returns empty string for empty input", () => {
    assert.equal(slugifyProjectName(""), "");
  });

  test("returns empty string when input contains no valid characters", () => {
    assert.equal(slugifyProjectName("!!!"), "");
  });

  test("limits result to 64 characters", () => {
    assert.equal(
      slugifyProjectName("A".repeat(100)).length,
      64,
    );
  });
}

async function main() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       git.utils.ts test suite       ║");
  console.log("╚══════════════════════════════════════╝");

  await testNormalizeGitRepoUrl();
  await testParseGitRepoUrl();
  await testIsValidGitRepoUrl();
  await testParseGitRepo();
  await testProbeGitLab();
  await testIdentifyGitProvider();
  await testSlugifyProjectName();

  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Tests passed: ${passed}`);
  console.log(`Tests failed: ${failed}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

  if (failed > 0) {
    console.error("\n✗ Test suite failed\n");
    process.exitCode = 1;
    return;
  }

  console.log("\n✓ All git.utils tests passed\n");
}

main();
