import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { CreateProjectDto } from "./dto/create-project.dto";
import { ProjectsService } from "./projects.service";
import { AuthGuard } from "../auth/auth.guard";
import { CurrentUser } from "../auth/current-user.decorator";
import type { AuthenticatedUser } from "../auth/auth.guard";

@Controller("projects")
@UseGuards(AuthGuard)
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() dto: CreateProjectDto, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.create(dto, user.user_id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.findAll(user.user_id);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.remove(id, user.user_id);
  }

  @Get(":id/branches")
  getBranches(@Param("id") id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.projectsService.getBranches(id, user.user_id);
  }

  @Get(":id/commits")
  getCommits(
    @Param("id") id: string,
    @Query("branch") branch: string | undefined,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    if (!branch?.trim()) {
      throw new BadRequestException("El parámetro 'branch' es obligatorio.");
    }
    return this.projectsService.getCommits(id, user.user_id, branch.trim());
  }
}
