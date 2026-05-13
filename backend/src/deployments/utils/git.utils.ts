import { Injectable, Logger } from '@nestjs/common';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';

// Promisify allows using async/await with the exec function, 
const execPromise = promisify(exec);

@Injectable()
export class GitUtil {
  private readonly logger = new Logger(GitUtil.name);

  /**
   * Clones a remote repository to a local path.
   * @param repoUrl - The URL of the repository
   * @param path - The local directory path where the files will be stored.
   */
  async cloneRepository(repoUrl: string, path: string): Promise<void> {
    try {
      // 1. ENSURE DIRECTORY EXISTS
      if (!fs.existsSync(path)) {
        this.logger.log(`Creating directory path: ${path}`);
        fs.mkdirSync(path, { recursive: true });
      }

      this.logger.log(`Executing: git clone --depth 1 ${repoUrl} ${path}`);

      // 2. EXECUTE THE CLONE COMMAND
      await execPromise(`git clone --depth 1 ${repoUrl} ${path}`);
      
      this.logger.log(`[GIT] Successfully cloned into ${path}`);
    } catch (error) {

      this.logger.error(`[GIT ERROR] Failed to clone ${repoUrl}: ${error.message}`);
      
      throw new Error(`Git error: ${error.message}`);
    }
  }
}