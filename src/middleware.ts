import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Routes yang perlu dilindungi
  const protectedRoutes = ['/', '/admin'];
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );
  
  // Skip middleware untuk route login dan assets
  if (pathname.startsWith('/login') || 
      pathname.startsWith('/admin/login') ||
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }
  
  if (isProtectedRoute) {
    // Check for auth token in cookies or headers
    const token = request.cookies.get('crs_auth_token')?.value ||
                  request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      // Redirect ke login jika tidak ada token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};