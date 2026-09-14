import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { parseGitRepo } from "./utils/git.utils";

export interface RepoBranch {
  name: string;
  commitSha: string;
}

export interface RepoCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
}

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
export class GithubApiService {
  constructor(private readonly httpService: HttpService) {}

  async listBranches(repoUrl: string): Promise<RepoBranch[]> {
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

  async listCommits(repoUrl: string, branch: string): Promise<RepoCommit[]> {
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

  private parseOrThrow(repoUrl: string): { owner: string; repo: string } {
    const parsed = parseGitHubRepo(repoUrl);
    if (!parsed) {
      throw new BadRequestException("URL de repositorio de GitHub no válida.");
    }
    return parsed;
  }

  private async get<T>(url: string, repoUrl: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          headers: { Accept: "application/vnd.github+json" },
        }),
      );
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response?.status === 404) {
          throw new BadRequestException(
            `No se encontró el repositorio o la rama en ${repoUrl}.`,
          );
        }
        if (error.response?.status === 403) {
          throw new BadRequestException(
            "Límite de peticiones a la API de GitHub alcanzado. Inténtalo de nuevo en unos minutos.",
          );
        }
      }
      throw new BadRequestException(
        "No se pudo consultar GitHub para este repositorio.",
      );
    }
  }
}
