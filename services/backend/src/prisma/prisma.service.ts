import { Injectable, Logger, NotFoundException } from "@nestjs/common";

import { DeployStatus } from "../deployments/constants/deploy-states";

export interface DeployRecord {
  id: string;
  repoUrl: string;
  projectId: string;
  status: DeployStatus;
  port: number | null;
  createdAt: Date;
  commitHash: string | null;
  branch: string | null;
  envVariables: string | null;
}

interface CreateDeployData {
  id?: string;
  repoUrl: string;
  projectId: string;
  status: DeployStatus;
  commitHash?: string | null;
  branch?: string | null;
  envVariables?: string | null;
}

interface CreateDeployArgs {
  data: CreateDeployData;
}

interface DeployWhere {
  id: string;
}

interface UpdateDeployData {
  repoUrl?: string;
  projectId?: string;
  status?: DeployStatus;
  port?: number | null;
  commitHash?: string | null;
  branch?: string | null;
  envVariables?: string | null;
}

interface UpdateDeployArgs {
  where: DeployWhere;
  data: UpdateDeployData;
}

interface FindUniqueDeployArgs {
  where: DeployWhere;
}

interface FindManyDeployArgs {
  orderBy?: {
    createdAt?: "asc" | "desc";
  };
}

interface DeleteDeployArgs {
  where: DeployWhere;
}

@Injectable()
export class PrismaService {
  private readonly logger = new Logger(PrismaService.name);

  private readonly deploys = new Map<string, DeployRecord>();

  readonly deploy = {
    create: (args: CreateDeployArgs): Promise<DeployRecord> => {
      const id =
        args.data.id ??
        `deploy-uuid-${Math.random().toString(36).slice(2, 11)}`;

      const newDeploy: DeployRecord = {
        id,
        repoUrl: args.data.repoUrl,
        projectId: args.data.projectId,
        status: args.data.status,
        port: null,
        createdAt: new Date(),
        commitHash: args.data.commitHash ?? null,
        branch: args.data.branch ?? null,
        envVariables: args.data.envVariables ?? null,
      };

      this.deploys.set(id, newDeploy);

      this.logger.debug(`Deployment ${id} stored in mock database`);

      return Promise.resolve(newDeploy);
    },

    findFirst: (): Promise<{
      port: number;
    }> => {
      let highestPort = 3000;

      for (const deploy of this.deploys.values()) {
        if (deploy.port !== null && deploy.port > highestPort) {
          highestPort = deploy.port;
        }
      }

      return Promise.resolve({
        port: highestPort,
      });
    },

    update: (args: UpdateDeployArgs): Promise<DeployRecord> => {
      const existing = this.deploys.get(args.where.id);

      if (!existing) {
        throw new NotFoundException(`Deployment ${args.where.id} not found`);
      }

      const updated: DeployRecord = {
        ...existing,
        ...args.data,
      };

      this.deploys.set(args.where.id, updated);

      this.logger.debug(`Deployment ${args.where.id} updated`);

      return Promise.resolve(updated);
    },

    findUnique: (args: FindUniqueDeployArgs): Promise<DeployRecord | null> => {
      const existing = this.deploys.get(args.where.id);

      return Promise.resolve(existing ?? null);
    },

    findMany: (args: FindManyDeployArgs = {}): Promise<DeployRecord[]> => {
      const direction = args.orderBy?.createdAt ?? "desc";

      const deployments = Array.from(this.deploys.values()).sort((a, b) => {
        const difference = a.createdAt.getTime() - b.createdAt.getTime();

        return direction === "asc" ? difference : -difference;
      });

      return Promise.resolve(deployments);
    },

    delete: (args: DeleteDeployArgs): Promise<{ id: string }> => {
      const existing = this.deploys.get(args.where.id);

      if (!existing) {
        throw new NotFoundException(`Deployment ${args.where.id} not found`);
      }

      this.deploys.delete(args.where.id);

      return Promise.resolve({
        id: args.where.id,
      });
    },
  };
}
