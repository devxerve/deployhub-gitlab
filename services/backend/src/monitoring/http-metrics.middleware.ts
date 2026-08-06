import { Injectable, NestMiddleware } from "@nestjs/common";

import type { NextFunction, Request, Response } from "express";

import { httpRequestDuration } from "./metrics.registry";

interface RouteInfo {
  path?: unknown;
}

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const end = httpRequestDuration.startTimer({
      method: req.method,
    });

    res.on("finish", () => {
      const routeInfo = (
        req as unknown as {
          route?: RouteInfo;
        }
      ).route;

      const route =
        typeof routeInfo?.path === "string" ? routeInfo.path : req.path;

      end({
        route,
        status_code: String(res.statusCode),
      });
    });

    next();
  }
}
