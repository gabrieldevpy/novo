
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeUserAgent } from '@/ai/flows/analyze-user-agent';
import { getRouteBySlug } from '@/app/dashboard/routes/actions';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const slug = request.nextUrl.pathname.split('/').pop() || '';

  // Ignore requests for static assets or internal Next.js paths
  if (slug.includes('.') || slug.startsWith('_next')) {
      return NextResponse.next();
  }

  try {
    const routeConfig = await getRouteBySlug(slug);

    // If no route is configured for this slug, show the default page or 404
    if (!routeConfig) {
      // You could redirect to a 404 page here if you prefer
      return NextResponse.next();
    }
    
    // For now, we will use the AI to detect bots.
    // In a real scenario, you would also check against the denyUserAgents and denyIps lists from routeConfig.
    const { isBot } = await analyzeUserAgent({ userAgent });

    if (isBot) {
        // Bot detected, redirect to the "safe" page or block page
        const botUrl = new URL(routeConfig.redirectBotTo);
        return NextResponse.redirect(botUrl);
    }

    // Human detected, redirect to the real URL
    const realUrl = new URL(routeConfig.realUrl);
    // You can pass through query params if needed
    realUrl.search = request.nextUrl.search;
    return NextResponse.redirect(realUrl);

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
  // Apply middleware only to the cloaked routes path.
  // This will match /routes/some-slug, /routes/another-product, etc.
  matcher: '/routes/:slug*',
};

    