'use server';
/**
 * @fileOverview A Genkit flow for generating creative, theme-based encryption schemes.
 *
 * - generateThemeBasedEncryptionScheme - A function that generates encryption rules based on a given theme and complexity.
 * - GenerateThemeBasedEncryptionSchemeInput - The input type for the generateThemeBasedEncryptionScheme function.
 * - GenerateThemeBasedEncryptionSchemeOutput - The return type for the generateThemeBasedEncryptionScheme function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateThemeBasedEncryptionSchemeInputSchema = z.object({
  theme: z.string().describe('The theme for the encryption scheme (e.g., "pirate talk", "sci-fi aliens", "ancient egypt").'),
  complexity: z.enum(['simple', 'medium', 'complex']).default('medium').describe('The desired complexity of the encryption scheme.'),
});
export type GenerateThemeBasedEncryptionSchemeInput = z.infer<typeof GenerateThemeBasedEncryptionSchemeInputSchema>;

const EncryptionRuleSchema = z.object({
  original: z.string().describe('The original character or word to be replaced.'),
  replacement: z.string().describe('The replacement character or word.'),
});

const GenerateThemeBasedEncryptionSchemeOutputSchema = z.object({
  rules: z.array(EncryptionRuleSchema).describe('An array of substitution rules for the encryption scheme.'),
  description: z.string().describe('A brief description of the generated encryption scheme.'),
});
export type GenerateThemeBasedEncryptionSchemeOutput = z.infer<typeof GenerateThemeBasedEncryptionSchemeOutputSchema>;

const generateSchemePrompt = ai.definePrompt({
  name: 'generateThemeBasedEncryptionSchemePrompt',
  input: { schema: GenerateThemeBasedEncryptionSchemeInputSchema },
  output: { schema: GenerateThemeBasedEncryptionSchemeOutputSchema },
  prompt: `You are an AI language architect specialized in creating unique and theme-based substitution ciphers.
Your task is to generate an encryption scheme based on the provided theme and complexity.
The output should be a JSON object matching the defined schema, containing an array of 'rules' (original-replacement pairs) and a 'description' of the scheme.
The 'original' can be a single character or a common short word, and the 'replacement' should be a single character or a short word/phrase that fits the theme.
Ensure the 'original' values are distinct.
Aim for character-level or short word-level substitutions.

Theme: {{{theme}}}
Complexity: {{{complexity}}}

Generate at least 10 rules.
`,
});

const generateThemeBasedEncryptionSchemeFlow = ai.defineFlow(
  {
    name: 'generateThemeBasedEncryptionSchemeFlow',
    inputSchema: GenerateThemeBasedEncryptionSchemeInputSchema,
    outputSchema: GenerateThemeBasedEncryptionSchemeOutputSchema,
  },
  async (input) => {
    const { output } = await generateSchemePrompt(input);
    if (!output) {
      throw new Error('Failed to generate encryption scheme.');
    }
    return output;
  }
);

export async function generateThemeBasedEncryptionScheme(
  input: GenerateThemeBasedEncryptionSchemeInput
): Promise<GenerateThemeBasedEncryptionSchemeOutput> {
  return generateThemeBasedEncryptionSchemeFlow(input);
}
