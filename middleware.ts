import { verifyAccessTokenEdge } from '@/lib/jwt-edge'; // NEW
import { extractTokenFromHeader } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const protectedRoutes = ['/api/auth/me'];
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some(route =>
    pathname.startsWith(route)
  );
  if (!isProtectedRoute) return NextResponse.next();

  const authHeader = request.headers.get('authorization');
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: 'Access denied',
      error: 'No token provided',
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const decoded = await verifyAccessTokenEdge(token); // ✅ now works in Edge!

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-user-id', decoded.userId);
    requestHeaders.set('x-user-email', decoded.email);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

  } catch (error) {
    return new NextResponse(JSON.stringify({
      success: false,
      message: 'Access denied',
      error: 'Invalid or expired token',
    }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export const config = {
  matcher: ['/api/auth/me'],
};
