import { Request, Response } from 'express';
import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../utils/jwt';

const prisma = new PrismaClient();

// ============================================================
//  HELPERS
// ============================================================

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} no está definido`);
  }
  return value;
}

const BASE_URL = requireEnv('APP_BASE_URL');

async function upsertOAuthUser(
  provider: string,
  provider_id: string,
  email: string,
  username: string
) {
  let user = await prisma.users.findFirst({
    where: { provider, provider_id },
  });

  if (!user) {
    user = await prisma.users.findUnique({ where: { email } });

    if (user) {
      user = await prisma.users.update({
        where: { user_id: user.user_id },
        data: { provider, provider_id },
      });
    } else {
      let finalUsername = username;
      let counter = 0;
      while (await prisma.users.findFirst({ where: { username: finalUsername } })) {
        counter++;
        finalUsername = `${username}_${counter}`;
      }

      try {
        user = await prisma.users.create({
          data: {
            username: finalUsername,
            email,
            provider,
            provider_id,
          },
        });
      } catch (e: any) {
        if (e.code === 'P2002') {
          counter++;
          user = await prisma.users.create({
            data: {
              username: `${username}_${counter}`,
              email,
              provider,
              provider_id,
            },
          });
        } else {
          throw e;
        }
      }
    }
  }

  return user;
}

function issueTokenAndRedirect(res: Response, user: any) {
  const payload = {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(payload);

  res.cookie('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  });

  res.redirect(`${BASE_URL}/dashboard`);
}

// ============================================================
//  GOOGLE
// ============================================================

const GOOGLE_CLIENT_ID     = requireEnv('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = requireEnv('GOOGLE_CLIENT_SECRET');
const GOOGLE_REDIRECT_URI  = requireEnv('GOOGLE_REDIRECT_URI');

export const googleRedirect = (_req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id:     GOOGLE_CLIENT_ID,
    redirect_uri:  GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope:         'openid email profile',
    access_type:   'offline',
    prompt:        'consent',
  });

  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ message: 'Código de autorización no recibido' });
    return;
  }

  try {
    const tokenRes = await axios.post(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id:     GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri:  GOOGLE_REDIRECT_URI,
        grant_type:    'authorization_code',
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const { sub, email, name } = profileRes.data;
    const user = await upsertOAuthUser('google', sub, email, name.replace(/\s+/g, '_').toLowerCase());

    issueTokenAndRedirect(res, user);
  } catch (error) {
    console.error('Error en Google OAuth callback:', error);
    res.status(500).json({ message: 'Error en autenticación con Google' });
  }
};

// ============================================================
//  GITHUB
// ============================================================

const GITHUB_CLIENT_ID     = requireEnv('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
const GITHUB_REDIRECT_URI  = requireEnv('GITHUB_REDIRECT_URI');

export const githubRedirect = (_req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id:    GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope:        'user:email read:user',
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
};


export const githubCallback = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ message: 'Código de autorización no recibido' });
    return;
  }

  try {
    const tokenRes = await axios.post(
      'https://github.com/login/oauth/access_token',
      { code, client_id: GITHUB_CLIENT_ID, client_secret: GITHUB_CLIENT_SECRET, redirect_uri: GITHUB_REDIRECT_URI },
      { headers: { Accept: 'application/json' } }
    );

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'transcendence-app' },
    });

    let { id, login, email } = profileRes.data;

    if (!email) {
      const emailsRes = await axios.get('https://api.github.com/user/emails', {
        headers: { Authorization: `Bearer ${access_token}`, 'User-Agent': 'transcendence-app' },
      });
      const primary = emailsRes.data.find((e: any) => e.primary && e.verified);
      email = primary?.email || `${login}@github.noemail`;
    }

    const user = await upsertOAuthUser('github', String(id), email, login);

    issueTokenAndRedirect(res, user);
  } catch (error) {
    console.error('Error en GitHub OAuth callback:', error);
    res.status(500).json({ message: 'Error en autenticación con GitHub' });
  }
};

// ============================================================
//  42 (Intra)
// ============================================================

const INTRA_CLIENT_ID     = requireEnv('INTRA_CLIENT_ID');
const INTRA_CLIENT_SECRET = requireEnv('INTRA_CLIENT_SECRET');
const INTRA_REDIRECT_URI  = requireEnv('INTRA_REDIRECT_URI');

export const intraRedirect = (_req: Request, res: Response): void => {
  const params = new URLSearchParams({
    client_id:     INTRA_CLIENT_ID,
    redirect_uri:  INTRA_REDIRECT_URI,
    response_type: 'code',
    scope:         'public',
  });

  res.redirect(`https://api.intra.42.fr/oauth/authorize?${params}`);
};

export const intraCallback = async (req: Request, res: Response): Promise<void> => {
  const { code } = req.query;

  if (!code || typeof code !== 'string') {
    res.status(400).json({ message: 'Código de autorización no recibido' });
    return;
  }

  try {
    const tokenRes = await axios.post(
      'https://api.intra.42.fr/oauth/token',
      new URLSearchParams({
        grant_type:    'authorization_code',
        client_id:     INTRA_CLIENT_ID,
        client_secret: INTRA_CLIENT_SECRET,
        code,
        redirect_uri:  INTRA_REDIRECT_URI,
      }),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const { id, login, email } = profileRes.data;

    const user = await upsertOAuthUser('42', String(id), email, login);

    issueTokenAndRedirect(res, user);
  } catch (error) {
    console.error('Error en 42 OAuth callback:', error);
    res.status(500).json({ message: 'Error en autenticación con 42 Intra' });
  }
};
