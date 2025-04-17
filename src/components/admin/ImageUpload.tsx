
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  onChange: (value: string) => void;
  value?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onChange, value }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Type de fichier non supporté",
        description: "Veuillez sélectionner une image (jpg, png, gif, etc.)",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Erreur lors du téléchargement');

      const data = await response.json();
      onChange(data.url);

      toast({
        title: "Image téléchargée",
        description: "L'image a été téléchargée avec succès"
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du téléchargement",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {showUrlInput ? (
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="https://exemple.com/image.jpg"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(false)}
          >
            Télécharger une image à la place
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="max-w-[300px]"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUrlInput(true)}
            >
              <Link className="h-4 w-4 mr-2" />
              URL
            </Button>
          </div>
          {value && (
            <div className="mt-2">
              <img 
                src={value} 
                alt="Aperçu" 
                className="max-w-[200px] h-auto rounded-md border"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
