import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  Get,
  Delete,
  Param,
} from "@nestjs/common";

import { CreateDeployDto } from "./dto/create-deploy.dto";
import { DeploymentsService } from "./deployments.service";
import { DeploymentsProcessor } from "./deployments.processor";

@Controller("deploy")
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
  ) {}

  @Post()
  async create(@Body() dto: CreateDeployDto) {
    const deploy = await this.deploymentsService.createDeploy(dto);
    void this.deploymentsProcessor.process(deploy.id);
    return deploy;
  }

  @Get()
  findAll() {
    return this.deploymentsService.getAllDeploys();
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deploymentsService.remove(id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deploymentsService.getDeployById(id);
  }

  @Get(":id/status")
  getStatus(@Param("id") id: string) {
    return this.deploymentsService.getDeployStatus(id);
  }
}
