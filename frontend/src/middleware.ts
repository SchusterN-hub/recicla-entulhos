import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('recicla_auth')?.value === 'true';
  const isLoginPage = request.nextUrl.pathname === '/login';

  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuth && isLoginPage) {
    return NextResponse.redirect(new URL('/dumpsters', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
