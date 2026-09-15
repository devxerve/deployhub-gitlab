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
export class GitLabApiService {
  constructor(private readonly httpService: HttpService) {}

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

  private parseOrThrow(repoUrl: string): { owner: string; repo: string } {
    const parsed = parseGitRepo(repoUrl);
    if (!parsed) {
      throw new BadRequestException("URL de repositorio de GitLab no válida.");
    }
    return parsed;
  }

  private async get<T>(url: string, repoUrl: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(url, {
          headers: {
            Accept: "application/json",
          },
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
            `No se tiene acceso al repositorio ${repoUrl}.`,
          );
        }

        if (error.response?.status === 429) {
          throw new BadRequestException(
            "Límite de peticiones a la API de GitLab alcanzado. Inténtalo de nuevo en unos minutos.",
          );
        }
      }

      throw new BadRequestException(
        "No se pudo consultar GitLab para este repositorio.",
      );
    }
  }
}
