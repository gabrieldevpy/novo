'use server';

import { analyzeUserAgent } from '@/ai/flows/analyze-user-agent';
import { headers } from 'next/headers';

export interface CheckResult {
  isBot: boolean;
  botType?: string;
  confidence: number;
  reason: string;
  userAgent: string;
}

export async function checkMyStatus(): Promise<CheckResult> {
  const userAgent = headers().get('user-agent') || 'Unknown';

  try {
    const result = await analyzeUserAgent({ userAgent });
    return { ...result, userAgent };
  } catch (error) {
    console.error("Error analyzing user agent:", error);
    // Return a default "human" response on error to avoid blocking legitimate users.
    return {
      isBot: false,
      confidence: 0,
      reason: 'Could not perform analysis due to an internal error. This is a failsafe to prevent blocking legitimate users.',
      userAgent: userAgent,
    };
  }
}
