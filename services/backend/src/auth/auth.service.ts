import { HttpService } from "@nestjs/axios";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AxiosResponse, isAxiosError } from "axios";
import { firstValueFrom } from "rxjs";

import { AuthPayload, LoginRequest, RegisterRequest } from "./types/auth.types";

@Injectable()
export class AuthService {
  private readonly authServiceUrl: string;

  constructor(private readonly httpService: HttpService) {
    const url = process.env.AUTH_SERVICE_URL;

    if (!url) {
      throw new Error("AUTH_SERVICE_URL no está definido");
    }

    this.authServiceUrl = url;
  }

  async forwardRegister(dto: RegisterRequest): Promise<AuthPayload> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthPayload>(
          `${this.authServiceUrl}/auth/register`,
          dto,
        ),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async forwardLogin(dto: LoginRequest): Promise<AxiosResponse<AuthPayload>> {
    try {
      return await firstValueFrom(
        this.httpService.post<AuthPayload>(
          `${this.authServiceUrl}/auth/login`,
          dto,
        ),
      );
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  async validateToken(token: string): Promise<AuthPayload> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<AuthPayload>(
          `${this.authServiceUrl}/auth/validate`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        ),
      );

      return response.data;
    } catch (error: unknown) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown): never {
    if (isAxiosError<AuthPayload>(error)) {
      const status =
        typeof error.response?.status === "number"
          ? error.response.status
          : HttpStatus.INTERNAL_SERVER_ERROR;

      const responseData = error.response?.data;

      const responseMessage =
        responseData && typeof responseData["message"] === "string"
          ? responseData["message"]
          : null;

      throw new HttpException(
        responseMessage ?? "Error en el servicio satélite de Auth",
        status,
      );
    }

    throw new HttpException(
      "Error en el servicio satélite de Auth",
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
