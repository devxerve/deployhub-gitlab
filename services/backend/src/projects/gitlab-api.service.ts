import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

import { RepoBranch, RepoCommit } from "./api-shared-interfaces";
import { GitApiService } from "./git-api.service";

interface GitLabBranchResponse {
  name: string;
  commit: {
    id: string;
  };
}

interface GitLabCommitResponse {
  id: string;
  message: string;
  author_name?: string;
  authored_date?: string;
}

@Injectable()
export class GitLabApiService extends GitApiService {

  readonly providerName = "gitlab" as const;
  constructor(httpService: HttpService) {
    super(httpService);
  }

  async listBranches(repoUrl: string): Promise<RepoBranch[]> {
    const { owner, repo } = this.parseOrThrow(repoUrl);
    const url = new URL(repoUrl);
    const projectPath = `${owner}/${repo}`;
    const apiBaseUrl = `${url.origin}/api/v4`;
    const encodedProjectPath = encodeURIComponent(projectPath);

    const branches = await this.get<GitLabBranchResponse[]>(
      `${apiBaseUrl}/projects/${encodedProjectPath}/repository/branches?per_page=100`,
      repoUrl,
    );

    return branches.map((branch) => ({
      name: branch.name,
      commitSha: branch.commit.id,
    }));
  }

  async listCommits(repoUrl: string, branch: string): Promise<RepoCommit[]> {
    const { owner, repo } = this.parseOrThrow(repoUrl);
    const url = new URL(repoUrl);
    const projectPath = `${owner}/${repo}`;
    const apiBaseUrl = `${url.origin}/api/v4`;
    const encodedProjectPath = encodeURIComponent(projectPath);

    const commits = await this.get<GitLabCommitResponse[]>(
      `${apiBaseUrl}/projects/${encodedProjectPath}/repository/commits?ref_name=${encodeURIComponent(branch)}&per_page=20`,
      repoUrl,
    );

    return commits.map((entry) => ({
      sha: entry.id,
      message: entry.message.split("\n")[0],
      author: entry.author_name ?? "unknown",
      date: entry.authored_date ?? "",
    }));
  }


}
