import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();

  if (url.pathname.startsWith('/admin')) {
    const token = request.cookies.get('token')?.value;
    const isCore = request.cookies.get('isCore')?.value;

    if (!token || isCore !== 'true') {
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
    matcher: ['/admin', '/admin/:path*'],
  };