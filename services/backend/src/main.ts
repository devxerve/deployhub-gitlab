import "dotenv/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      // 1. Peticiones sin origin (curl, Postman, apps móviles)
      if (!origin) {
        return callback(null, true);
      }

      // 2. Permitir cualquier localhost / 127.0.0.1 / api.localhost en cualquier puerto
      const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1|api\.localhost)(:\d+)?$/.test(origin);

      if (isLocalhost) {
        // Devolvemos 'origin' como 2º parámetro (exactamente 2 argumentos)
        return callback(null, origin);
      }

      // En desarrollo, reflejamos el origen para permitir credentials con cualquier puerto
      return callback(null, origin);
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  });

  // Aseguramos que el puerto por defecto para el auth_service sea el 8000
  const PORT = process.env.PORT ?? 8000;
  await app.listen(PORT);
  console.log(`🚀 Auth Service corriendo en el puerto ${PORT}`);
}
bootstrap();
