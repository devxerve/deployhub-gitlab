import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true });

  // Clear both cookie shapes this app has set historically on the
  // frontend's own origin: host-only on `localhost` (current scheme) and
  // shared across `.localhost` (leftover from before API calls moved
  // same-origin). The backend's /auth/logout clears the api.localhost side.
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 0,
    path: '/',
    domain: '.localhost',
  });

  return response;
}
