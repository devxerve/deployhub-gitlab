import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/callback?token=JWT
 *
 * Le auth-service (Express) redirige ici après un OAuth réussi.
 * On pose le cookie httpOnly depuis le même domaine HTTPS que le frontend,
 * ce qui évite les problèmes cross-scheme (HTTP→HTTPS) des navigateurs modernes.
 */
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
    maxAge: 24 * 60 * 60, // 1 jour (en secondes pour Next.js)
    path: '/',
  });

  return response;
}
