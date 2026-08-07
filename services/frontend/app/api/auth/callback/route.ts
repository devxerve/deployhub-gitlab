import { NextRequest, NextResponse } from 'next/server';

const APP_BASE_URL = process.env.APP_BASE_URL || 'https://localhost:8443';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect(`${APP_BASE_URL}/login`);
  }

  const response = NextResponse.redirect(`${APP_BASE_URL}/dashboard`);

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return response;
}
