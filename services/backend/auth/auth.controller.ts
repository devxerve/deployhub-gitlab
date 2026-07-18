import { Controller, Post, Body, Res, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() dto: any) {
    return this.authService.forwardRegister(dto);
  }

  @Post("login")
  async login(@Body() dto: any, @Res() res: Response) {
    const response = await this.authService.forwardLogin(dto);

    // Atrapamos la cookie generada por el Express satélite
    const cookieSatelite = response.headers['set-cookie'];

    if (cookieSatelite) {
      // Se la inyectamos directamente al navegador del usuario
      res.setHeader("Set-Cookie", cookieSatelite);
    }

    return res.status(HttpStatus.OK).json(response.data);
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    // Al usar cookies httpOnly, el logout limpia la cookie desde el gateway (NestJS)
    res.clearCookie('auth_token');
    return res.status(HttpStatus.OK).json({ ok: true, message: 'Sesión cerrada con éxito' });
  }
}
