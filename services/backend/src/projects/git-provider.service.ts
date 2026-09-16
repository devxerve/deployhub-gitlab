import { Injectable } from "@nestjs/common";

import { GitApiService } from "./git-api.service";
import { GithubApiService } from "./github-api.service";
import { GitLabApiService } from "./gitlab-api.service";
import { identifyGitProvider } from "./utils/git.utils";

@Injectable()
export class GitProviderService {
  constructor(
    private readonly githubApi: GithubApiService,
    private readonly gitlabApi: GitLabApiService,
  ) {}

  async resolve(repoUrl: string): Promise<GitApiService> {
    const url = new URL(repoUrl);
    const provider = await identifyGitProvider(url);

    switch (provider) {
      case "github":
        return this.githubApi;

      case "gitlab":
        return this.gitlabApi;

      default:
        throw new Error(
          `No se pudo identificar el proveedor Git de ${repoUrl}.`,
        );
    }
  }
}
