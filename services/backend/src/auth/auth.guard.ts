import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { Request } from "express";
import { AuthService } from "./auth.service";

export interface AuthenticatedUser {
  user_id: string;
  username: string;
  role: string | null;
}

export interface RequestWithUser extends Request {
  user?: AuthenticatedUser;
}

function isAuthenticatedUser(value: unknown): value is AuthenticatedUser {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { user_id?: unknown }).user_id === "string"
  );
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();

    const cookies = req.cookies as Record<string, unknown> | undefined;
    const cookieToken = cookies?.["auth_token"];

    let token = typeof cookieToken === "string" ? cookieToken : undefined;

    const authorization = req.headers.authorization;
    if (!token && authorization?.startsWith("Bearer ")) {
      token = authorization.slice(7);
    }

    if (!token) {
      throw new UnauthorizedException("No autenticado");
    }

    const result = await this.authService.validateToken(token);
    const user = (result as { user?: unknown } | undefined)?.user;

    if (!isAuthenticatedUser(user)) {
      throw new UnauthorizedException("Token inválido");
    }

    req.user = user;
    return true;
  }
}
