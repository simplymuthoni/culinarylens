'use server';

import { identifyDishAndGenerateRecipe } from '@/ai/flows/identify-dish-and-generate-recipe';
import type { IdentifyDishAndGenerateRecipeOutput } from '@/ai/flows/identify-dish-and-generate-recipe';

export async function getRecipeFromImage(
  photoDataUri: string
): Promise<IdentifyDishAndGenerateRecipeOutput> {
  if (!photoDataUri) {
    throw new Error('Image data is missing.');
  }

  try {
    const result = await identifyDishAndGenerateRecipe({ photoDataUri });
    return result;
  } catch (e) {
    console.error('Error in getRecipeFromImage action:', e);
    throw new Error('Failed to identify dish and generate recipe. The AI may be offline or the image is unsupported.');
  }
}
