import { HttpService } from "@nestjs/axios";
import { BadRequestException, Injectable } from "@nestjs/common";
import { isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { RepoBranch, RepoCommit } from "./api-shared-interfaces";
import { parseGitRepo, GitProvider} from "./utils/git.utils";

export abstract class GitApiService {
  constructor(protected readonly httpService: HttpService) { }
  protected abstract readonly providerName: GitProvider;

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
  protected async get<T>(url: string, repoUrl: string): Promise<T> {
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
            `Límite de peticiones a la API de ${this.providerName} alcanzado. Inténtalo de nuevo en unos minutos.`,
          );
        }
      }
      if (isAxiosError(error)) {
        console.error("Git API error:", {
          url: error.config?.url,
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
      }
      throw new BadRequestException(
        `No se pudo consultar ${this.providerName} para este repositorio.`,

      );
    }
  }
}
