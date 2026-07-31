"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.login = exports.register = void 0;
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const register = async (req, res) => {
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
        const password_hash = await bcrypt_1.default.hash(password, saltRounds);
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
    }
    catch (error) {
        console.error('Error en register:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.register = register;
const login = async (req, res) => {
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
        const isMatch = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isMatch) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const payload = {
            user_id: user.user_id,
            username: user.username,
            role: user.role
        };
        const token = (0, jwt_1.generateToken)(payload);
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            user: payload
        });
    }
    catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.login = login;
const validate = async (req, res) => {
    try {
        let token = req.cookies?.auth_token;
        if (!token && req.headers.authorization?.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            res.status(401).json({ message: 'No hay token proporcionado' });
            return;
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        if (!decoded) {
            res.status(401).json({ message: 'Token inválido o expirado' });
            return;
        }
        res.status(200).json({
            message: 'Token válido',
            user: decoded
        });
    }
    catch (error) {
        console.error('Error en validate:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
exports.validate = validate;
