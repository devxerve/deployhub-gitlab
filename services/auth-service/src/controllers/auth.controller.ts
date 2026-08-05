import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({ message: 'Todos los campos son obligatorios' });
      return;
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });

    if (existingUser) {
      res.status(409).json({ message: 'El usuario o email ya están registrados' });
      return;
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const newUser = await prisma.users.create({
      data: {
        username,
        email,
        password_hash,
      }
    });

    res.status(201).json({
      message: 'Usuario registrado con éxito',
      user: {
        id: newUser.user_id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: 'Username y contraseña son obligatorios' });
      return;
    }

    const user = await prisma.users.findUnique({
      where: { username }
    });

    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    if (!user.password_hash) {
      res.status(401).json({ message: 'Este usuario fue registrado con un proveedor externo (Google / GitHub / 42)' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const payload = {
      user_id: user.user_id,
      username: user.username,
      role: user.role
    };

    const token = generateToken(payload);

    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 1 día
    });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: payload
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const validate = async (req: Request, res: Response): Promise<void> => {
  try {
    let token = req.cookies?.auth_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
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
      user: decoded
    });
  } catch (error) {
    console.error('Error en validate:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('auth_token');
  res.status(200).json({ message: 'Sesión cerrada con éxito' });
};
