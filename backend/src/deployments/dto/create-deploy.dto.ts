import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDeployDto {

  @IsString()
  @IsNotEmpty()
  repoUrl: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;

  @IsOptional()
  @IsString()
  commitHash?: string;

  @IsOptional()
  @IsString()
  envVariables?: Record<string, string>;
}