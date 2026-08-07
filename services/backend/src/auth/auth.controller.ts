import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import type {
  AuthPayload,
  LoginRequest,
  RegisterRequest,
} from "./types/auth.types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: RegisterRequest): Promise<AuthPayload> {
    return this.authService.forwardRegister(dto);
  }

  @Post("login")
  async login(
    @Body() dto: LoginRequest,
    @Res() res: Response,
  ): Promise<Response> {
    const response = await this.authService.forwardLogin(dto);

    const cookieSatellite = response.headers["set-cookie"];

    if (cookieSatellite) {
      res.setHeader("Set-Cookie", cookieSatellite);
    }

    return res.status(HttpStatus.OK).json(response.data);
  }

  @Post("logout")
  logout(@Res() res: Response): Response {
    // The session cookie may have been set host-only (password login,
    // set by this API's own origin) or scoped to the whole `.localhost`
    // site (OAuth login, set by the frontend's callback route) — clearing
    // must match the exact domain/path it was set with or the browser
    // silently ignores it.
    res.clearCookie("auth_token", { path: "/" });
    res.clearCookie("auth_token", { path: "/", domain: ".localhost" });

    return res.status(HttpStatus.OK).json({
      ok: true,
      message: "Sesión cerrada con éxito",
    });
  }

  @Get("validate")
  async validate(@Req() req: Request, @Res() res: Response): Promise<Response> {
    const cookies = req.cookies as Record<string, unknown> | undefined;

    const cookieToken = cookies?.["auth_token"];

    let token = typeof cookieToken === "string" ? cookieToken : undefined;

    const authorization = req.headers.authorization;

    if (!token && authorization?.startsWith("Bearer ")) {
      token = authorization.slice(7);
    }

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        ok: false,
        message: "No autenticado",
      });
    }

    const result = await this.authService.validateToken(token);

    return res.status(HttpStatus.OK).json(result);
  }
}
