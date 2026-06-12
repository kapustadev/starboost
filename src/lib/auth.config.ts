export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }: { auth: { user?: unknown } | null, request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user
      const isDashboard = nextUrl.pathname.startsWith('/dashboard')
      if (isDashboard) {
        if (isLoggedIn) return true
        return false
      }
      return true
    },
  },
  providers: [] as [],
}
