'use server';

/**
 * @fileOverview This file defines the Genkit flow for generating an image of a dish based on its recipe.
 *
 * It includes:
 * - `generateDishImage`: A function that takes a recipe as input and returns a data URI of the generated image.
 * - `GenerateDishImageInput`: The input type for the `generateDishImage` function, representing the recipe.
 * - `GenerateDishImageOutput`: The output type for the `generateDishImage` function, representing the data URI of the generated image.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDishImageInputSchema = z.object({
  recipe: z.string().describe('The recipe of the dish.'),
  dishName: z.string().describe('The name of the dish.'),
});
export type GenerateDishImageInput = z.infer<typeof GenerateDishImageInputSchema>;

const GenerateDishImageOutputSchema = z.object({
  image: z
    .string()
    .describe(
      'A data URI of the generated image of the dish. It must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type GenerateDishImageOutput = z.infer<typeof GenerateDishImageOutputSchema>;

export async function generateDishImage(input: GenerateDishImageInput): Promise<GenerateDishImageOutput> {
  return generateDishImageFlow(input);
}

const generateDishImagePrompt = ai.definePrompt({
  name: 'generateDishImagePrompt',
  input: {schema: GenerateDishImageInputSchema},
  output: {schema: GenerateDishImageOutputSchema},
  prompt: `Generate a compelling image of the following dish based on its recipe and name. The image should be appetizing and visually appealing. Return the image as a data URI.

Dish Name: {{{dishName}}}
Recipe: {{{recipe}}}`,
});

const generateDishImageFlow = ai.defineFlow(
  {
    name: 'generateDishImageFlow',
    inputSchema: GenerateDishImageInputSchema,
    outputSchema: GenerateDishImageOutputSchema,
  },
  async input => {
    const {media} = await ai.generate({
      prompt: `Generate an image of ${input.dishName} based on the following recipe: ${input.recipe}`,
      model: 'googleai/imagen-4.0-fast-generate-001',
    });

    return {image: media.url!};
  }
);
