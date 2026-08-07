import jwt, { type JwtPayload, type SignOptions } from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no está definido');
}

export interface AuthTokenPayload {
  user_id: string | number;
  username: string;
  role: string | null;
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN ?? '1d') as SignOptions['expiresIn'];

const isAuthTokenPayload = (
  value: JwtPayload,
): value is JwtPayload & AuthTokenPayload => {
  return (
    (typeof value.user_id === 'string' || typeof value.user_id === 'number') &&
    typeof value.username === 'string' &&
    (value.role === null || typeof value.role === 'string')
  );
};

export const generateToken = (payload: AuthTokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token: string): AuthTokenPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === 'string' || !isAuthTokenPayload(decoded)) {
      return null;
    }

    return {
      user_id: decoded.user_id,
      username: decoded.username,
      role: decoded.role,
    };
  } catch {
    return null;
  }
};
