import NextAuth from 'next-auth'
import { authConfig } from './src/lib/auth.config'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default NextAuth(authConfig as any).auth

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
