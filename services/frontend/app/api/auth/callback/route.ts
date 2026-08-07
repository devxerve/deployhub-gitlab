import { NextRequest, NextResponse } from 'next/server';


export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.redirect('https://localhost/login');
  }

  const response = NextResponse.redirect('https://localhost/dashboard');

  response.cookies.set('auth_token', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 24 * 60 * 60,
    path: '/',
  });

  return response;
}
