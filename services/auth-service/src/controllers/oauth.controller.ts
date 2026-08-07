import { type Request, type Response } from 'express';
import axios from 'axios';
import {
  Prisma,
  PrismaClient,
  type users,
} from '@prisma/client';
import {
  generateToken,
  type AuthTokenPayload,
} from '../utils/jwt';

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
}

interface GitHubTokenResponse {
  access_token: string;
}

interface GitHubProfile {
  id: number;
  login: string;
  email: string | null;
}

interface GitHubEmail {
  email: string;
  primary: boolean;
  verified: boolean;
}

interface IntraTokenResponse {
  access_token: string;
}

interface IntraProfile {
  id: number;
  login: string;
  email: string;
}

const prisma = new PrismaClient();

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
  providerId: string,
  email: string,
  username: string,
): Promise<users> {
  let user = await prisma.users.findFirst({
    where: {
      provider,
      provider_id: providerId,
    },
  });

  if (user) {
    return user;
  }

  user = await prisma.users.findUnique({
    where: { email },
  });

  if (user) {
    return prisma.users.update({
      where: {
        user_id: user.user_id,
      },
      data: {
        provider,
        provider_id: providerId,
      },
    });
  }

  let finalUsername = username;
  let counter = 0;

  while (
    await prisma.users.findFirst({
      where: {
        username: finalUsername,
      },
    })
  ) {
    counter += 1;
    finalUsername = `${username}_${counter}`;
  }

  try {
    return await prisma.users.create({
      data: {
        username: finalUsername,
        email,
        provider,
        provider_id: providerId,
      },
    });
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      counter += 1;

      return prisma.users.create({
        data: {
          username: `${username}_${counter}`,
          email,
          provider,
          provider_id: providerId,
        },
      });
    }

    throw error;
  }
}

function issueTokenAndRedirect(
  res: Response,
  user: users,
): void {
  const payload: AuthTokenPayload = {
    user_id: user.user_id,
    username: user.username,
    role: user.role,
  };

  const token = generateToken(payload);

  res.redirect(
    `${BASE_URL}/api/auth/callback?token=${encodeURIComponent(token)}`,
  );
}

const GOOGLE_CLIENT_ID = requireEnv('GOOGLE_CLIENT_ID');
const GOOGLE_CLIENT_SECRET = requireEnv('GOOGLE_CLIENT_SECRET');
const GOOGLE_REDIRECT_URI = requireEnv('GOOGLE_REDIRECT_URI');

export const googleRedirect = (
  _req: Request,
  res: Response,
): void => {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
  );
};

export const googleCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code } = req.query;

  if (typeof code !== 'string' || !code) {
    res.status(400).json({
      message: 'Código de autorización no recibido',
    });
    return;
  }

  try {
    const tokenRes = await axios.post<GoogleTokenResponse>(
      'https://oauth2.googleapis.com/token',
      new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token: accessToken } = tokenRes.data;

    const profileRes = await axios.get<GoogleProfile>(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { sub, email, name } = profileRes.data;

    const username = name
      .replace(/\s+/g, '_')
      .toLowerCase();

    const user = await upsertOAuthUser(
      'google',
      sub,
      email,
      username,
    );

    issueTokenAndRedirect(res, user);
  } catch {
    res.status(500).json({
      message: 'Error en autenticación con Google',
    });
  }
};

const GITHUB_CLIENT_ID = requireEnv('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = requireEnv('GITHUB_CLIENT_SECRET');
const GITHUB_REDIRECT_URI = requireEnv('GITHUB_REDIRECT_URI');

export const githubRedirect = (
  _req: Request,
  res: Response,
): void => {
  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_REDIRECT_URI,
    scope: 'user:email read:user',
  });

  res.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`,
  );
};

export const githubCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code } = req.query;

  if (typeof code !== 'string' || !code) {
    res.status(400).json({
      message: 'Código de autorización no recibido',
    });
    return;
  }

  try {
    const tokenRes = await axios.post<GitHubTokenResponse>(
      'https://github.com/login/oauth/access_token',
      {
        code,
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        redirect_uri: GITHUB_REDIRECT_URI,
      },
      {
        headers: {
          Accept: 'application/json',
        },
      },
    );

    const { access_token: accessToken } = tokenRes.data;

    const profileRes = await axios.get<GitHubProfile>(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'User-Agent': 'transcendence-app',
        },
      },
    );

    const {
      id,
      login,
      email: profileEmail,
    } = profileRes.data;

    let email = profileEmail;

    if (!email) {
      const emailsRes = await axios.get<GitHubEmail[]>(
        'https://api.github.com/user/emails',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'User-Agent': 'transcendence-app',
          },
        },
      );

      const primary = emailsRes.data.find(
        (candidate) =>
          candidate.primary && candidate.verified,
      );

      email = primary?.email ?? `${login}@github.noemail`;
    }

    const user = await upsertOAuthUser(
      'github',
      String(id),
      email,
      login,
    );

    issueTokenAndRedirect(res, user);
  } catch {
    res.status(500).json({
      message: 'Error en autenticación con GitHub',
    });
  }
};

const INTRA_CLIENT_ID = requireEnv('INTRA_CLIENT_ID');
const INTRA_CLIENT_SECRET = requireEnv('INTRA_CLIENT_SECRET');
const INTRA_REDIRECT_URI = requireEnv('INTRA_REDIRECT_URI');

export const intraRedirect = (
  _req: Request,
  res: Response,
): void => {
  const params = new URLSearchParams({
    client_id: INTRA_CLIENT_ID,
    redirect_uri: INTRA_REDIRECT_URI,
    response_type: 'code',
    scope: 'public',
  });

  res.redirect(
    `https://api.intra.42.fr/oauth/authorize?${params.toString()}`,
  );
};

export const intraCallback = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { code } = req.query;

  if (typeof code !== 'string' || !code) {
    res.status(400).json({
      message: 'Código de autorización no recibido',
    });
    return;
  }

  try {
    const tokenRes = await axios.post<IntraTokenResponse>(
      'https://api.intra.42.fr/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: INTRA_CLIENT_ID,
        client_secret: INTRA_CLIENT_SECRET,
        code,
        redirect_uri: INTRA_REDIRECT_URI,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    const { access_token: accessToken } = tokenRes.data;

    const profileRes = await axios.get<IntraProfile>(
      'https://api.intra.42.fr/v2/me',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const { id, login, email } = profileRes.data;

    const user = await upsertOAuthUser(
      '42',
      String(id),
      email,
      login,
    );

    issueTokenAndRedirect(res, user);
  } catch {
    res.status(500).json({
      message: 'Error en autenticación con 42 Intra',
    });
  }
};
