'use server';

/**
 * @fileOverview This file implements the intelligent ad serving flow using Genkit.
 *
 * - intelligentAdServing - Determines whether to show an ad based on user activity and coin balance.
 * - IntelligentAdServingInput - The input type for the intelligentAdServing function.
 * - IntelligentAdServingOutput - The return type for the intelligentAdServing function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentAdServingInputSchema = z.object({
  userActivity: z
    .string()
    .describe(
      'Description of the recent user activity within the application.'
    ),
  coinBalance: z
    .number()
    .describe('The current coin balance of the user.'),
  adFrequency: z
    .string()
    .describe('The frequency at which ads are currently being shown.'),
});
export type IntelligentAdServingInput = z.infer<
  typeof IntelligentAdServingInputSchema
>;

const IntelligentAdServingOutputSchema = z.object({
  showAd: z
    .boolean()
    .describe(
      'A boolean value indicating whether an ad should be shown (true) or not (false).'
    ),
  reason: z
    .string()
    .describe(
      'The reason why the AI recommends showing or not showing an ad.'
    ),
});
export type IntelligentAdServingOutput = z.infer<
  typeof IntelligentAdServingOutputSchema
>;

export async function intelligentAdServing(
  input: IntelligentAdServingInput
): Promise<IntelligentAdServingOutput> {
  return intelligentAdServingFlow(input);
}

const intelligentAdServingPrompt = ai.definePrompt({
  name: 'intelligentAdServingPrompt',
  input: {schema: IntelligentAdServingInputSchema},
  output: {schema: IntelligentAdServingOutputSchema},
  prompt: `You are an expert in user engagement and monetization strategies for mobile applications. Based on the user's recent activity, coin balance, and current ad frequency, recommend whether or not to show an ad.

  User Activity: {{{userActivity}}}
  Coin Balance: {{{coinBalance}}}
  Ad Frequency: {{{adFrequency}}}

  Consider the following factors:
  - Avoid showing ads too frequently to prevent user frustration.
  - Show ads when the user has a low coin balance to encourage them to earn more.
  - Show ads after significant user activity or achievements.
  - Always include the reasoning for your decision in the "reason" field.

  Your output should be in JSON format, with the "showAd" field set to true or false, and the "reason" field explaining your decision.`,
});

const intelligentAdServingFlow = ai.defineFlow(
  {
    name: 'intelligentAdServingFlow',
    inputSchema: IntelligentAdServingInputSchema,
    outputSchema: IntelligentAdServingOutputSchema,
  },
  async input => {
    const {output} = await intelligentAdServingPrompt(input);
    return output!;
  }
);
