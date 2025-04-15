
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Image, Upload } from 'lucide-react';

interface ImageUploadProps {
  currentImage?: string;
  onImageSelected: (url: string) => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ currentImage, onImageSelected }) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreview(base64String);
        onImageSelected(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      {preview && (
        <div className="relative aspect-video w-full max-w-sm mx-auto">
          <img
            src={preview}
            alt="Aperçu"
            className="rounded-lg object-cover w-full h-full"
          />
        </div>
      )}
      <div className="flex gap-4 justify-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="w-4 h-4 mr-2" />
          {preview ? 'Changer l\'image' : 'Télécharger une image'}
        </Button>
        {preview && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPreview(null);
              onImageSelected('');
            }}
          >
            Supprimer
          </Button>
        )}
      </div>
    </div>
  );
};
