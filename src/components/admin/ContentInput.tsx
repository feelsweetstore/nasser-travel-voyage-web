
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from './ImageUpload';
import { TimeSelector } from './TimeSelector';

interface ContentInputProps {
  type: string;
  content: string;
  onContentChange: (value: string) => void;
}

export const ContentInput: React.FC<ContentInputProps> = ({
  type,
  content,
  onContentChange
}) => {
  if (type === 'image' || type === 'logo' || type === 'background') {
    return (
      <div className="grid gap-2">
        <Label htmlFor="content">Image</Label>
        <ImageUpload
          currentImage={content}
          onImageSelected={onContentChange}
        />
      </div>
    );
  }

  if (type === 'hours') {
    return (
      <div className="grid gap-2">
        <Label htmlFor="content">Heures d'ouverture</Label>
        <TimeSelector
          value={content}
          onChange={onContentChange}
        />
      </div>
    );
  }

  const getPlaceholder = () => {
    switch (type) {
      case 'text': return "Contenu à afficher";
      case 'quote': return "Citation à afficher";
      case 'contact': return "Adresse, téléphone, email, etc.";
      case 'legal': return "Texte des mentions légales";
      case 'terms': return "Texte des conditions générales de vente";
      case 'privacy': return "Texte de la politique de confidentialité";
      case 'faq-question': return "Question: Comment réserver?";
      case 'faq-answer': return "Réponse: Vous pouvez...";
      default: return "Contenu";
    }
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="content">Contenu</Label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={getPlaceholder()}
        rows={8}
      />
    </div>
  );
};

