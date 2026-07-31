import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { httpRequestDuration } from "./metrics.registry";

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const end = httpRequestDuration.startTimer({ method: req.method });

    res.on("finish", () => {
      const route = req.route?.path ?? req.path;
      end({ route, status_code: String(res.statusCode) });
    });

    next();
  }
}
