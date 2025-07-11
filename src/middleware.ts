import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { analyzeUserAgent } from '@/ai/flows/analyze-user-agent';

export async function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || 'Unknown';

  try {
    const { isBot } = await analyzeUserAgent({ userAgent });

    if (isBot) {
      const url = request.nextUrl.clone();
      url.pathname = '/blocked';
      return NextResponse.rewrite(url);
    }
  } catch (error) {
    console.error('Cloaking Middleware Error:', error);
    // Fail open: If the AI analysis fails, allow the request through
    // to prevent blocking legitimate users.
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware only to the cloaked routes path.
  matcher: '/routes/:path*',
};
