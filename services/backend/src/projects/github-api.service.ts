import { HttpService } from "@nestjs/axios";
import { GitApiService } from "./git-api.service";


interface GitHubBranchResponse {
  name: string;
  commit: { sha: string };
}

interface GitHubCommitResponse {
  sha: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
}

@Injectable()
export class GithubApiService extends GitApiService{
  protected providerName: "github";
  constructor(httpService: HttpService) {
    super(httpService);
  }

  override async listBranches(repoUrl: string): Promise<RepoBranch[]> {
    const { owner, repo } = this.parseOrThrow(repoUrl);

    const branches = await this.get<GitHubBranchResponse[]>(
      `https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`,
      repoUrl,
    );

    return branches.map((branch) => ({
      name: branch.name,
      commitSha: branch.commit.sha,
    }));
  }

  override async listCommits(repoUrl: string, branch: string): Promise<RepoCommit[]> {
    const { owner, repo } = this.parseOrThrow(repoUrl);

    const commits = await this.get<GitHubCommitResponse[]>(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=${encodeURIComponent(branch)}&per_page=20`,
      repoUrl,
    );

    return commits.map((entry) => ({
      sha: entry.sha,
      message: entry.commit.message.split("\n")[0],
      author: entry.commit.author?.name ?? "unknown",
      date: entry.commit.author?.date ?? "",
    }));
  }
}
