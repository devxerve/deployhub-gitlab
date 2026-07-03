import { IsString, IsNotEmpty, IsOptional, IsObject } from "class-validator";

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
  @IsObject()
  envVariables?: Record<string, string>;
}
