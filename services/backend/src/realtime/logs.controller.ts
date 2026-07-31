import { Controller, Get, Query } from "@nestjs/common";
import { LogsService, LogLevel, LogPage } from "./logs.service";

@Controller("logs")
export class LogsController {
  constructor(private readonly logsService: LogsService) {}

  @Get()
  getLogs(
    @Query("search") search?: string,
    @Query("level") level?: LogLevel | "ALL",
    @Query("page") page?: string,
    @Query("perPage") perPage?: string,
  ): Promise<LogPage> {
    return this.logsService.getLogs({
      search,
      level,
      page: page ? parseInt(page, 10) : undefined,
      perPage: perPage ? parseInt(perPage, 10) : undefined,
    });
  }
}
