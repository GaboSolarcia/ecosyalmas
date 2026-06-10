export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/admin/:path*',
    // Required for Azure Static Web Apps — excludes SWA internal routes
    '/((?!\\.swa).*)',
  ],
}
