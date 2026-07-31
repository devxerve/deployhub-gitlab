import { Injectable } from "@nestjs/common";
import { LogsGateway } from "./logs.gateway";

export type LogLevel = "INFO" | "WARN" | "ERROR";

export interface LogEntry {
  deployId: string;
  level: LogLevel;
  message: string;
  timestamp: string;
}

export interface LogPage {
  items: LogEntry[];
  total: number;
  page: number;
  perPage: number;
}

interface GetLogsOptions {
  search?: string;
  level?: LogLevel | "ALL";
  page?: number;
  perPage?: number;
}

const MAX_LOGS_IN_MEMORY = 1000;
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 50;

function detectLevel(message: string): LogLevel {
  const upper = message.toUpperCase();
  if (upper.includes("ERROR")) return "ERROR";
  if (upper.includes("WARN")) return "WARN";
  return "INFO";
}

@Injectable()
export class LogsService {
  private readonly logs: LogEntry[] = [];

  constructor(private readonly gateway: LogsGateway) {}

  async getLogs(options: GetLogsOptions): Promise<LogPage> {
    const page = options.page && options.page > 0 ? options.page : DEFAULT_PAGE;
    const perPage = options.perPage && options.perPage > 0 ? options.perPage : DEFAULT_PER_PAGE;

    let filtered = this.logs;

    if (options.level && options.level !== "ALL") {
      filtered = filtered.filter((entry) => entry.level === options.level);
    }

    if (options.search) {
      const search = options.search.toLowerCase();
      filtered = filtered.filter((entry) => entry.message.toLowerCase().includes(search));
    }

    const total = filtered.length;
    const start = (page - 1) * perPage;
    const items = filtered.slice(start, start + perPage);

    return { items, total, page, perPage };
  }

  sendLog(deployId: string, log: string) {
    this.logs.push({
      deployId,
      level: detectLevel(log),
      message: log,
      timestamp: new Date().toISOString(),
    });
    if (this.logs.length > MAX_LOGS_IN_MEMORY) {
      this.logs.shift();
    }
    this.gateway.sendLog(deployId, log);
  }

  sendStatus(deployId: string, status: string) {
    this.gateway.sendStatus(deployId, status);
  }

  sendStart(deployId: string) {
    this.gateway.sendStart(deployId);
  }

  sendEnd(deployId: string, success: boolean) {
    this.gateway.sendEnd(deployId, success);
  }
}
