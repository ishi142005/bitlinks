import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { initIndexes } from '@/lib/initIndexes'; 

export async function middleware(req) {
  await initIndexes();

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
