import { Injectable, Logger } from '@nestjs/common';
import { spawn } from 'child_process';
import { DeploymentsService } from '../deployments.service';

@Injectable()
export class DockerUtil {
  private readonly logger = new Logger(DockerUtil.name);

  constructor(private readonly deploymentsService: DeploymentsService) {}

  async buildImage(id: string, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.logger.log(`[DOCKER] Starting build for ${id}`);
      
      const child = spawn('docker', ['build', '-t', `deploy-${id}`, path]);

      child.stdout.on('data', (data) => {
        this.deploymentsService.addLogRealtime(id, data.toString());
      });

      child.stderr.on('data', (data) => {
        this.deploymentsService.addLogRealtime(id, `[BUILD ERROR]: ${data.toString()}`);
      });

      child.on('close', (code) => {
        code === 0 ? resolve() : reject(new Error(`Docker build failed: ${code}`));
      });
    });
  }

  async runContainer(id: string, port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const child = spawn('docker', [
        'run', '-d', 
        '-p', `${port}:3000`, 
        '--name', `container-${id}`, 
        `deploy-${id}`
      ]);

      child.on('close', (code) => {
        code === 0 ? resolve() : reject(new Error(`Docker run failed: ${code}`));
      });
    });
  }
}