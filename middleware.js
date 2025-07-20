import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req) {

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const protectedRoutes = ['/shorten', '/profile'];

  if (protectedRoutes.some(path => req.nextUrl.pathname.startsWith(path)) && !token) {
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/shorten', '/profile'],
};
