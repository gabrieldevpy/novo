
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeUserAgent } from '@/ai/flows/analyze-user-agent';
import { getRouteBySlug } from '@/app/dashboard/routes/actions';
import { logAccess } from '@/app/dashboard/actions';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const ip = request.ip || 'Unknown';
  const slug = request.nextUrl.pathname.replace('/r/', '');

  // Ignore requests for static assets, internal Next.js paths, or the dashboard itself
  if (
    request.nextUrl.pathname.includes('.') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/blocked')
  ) {
    return NextResponse.next();
  }

  // Only proceed if there is a slug
  if (!slug) {
    return NextResponse.next();
  }

  try {
    const routeConfig = await getRouteBySlug(slug);

    if (!routeConfig || !routeConfig.active) {
      // If no active route is found, proceed to the normal page (likely a 404)
      return NextResponse.next();
    }

    const { isBot, botType } = await analyzeUserAgent({ userAgent });
    
    // Log the access attempt
    await logAccess({
      ip,
      userAgent,
      route: slug,
      type: isBot ? 'bot' : 'human',
      botType: botType,
    });


    if (isBot) {
      // Bot detected, redirect to the blocked page, which then redirects to the safe URL.
      const blockedUrl = new URL('/blocked', request.url);
      // Optional: pass redirect target to blocked page if needed later
      // blockedUrl.searchParams.set('redirect_to', routeConfig.redirectBotTo);
      return NextResponse.rewrite(blockedUrl);
    }

    // Human detected, rewrite to show the real content page.
    // This keeps the cloaked URL in the address bar.
    const realUrl = new URL(`/routes/${slug}`, request.url);
    realUrl.search = request.nextUrl.search;
    return NextResponse.rewrite(realUrl);

  } catch (error) {
    console.error('Cloaking Middleware Error:', error);
    // Fail open: If any error occurs, allow the request through to a safe default,
    // like the homepage, to prevent blocking legitimate users.
    const fallbackUrl = request.nextUrl.clone();
    fallbackUrl.pathname = '/';
    return NextResponse.redirect(fallbackUrl);
  }
}

export const config = {
  // Match all paths except for API routes, static files, and image optimization.
   matcher: [
    '/r/:slug*',
    // This is an alternative if you want to match all paths
    // '/((?!api|_next/static|_next/image|favicon.ico|dashboard|blocked).*)',
  ],
};
