import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import {
  isValidGitRepoUrl,
  normalizeGitHubUrl,
  slugifyProjectName,
} from "./utils/git.utils";
import { GithubApiService, RepoBranch, RepoCommit } from "./github-api.service";

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubApi: GithubApiService,
  ) {}

  async findAll(userId: string) {
    await this.backfillFromDeploys(userId);
    return this.prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async create(dto: CreateProjectDto, userId: string) {
    const repoUrl = normalizeGitHubUrl(dto.repoUrl);
    if (!isValidGitRepoUrl(repoUrl)) {
      throw new BadRequestException(
        "Introduce una URL válida de un repositorio de GitHub.",
      );
    }

    const id = slugifyProjectName(dto.name);
    if (!id) {
      throw new BadRequestException("El nombre del proyecto no es válido.");
    }

    const byRepo = await this.prisma.project.findFirst({
      where: { repoUrl, userId },
    });
    if (byRepo) {
      throw new ConflictException("Ese repositorio ya está registrado.");
    }

    this.logger.log(`Registering project: ${id}`);
    try {
      return await this.prisma.project.create({
        data: {
          id,
          userId,
          name: dto.name.trim(),
          repoUrl,
          defaultBranch: dto.defaultBranch?.trim() || "main",
          description: dto.description?.trim() || undefined,
        },
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("Ya existe un proyecto con ese nombre.");
      }
      throw error;
    }
  }

  async remove(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found.`);
    }
    await this.prisma.project.delete({ where: { id } });
  }

  async getBranches(id: string, userId: string): Promise<RepoBranch[]> {
    const project = await this.findOwned(id, userId);
    return this.githubApi.listBranches(project.repoUrl);
  }

  async getCommits(
    id: string,
    userId: string,
    branch: string,
  ): Promise<RepoCommit[]> {
    const project = await this.findOwned(id, userId);
    return this.githubApi.listCommits(project.repoUrl, branch);
  }

  private async findOwned(id: string, userId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id, userId },
    });
    if (!project) {
      throw new NotFoundException(`Project ${id} not found.`);
    }
    return project;
  }

  private async backfillFromDeploys(userId: string) {
    const deploys = await this.prisma.deploy.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: { projectId: true, repoUrl: true, branch: true, createdAt: true },
    });
    if (deploys.length === 0) return;

    const existingIds = new Set(
      (
        await this.prisma.project.findMany({
          where: { userId },
          select: { id: true },
        })
      ).map((project) => project.id),
    );

    const missing = new Map<string, (typeof deploys)[number]>();
    for (const deploy of deploys) {
      if (!existingIds.has(deploy.projectId) && !missing.has(deploy.projectId)) {
        missing.set(deploy.projectId, deploy);
      }
    }
    if (missing.size === 0) return;

    this.logger.log(`Backfilling ${missing.size} project(s) from deployment history`);
    await this.prisma.project.createMany({
      data: Array.from(missing.entries()).map(([projectId, deploy]) => ({
        id: projectId,
        userId,
        name: projectId,
        repoUrl: deploy.repoUrl,
        defaultBranch: deploy.branch || "main",
        createdAt: deploy.createdAt,
      })),
      skipDuplicates: true,
    });
  }
}
