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

// cualquier peticion que llegue a la dirección deployments se va a manejar en este controlador
@Controller("deploy")
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class DeploymentsController {
  // necesita de deploymentsService y deploymentsProcessor
  constructor(
    private readonly deploymentsService: DeploymentsService,
    private readonly deploymentsProcessor: DeploymentsProcessor,
  ) {}

  // POST /deploy
  @Post()
  async create(@Body() dto: CreateDeployDto) {
    const deploy = await this.deploymentsService.createDeploy(dto);
    this.deploymentsProcessor.process(deploy.id);
    return deploy;
  }
  // GET /deploy
  @Get()
  findAll() {
    return this.deploymentsService.getAllDeploys();
  }
  // DELETE /deploy/:id
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.deploymentsService.remove(id);
  }
  // OBTENER DEPLOY ESPECÍFICO
  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.deploymentsService.getDeployById(id);
  }
  // VER ESTADO ACTUAL
  @Get(":id/status")
  getStatus(@Param("id") id: string) {
    return this.deploymentsService.getDeployStatus(id);
  }
}
