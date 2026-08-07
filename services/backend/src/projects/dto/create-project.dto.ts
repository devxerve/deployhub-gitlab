import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  repoUrl: string;

  @IsOptional()
  @IsString()
  defaultBranch?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
