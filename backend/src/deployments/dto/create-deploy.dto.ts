import { IsString, IsNotEmpty } from 'class-validator';

export class CreateDeployDto {

  @IsString()
  @IsNotEmpty()
  repoUrl: string;

  @IsString()
  @IsNotEmpty()
  projectId: string;
}