import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaService {
  // Simulamos la tabla "deploy"
  deploy = {
    // Simula crear un registro en la DB
    create: async (args: any) => {
      console.log('--- [MOCK DB] Guardando nuevo deploy ---', args.data);
      return {
        id: 'fake-uuid-1234',
        repoUrl: args.data.repoUrl,
        projectId: args.data.projectId,
        status: args.data.status,
        port: null,
        createdAt: new Date(),
      };
    },
    // Simula buscar el último puerto
    findFirst: async (args: any) => {
      console.log('--- [MOCK DB] Buscando último puerto usado ---');
      return { port: 3000 }; // Simulamos que el último puerto fue el 3000
    },
    // Simula actualizar el estado
    update: async (args: any) => {
      console.log(`--- [MOCK DB] Actualizando deploy ${args.where.id} a estado: ${args.data.status} ---`);
      return { id: args.where.id, status: args.data.status };
    },
    // Simula buscar por ID
    findUnique: async (args: any) => {
      console.log(`--- [MOCK DB] Buscando deploy por ID: ${args.where.id} ---`);
      return {
        id: args.where.id,
        repoUrl: 'https://github.com/test/repo.git',
        projectId: 'project-test',
        status: 'RUNNING',
        port: 3001,
      };
    },
    // Simula traer todos
    findMany: async (args: any) => {
      console.log('--- [MOCK DB] Trayendo todos los deploys ---');
      return [
        { id: 'fake-1', projectId: 'p1', status: 'RUNNING', port: 3001 },
        { id: 'fake-2', projectId: 'p2', status: 'FAILED', port: null }
      ];
    },
    // Simula borrar
    delete: async (args: any) => {
      console.log(`--- [MOCK DB] Borrando deploy: ${args.where.id} ---`);
      return { id: args.where.id };
    }
  };
}