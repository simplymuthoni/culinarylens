'use client';

import { useState, useRef, type ChangeEvent, type FormEvent } from 'react';
import Image from 'next/image';
import { Camera, Upload, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlaceHolderImages } from '@/lib/placeholder-images';

interface UploadFormProps {
  onSubmit: (photoDataUri: string) => void;
}

export default function UploadForm({ onSubmit }: UploadFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setImageData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageData(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (imageData) {
      onSubmit(imageData);
    }
  };
  
  const placeholderImage = PlaceHolderImages[0];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="w-full shadow-lg border-2 border-dashed border-muted hover:border-primary transition-colors duration-300 bg-card/80">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
            <Camera className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="mt-4 text-3xl font-headline">What's Cooking?</CardTitle>
          <CardDescription className="text-lg">Upload a photo of your meal to get the recipe.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative aspect-video w-full bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center group">
              {imagePreview ? (
                <>
                  <Image src={imagePreview} alt="Selected meal" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                     <Button type="button" size="icon" variant="destructive" onClick={handleRemoveImage} aria-label="Remove image">
                        <X className="h-6 w-6" />
                     </Button>
                  </div>
                </>
              ) : (
                <div className="text-center text-muted-foreground p-4 flex flex-col items-center gap-2">
                    {placeholderImage && <Image 
                        src={placeholderImage.imageUrl}
                        alt={placeholderImage.description}
                        fill
                        className="opacity-10 absolute inset-0 w-full h-full object-cover"
                        data-ai-hint={placeholderImage.imageHint}
                    />}
                    <div className="relative">
                        <Upload className="h-8 w-8 mb-2 mx-auto" />
                        <p>Drag & drop or click to upload</p>
                        <p className="text-xs">PNG, JPG, or WEBP</p>
                    </div>
                </div>
              )}
               <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/webp"
              />
            </div>
            <Button type="submit" disabled={!imageData} className="w-full text-lg py-6">
              <Sparkles className="mr-2 h-5 w-5" />
              Generate Recipe
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
