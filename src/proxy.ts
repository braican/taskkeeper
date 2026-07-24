import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Mirrors the SDK's own loose pb.authStore.isValid check (decode the JWT's
// exp claim, no signature verification) so this gate can't disagree with the
// client about whether a session is still current.
function isAuthCookieValid(cookieValue: string | undefined): boolean {
  if (!cookieValue) {
    return false;
  }

  try {
    const { token } = JSON.parse(cookieValue);
    const payload = token?.split('.')[1];
    if (!payload) {
      return false;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(base64));
    return typeof exp === 'number' && Date.now() / 1000 < exp;
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const pbAuth = request.cookies.get('pb_auth');
  const isAuthenticated = isAuthCookieValid(pbAuth?.value);

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // If user is authenticated and trying to access the home page
  if (isAuthenticated && pathname === '/') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && pathname !== '/') {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public|icons|manifest.webmanifest).*)',
  ],
};
