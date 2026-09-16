import { Module } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { ProjectsController } from "./projects.controller";
import { ProjectsService } from "./projects.service";
import { GithubApiService } from "./github-api.service";
import { GitLabApiService } from "./gitlab-api.service";
import { GitProviderService } from "./git-provider.service";
import { PrismaService } from "../prisma/prisma.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [ProjectsController],
  providers: [ProjectsService,
    GithubApiService,
    GitLabApiService,
    PrismaService,
    GitProviderService],
  exports: [ProjectsService],
})
export class ProjectsModule {}
