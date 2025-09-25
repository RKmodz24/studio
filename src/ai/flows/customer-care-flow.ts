'use server';

/**
 * @fileOverview A customer care AI agent for the Diamond Digger app.
 *
 * - customerCare - A function that handles user queries about the app.
 * - CustomerCareInput - The input type for the customerCare function.
 * - CustomerCareOutput - The return type for the customerCare function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CustomerCareInputSchema = z.object({
  query: z.string().describe('The user\'s question about the Diamond Digger app.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).describe('The conversation history.'),
});
export type CustomerCareInput = z.infer<typeof CustomerCareInputSchema>;

const CustomerCareOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type CustomerCareOutput = z.infer<typeof CustomerCareOutputSchema>;


export async function customerCare(
  input: CustomerCareInput
): Promise<CustomerCareOutput> {
  return customerCareFlow(input);
}

const customerCarePrompt = ai.definePrompt({
  name: 'customerCarePrompt',
  input: {schema: CustomerCareInputSchema},
  output: {schema: CustomerCareOutputSchema},
  prompt: `You are an AI customer care agent for an app called "Diamond Digger". Your goal is to help users with their questions about the app.

  App Information:
  - Users complete tasks to earn diamonds.
  - Diamonds can be converted to INR (Indian Rupees). 100 diamonds = 1 INR.
  - Users can cash out their INR balance once they reach the minimum payout amount of ₹100.
  - Payouts can be done via Bank Transfer or UPI.
  - Users can earn more by watching ads, playing an ad game, and referring friends.
  - Referring a friend gives the user 20% of the referred user's earnings.

  Conversation History:
  {{#each history}}
  {{#if (eq role 'user')}}User: {{content}}{{/if}}
  {{#if (eq role 'model')}}AI: {{content}}{{/if}}
  {{/each}}

  User Query: {{{query}}}

  Based on the information and the conversation history, provide a clear and helpful response to the user's query. Keep your answers concise and easy to understand.
  `,
});

const customerCareFlow = ai.defineFlow(
  {
    name: 'customerCareFlow',
    inputSchema: CustomerCareInputSchema,
    outputSchema: CustomerCareOutputSchema,
  },
  async input => {
    const {output} = await customerCarePrompt(input);
    return output!;
  }
);
