import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  private deploys: Map<string, any> = new Map();

  // Simulamos la tabla "deploy"
  deploy = {
    // Simula crear un registro en la DB
    create: async (args: any) => {
      console.log('--- [MOCK DB] Guardando nuevo deploy ---', args.data);
      const id = args.data.id || `deploy-uuid-${Math.random().toString(36).substr(2, 9)}`;
      const newDeploy = {
        id,
        repoUrl: args.data.repoUrl,
        projectId: args.data.projectId,
        status: args.data.status,
        port: null,
        createdAt: new Date(),
        commitHash: args.data.commitHash || null,
        envVariables: args.data.envVariables || null,
      };
      this.deploys.set(id, newDeploy);
      return newDeploy;
    },
    // Simula buscar el último puerto
    findFirst: async (args: any) => {
      console.log('--- [MOCK DB] Buscando último puerto usado ---');
      let highestPort = 3000;
      for (const d of this.deploys.values()) {
        if (d.port && d.port > highestPort) {
          highestPort = d.port;
        }
      }
      return { port: highestPort }; 
    },
    // Simula actualizar el estado
    update: async (args: any) => {
      console.log(`--- [MOCK DB] Actualizando deploy ${args.where.id} a estado:`, args.data);
      const existing = this.deploys.get(args.where.id) || {};
      const updated = {
        ...existing,
        ...args.data,
      };
      this.deploys.set(args.where.id, updated);
      return updated;
    },
    // Simula buscar por ID (Este es el que usa tu procesador)
    findUnique: async (args: any) => {
      console.log(`--- [MOCK DB] Buscando deploy por ID: ${args.where.id} ---`);
      const existing = this.deploys.get(args.where.id);
      if (existing) {
        return existing;
      }
      return {
        id: args.where.id,
        repoUrl: 'https://github.com/TranscendenceFortyTwo/app-prueba.git', 
        projectId: 'project-test',
        status: 'RUNNING',
        port: 3001,
        commitHash: '9b1deb4d3b7d4cc569f5a24b0de8e27861401347', 
        envVariables: JSON.stringify({ DATABASE_URL: 'supabase_mock_url', PORT: '3000' }),
      };
    },
    // Simula traer todos
    findMany: async (args: any) => {
      console.log('--- [MOCK DB] Trayendo todos los deploys ---');
      return Array.from(this.deploys.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
    },
    // Simula borrar
    delete: async (args: any) => {
      console.log(`--- [MOCK DB] Borrando deploy: ${args.where.id} ---`);
      this.deploys.delete(args.where.id);
      return { id: args.where.id };
    }
  };
}