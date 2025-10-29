import Image from 'next/image';
import { ChefHat, List, UtensilsCrossed, Sparkles, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { IdentifyDishAndGenerateRecipeOutput } from '@/ai/flows/identify-dish-and-generate-recipe';

interface RecipeResultProps {
  data: IdentifyDishAndGenerateRecipeOutput;
  onReset: () => void;
}

export default function RecipeResult({ data, onReset }: RecipeResultProps) {
  const { dishName, recipe, dishImage } = data;

  const isOptional = (ingredient: string) => /(optional|can be omitted)/i.test(ingredient);
  const cleanIngredient = (ingredient: string) => ingredient.replace(/\s*\((optional|can be omitted)\)/i, '').trim();

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex justify-between items-start mb-6 gap-4">
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold font-headline text-primary">{dishName}</h2>
          <p className="text-lg text-muted-foreground flex items-center gap-2 mt-1">
            <Sparkles className="h-5 w-5 text-amber-500" />
            AI-generated recipe just for you
          </p>
        </div>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Start Over
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg sticky top-28">
            <CardContent className="p-0">
              <div className="aspect-square relative w-full overflow-hidden rounded-t-lg">
                <Image src={dishImage} alt={`AI-generated image of ${dishName}`} fill className="object-cover" />
                <Badge variant="secondary" className="absolute top-3 right-3">AI-Generated Image</Badge>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold font-headline">Voila!</h3>
                <p className="text-muted-foreground mt-1">
                  Here is an AI-generated image of what your final {dishName} could look like.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-2xl">
                <ChefHat className="h-7 w-7 text-primary" />
                <span>Full Recipe</span>
              </CardTitle>
              <CardDescription>Your step-by-step guide to making {dishName}.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ingredients" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ingredients"><List className="mr-2"/>Ingredients</TabsTrigger>
                  <TabsTrigger value="instructions"><UtensilsCrossed className="mr-2"/>Instructions</TabsTrigger>
                </TabsList>
                <TabsContent value="ingredients" className="mt-6">
                  <ul className="space-y-3">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-md">
                        <span className="flex-grow">{cleanIngredient(ingredient)}</span>
                        {isOptional(ingredient) && <Badge variant="outline">Optional</Badge>}
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="instructions" className="mt-6">
                  <ol className="space-y-4">
                    {recipe.steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold font-headline">
                          {index + 1}
                        </div>
                        <p className="pt-1 flex-grow">{step}</p>
                      </li>
                    ))}
                  </ol>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
