import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { RepoBranch, RepoCommit } from "./api-shared-interfaces";
import { parseGitRepo } from "./utils/git.utils";

abstract class GitApiService {
  constructor(private readonly httpService: HttpService) { }
  protected abstract readonly providerName: string;

  abstract listBranches(
    repoUrl: string
  ): Promise<RepoBranch[]>;

  abstract listCommits(
    repoUrl: string,
    branch: string,
  ): Promise<RepoCommit[]>;

  protected parseOrThrow(repoUrl: string) {
    const parsed = parseGitRepo(repoUrl);

    if (!parsed) {
      throw new BadRequestException(
        `URL de repositorio de ${this.providerName} no válida.`,
      );
    }

    return parsed;
  }
}
