// This is an AI-powered cloaking application, so this entire file must be 'use server'
'use server';

/**
 * @fileOverview Analyzes the user agent string to classify users as bots or humans.
 *
 * - analyzeUserAgent - A function that analyzes the user agent string.
 * - AnalyzeUserAgentInput - The input type for the analyzeUserAgent function.
 * - AnalyzeUserAgentOutput - The return type for the analyzeUserAgent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeUserAgentInputSchema = z.object({
  userAgent: z.string().describe('The user agent string to analyze.'),
});
export type AnalyzeUserAgentInput = z.infer<typeof AnalyzeUserAgentInputSchema>;

const AnalyzeUserAgentOutputSchema = z.object({
  isBot: z.boolean().describe('Whether the user agent is likely a bot.'),
  botType: z.string().optional().describe('The type of bot, if identified.'),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe('Confidence level of the bot classification (0-1).'),
  reason: z.string().describe('The reasoning behind the bot classification.'),
});
export type AnalyzeUserAgentOutput = z.infer<typeof AnalyzeUserAgentOutputSchema>;

export async function analyzeUserAgent(input: AnalyzeUserAgentInput): Promise<AnalyzeUserAgentOutput> {
  return analyzeUserAgentFlow(input);
}

const analyzeUserAgentPrompt = ai.definePrompt({
  name: 'analyzeUserAgentPrompt',
  input: {schema: AnalyzeUserAgentInputSchema},
  output: {schema: AnalyzeUserAgentOutputSchema},
  prompt: `You are an expert in identifying bots based on their user agent strings.

  Analyze the following user agent string and determine if it is likely a bot.
  Provide a confidence level (0-1) for your classification.
  If it is a bot, identify the type of bot if possible.
  Explain your reasoning for the classification.

  User Agent: {{{userAgent}}}`,
});

const analyzeUserAgentFlow = ai.defineFlow(
  {
    name: 'analyzeUserAgentFlow',
    inputSchema: AnalyzeUserAgentInputSchema,
    outputSchema: AnalyzeUserAgentOutputSchema,
  },
  async input => {
    const {output} = await analyzeUserAgentPrompt(input);
    return output!;
  }
);
