import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simplified RBAC Middleware for Demonstration & Production-Grade gatekeeping
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Fetch Session Cookie (Supplied by Supabase Auth on login)
  const sessionToken = request.cookies.get('sb-access-token')?.value;
  const userRole = request.cookies.get('logishub-user-role')?.value; // Custom role cookie

  // 2. Gatekeeper Rules
  if (!sessionToken && !pathname.startsWith('/login') && pathname !== '/') {
    // Redirect to login if unauthenticated
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (sessionToken && userRole) {
    // Redirect DAs (Couriers) away from main B2B desktop console to mobile companion app
    if (userRole === 'da_courier' && (pathname.startsWith('/dashboard') || pathname.startsWith('/shipments'))) {
      return NextResponse.redirect(new URL('/da', request.url));
    }

    // Redirect Ops Agents or Managers away from Mobile Courier specific screens
    if (userRole !== 'da_courier' && pathname.startsWith('/da')) {
      return NextResponse.redirect(new URL('/dashboard/ops', request.url));
    }
  }

  return NextResponse.next();
}

// MATCH OPTIMIZATION RULES
export const config = {
  matcher: ['/dashboard/:path*', '/shipments/:path*', '/da/:path*'],
};
