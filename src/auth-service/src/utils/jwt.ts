import jwt from 'jsonwebtoken';

// En producción deberíamos usar process.env.JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_123';
const JWT_EXPIRES_IN: any = process.env.JWT_EXPIRES_IN || '1d';

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};
