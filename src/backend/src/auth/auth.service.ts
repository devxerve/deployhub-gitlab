import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string = process.env.AUTH_SERVICE_URL || 'http://auth_service:3001';

  constructor(private readonly httpService: HttpService) {}

  async forwardRegister(dto: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/register`, dto)
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async forwardLogin(dto: any) {
    try {
      // Retornamos la respuesta completa para poder capturar los headers (cookies) en el controlador
      return await firstValueFrom(
        this.httpService.post(`${this.authServiceUrl}/auth/login`, dto)
      );
    } catch (error) {
      this.handleError(error);
    }
  }

  async validateToken(token: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${this.authServiceUrl}/auth/validate`,
          {}, // body vacío
          { headers: { Authorization: `Bearer ${token}` } }
        )
      );
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

private handleError(error: any) {
  // 1. Forzamos a que el valor sea un número o usamos el fallback por defecto
  const status = typeof error.response?.status === 'number'
    ? error.response.status
    : HttpStatus.INTERNAL_SERVER_ERROR;

  // 2. Extraemos el mensaje asegurando que sea un string
  const message = error.response?.data?.message || 'Error en el servicio satélite de Auth';

  // Ahora 'status' es estrictamente un 'number', limpito para NestJS
  throw new HttpException(message, status);
}
}
