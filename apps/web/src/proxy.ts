import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

// Next.js 16: "middleware" is renamed to "proxy"
// next-intl's createMiddleware still works — just export as `proxy`
export const proxy = createMiddleware(routing);

export const config = {
  matcher: ['/', '/(zh|en)/:path*', '/((?!api|_next|favicon.ico|icons|.*\\..*).*)'],
};
