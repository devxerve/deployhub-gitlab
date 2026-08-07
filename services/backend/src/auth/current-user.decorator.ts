import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import type { AuthenticatedUser, RequestWithUser } from "./auth.guard";

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user as AuthenticatedUser;
  },
);
