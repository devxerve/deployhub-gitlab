import "dotenv/config";

import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";

type CorsCallback = (error: Error | null, allow?: boolean) => void;

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger("Bootstrap");

  app.use(cookieParser());

  const allowedOrigins = (
    process.env.CORS_ORIGINS ?? "https://localhost,http://localhost:3000"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.enableCors({
    origin: (origin: string | undefined, callback: CorsCallback): void => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`Origin not allowed by CORS: ${origin}`), false);
    },

    credentials: true,

    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],

    allowedHeaders: ["Content-Type", "Accept", "Authorization"],
  });

  const port = Number(process.env.PORT ?? 8000);

  await app.listen(port);

  logger.log(`DeployHub backend running on port ${port}`);
}

void bootstrap();
