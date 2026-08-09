import {
  Body,
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
  Param,
} from "@nestjs/common";

import { CreateDeployDto } from "./dto/create-deploy.dto";
import { DeploymentsService } from "./deployments.service";
import { DeploymentsProcessor } from "./deployments.processor";
import { DockerUtil } from "./utils/docker.utils";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthenticatedUser } from "../auth/auth.guard";

@Controller("deploy")
@UseGuards(AuthGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class DeploymentsController {
  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly deploymentsProcessor: DeploymentsProcessor,
    private readonly dockerUtil: DockerUtil,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateDeployDto,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const deploy = await this.deploymentsService.createDeploy(dto, user.user_id);
    void this.deploymentsProcessor.process(deploy.id);
    return deploy;
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.deploymentsService.getAllDeploys(user.user_id);
  }

  @Get("logs")
  getRecentLogs(@CurrentUser() user: AuthenticatedUser) {
    return this.dockerUtil.getRecentDeploymentLogs(user.user_id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deploymentsService.remove(id, user.user_id);
  }

  @Get(":id/logs")
  getDeployLogs(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.deploymentsService.getDeployLogs(id, user.user_id);
  }
}
