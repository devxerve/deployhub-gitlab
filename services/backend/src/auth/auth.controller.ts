import { Controller, Post, Get, Body, Req, Res, HttpStatus } from "@nestjs/common";
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
  async login(@Body() dto: any, @Res() res: any) {
    const response = await this.authService.forwardLogin(dto);

    // Atrapamos la cookie generada por el Express satélite
    const cookieSatelite = response?.headers?.['set-cookie'];

    if (cookieSatelite) {
      // Se la inyectamos directamente al navegador del usuario
      res.setHeader("Set-Cookie", cookieSatelite);
    }

    return res.status(HttpStatus.OK).json(response?.data);
  }

  @Post("logout")
  async logout(@Res() res: any) {
    // Al usar cookies httpOnly, el logout limpia la cookie desde el gateway (NestJS)
    res.clearCookie('auth_token');
    return res.status(HttpStatus.OK).json({ ok: true, message: 'Sesión cerrada con éxito' });
  }

  @Get("validate")
  async validate(@Req() req: any, @Res() res: any) {
    // Extraemos la cookie del navegador o el header Bearer y lo reenviamos al auth-service
    let token = req.cookies?.auth_token;
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(HttpStatus.UNAUTHORIZED).json({ ok: false, message: 'No autenticado' });
    }
    const result = await this.authService.validateToken(token);
    return res.status(HttpStatus.OK).json(result);
  }
}
