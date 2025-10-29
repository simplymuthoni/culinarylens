'use client';

import { useState } from 'react';
import type { IdentifyDishAndGenerateRecipeOutput } from '@/ai/flows/identify-dish-and-generate-recipe';
import { getRecipeFromImage } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import UploadForm from '@/components/UploadForm';
import RecipeResult from '@/components/RecipeResult';
import LoadingState from '@/components/LoadingState';

export default function Home() {
  const [result, setResult] = useState<IdentifyDishAndGenerateRecipeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async (photoDataUri: string) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await getRecipeFromImage(photoDataUri);
      setResult(response);
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      toast({
        variant: 'destructive',
        title: 'Recipe Generation Failed',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      {loading ? (
        <LoadingState />
      ) : result ? (
        <RecipeResult data={result} onReset={handleReset} />
      ) : (
        <UploadForm onSubmit={handleFormSubmit} />
      )}
    </div>
  );
}
