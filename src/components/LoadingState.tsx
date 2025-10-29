import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoadingState() {
  return (
    <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold font-headline text-primary animate-pulse">Analyzing your dish...</h2>
        <p className="text-lg text-muted-foreground mt-2">Our AI chef is firing up the oven and writing your recipe!</p>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-8">
            <div className="lg:col-span-2">
                <Card>
                    <CardContent className="p-0">
                        <Skeleton className="aspect-square w-full rounded-t-lg" />
                        <div className="p-6 space-y-3">
                            <Skeleton className="h-6 w-1/4" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-3">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/2" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-1/2" />
                            <Skeleton className="h-10 w-1/2" />
                        </div>
                        <div className="space-y-3 pt-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    </div>
  );
}
