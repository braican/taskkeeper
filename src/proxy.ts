import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const pbAuth = request.cookies.get('pb_auth');
  const isAuthenticated = !!pbAuth?.value;

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
