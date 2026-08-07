import { type Request, type Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  generateToken,
  verifyToken,
  type AuthTokenPayload,
} from '../utils/jwt';

interface RegisterBody {
  username?: unknown;
  email?: unknown;
  password?: unknown;
}

interface LoginBody {
  username?: unknown;
  password?: unknown;
}

type RegisterRequest = Request<Record<string, never>, unknown, RegisterBody>;
type LoginRequest = Request<Record<string, never>, unknown, LoginBody>;

const prisma = new PrismaClient();

export const register = async (
  req: RegisterRequest,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      res.status(409).json({
        message: 'El usuario o email ya están registrados',
      });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
      },
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (
  req: LoginRequest,
  res: Response,
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== 'string' ||
      typeof password !== 'string' ||
      !username.trim() ||
      !password
    ) {
      res.status(400).json({
        message: 'Username y contraseña son obligatorios',
      });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { username },
    });

    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    if (!user.password_hash) {
      res.status(401).json({
        message:
          'Este usuario fue registrado con un proveedor externo (Google / GitHub / 42)',
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const payload: AuthTokenPayload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role,
    };

    const token = generateToken(payload);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: payload,
    });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const validate = (req: Request, res: Response): void => {
  try {
    const cookies: unknown = req.cookies;
    let token: string | undefined;

    if (
      typeof cookies === 'object' &&
      cookies !== null &&
      'auth_token' in cookies
    ) {
      const cookieToken = (cookies as Record<string, unknown>).auth_token;

      if (typeof cookieToken === 'string') {
        token = cookieToken;
      }
    }

    const authorization = req.headers.authorization;

    if (!token && authorization?.startsWith('Bearer ')) {
      token = authorization.slice(7);
    }

    if (!token) {
      res.status(401).json({ message: 'No hay token proporcionado' });
      return;
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return;
    }

    res.status(200).json({
      message: 'Token válido',
      user: decoded,
    });
  } catch {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Sesión cerrada con éxito' });
};
