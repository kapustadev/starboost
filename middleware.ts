import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Lightweight middleware - no Prisma/Node.js imports (Edge Runtime compatible)
export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  const response = NextResponse.next()

  // Capture referral code if present
  const ref = searchParams.get('ref')
  if (ref) {
    // Set cookie for 30 days
    response.cookies.set('starsboost_ref', ref, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    })
  }

  // Protect dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Check for NextAuth session cookie
    const sessionToken =
      request.cookies.get('next-auth.session-token')?.value ||
      request.cookies.get('__Secure-next-auth.session-token')?.value

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|logos|public).*)',
  ],
}
