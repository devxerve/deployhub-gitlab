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
        // 🌟 NUEVO: El mock ahora retorna lo que recibe en el DTO
        commitHash: args.data.commitHash || null,
        envVariables: args.data.envVariables || null,
      };
    },
    // Simula buscar el último puerto
    findFirst: async (args: any) => {
      console.log('--- [MOCK DB] Buscando último puerto usado ---');
      return { port: 3000 }; 
    },
    // Simula actualizar el estado
    update: async (args: any) => {
      console.log(`--- [MOCK DB] Actualizando deploy ${args.where.id} a estado: ${args.data.status} ---`);
      return { id: args.where.id, status: args.data.status };
    },
    // Simula buscar por ID (Este es el que usa tu procesador)
    findUnique: async (args: any) => {
      console.log(`--- [MOCK DB] Buscando deploy por ID: ${args.where.id} ---`);
      return {
        id: args.where.id,
        repoUrl: 'https://github.com/claudia-gil/test-repo.git', // Puedes cambiarlo por uno tuyo de pruebas
        projectId: 'project-test',
        status: 'RUNNING',
        port: 3001,
        // 🌟 NUEVO: Agregamos valores por defecto simulados para que tu procesador no dé error
        commitHash: '9b1deb4d3b7d4cc569f5a24b0de8e27861401347', 
        envVariables: JSON.stringify({ DATABASE_URL: 'supabase_mock_url', PORT: '3000' }),
      };
    },
    // Simula traer todos
    findMany: async (args: any) => {
      console.log('--- [MOCK DB] Trayendo todos los deploys ---');
      return [
        { id: 'fake-1', projectId: 'p1', status: 'RUNNING', port: 3001, commitHash: null, envVariables: null },
        { id: 'fake-2', projectId: 'p2', status: 'FAILED', port: null, commitHash: null, envVariables: null }
      ];
    },
    // Simula borrar
    delete: async (args: any) => {
      console.log(`--- [MOCK DB] Borrando deploy: ${args.where.id} ---`);
      return { id: args.where.id };
    }
  };
}