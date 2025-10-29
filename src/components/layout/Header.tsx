import { ChefHat } from 'lucide-react';
import type { FC } from 'react';

const Header: FC = () => {
  return (
    <header className="py-6 bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
      <div className="container mx-auto flex items-center justify-center sm:justify-start">
        <div className="flex items-center gap-3">
          <ChefHat className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold font-headline text-primary">
            Culinary Lens
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
