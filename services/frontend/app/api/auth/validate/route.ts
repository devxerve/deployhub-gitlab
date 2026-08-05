import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/validate
 *
 * Proxy côté serveur : lit le cookie auth_token (posé en HTTPS, même origin)
 * et valide le JWT auprès du auth-service via le réseau Docker interne.
 * Le navigateur n'a jamais besoin de contacter le auth-service directement.
 */
export async function GET(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ message: 'No autenticado' }, { status: 401 });
  }

  try {
    // AUTH_SERVICE_URL côté serveur = http://auth_service:3001 (Docker internal)
    const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://auth_service:3001';

    const res = await fetch(`${authServiceUrl}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: 'Error validando sesión' }, { status: 500 });
  }
}
