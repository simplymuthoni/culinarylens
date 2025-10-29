'use server';
/**
 * @fileOverview This file defines a Genkit flow that identifies a dish from an image and generates a recipe for it.
 *
 * - identifyDishAndGenerateRecipe - A function that takes an image of a dish as input and returns a recipe and an image of the dish.
 * - IdentifyDishAndGenerateRecipeInput - The input type for the identifyDishAndGenerateRecipe function.
 * - IdentifyDishAndGenerateRecipeOutput - The return type for the identifyDishAndGenerateRecipe function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyDishAndGenerateRecipeInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of a dish, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type IdentifyDishAndGenerateRecipeInput = z.infer<typeof IdentifyDishAndGenerateRecipeInputSchema>;

const IdentifyDishAndGenerateRecipeOutputSchema = z.object({
  dishName: z.string().describe('The identified name of the dish.'),
  recipe: z.object({
    ingredients: z.array(z.string()).describe('The list of ingredients for the recipe.'),
    steps: z.array(z.string()).describe('The step-by-step instructions for the recipe.'),
  }).describe('The generated recipe for the dish.'),
  dishImage: z.string().describe('A data URI of the AI-generated image of the dish.'),
});
export type IdentifyDishAndGenerateRecipeOutput = z.infer<typeof IdentifyDishAndGenerateRecipeOutputSchema>;

export async function identifyDishAndGenerateRecipe(
  input: IdentifyDishAndGenerateRecipeInput
): Promise<IdentifyDishAndGenerateRecipeOutput> {
  return identifyDishAndGenerateRecipeFlow(input);
}

const identifyDishPrompt = ai.definePrompt({
  name: 'identifyDishPrompt',
  input: {schema: IdentifyDishAndGenerateRecipeInputSchema},
  output: {schema: z.object({dishName: z.string()})},
  prompt: `You are a culinary expert. Identify the dish in the following image.

  Image: {{media url=photoDataUri}}

  Respond with ONLY the dish name. Do not add any additional text.`,
});

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {schema: z.object({dishName: z.string()})},
  output: {schema: z.object({
    ingredients: z.array(z.string()),
    steps: z.array(z.string())
  })},
  prompt: `You are a world-class chef. Generate a detailed recipe for the following dish, including a list of ingredients and step-by-step instructions.
  Indicate whether a listed ingredient may be omitted without significant effect.

  Dish: {{dishName}}`,
});

const generateDishImagePrompt = ai.definePrompt({
  name: 'generateDishImagePrompt',
  input: {schema: z.object({dishName: z.string()})},
  output: {schema: z.object({dishImage: z.string()})},
  prompt: `You are a professional food photographer. Generate a high-quality image of the following dish:

  Dish: {{dishName}}

  The image should be appetizing and well-lit.`,
});

const identifyDishAndGenerateRecipeFlow = ai.defineFlow(
  {
    name: 'identifyDishAndGenerateRecipeFlow',
    inputSchema: IdentifyDishAndGenerateRecipeInputSchema,
    outputSchema: IdentifyDishAndGenerateRecipeOutputSchema,
  },
  async input => {
    const {output: {dishName}} = await identifyDishPrompt(input);

    const {output: recipe} = await generateRecipePrompt({dishName});

    const {media} = await ai.generate({
      prompt: `Generate an image of ${dishName}`,
      model: 'googleai/imagen-2-002',
    });

    return {
      dishName,
      recipe: {
        ingredients: recipe.ingredients,
        steps: recipe.steps,
      },
      dishImage: media!.url,
    };
  }
);
