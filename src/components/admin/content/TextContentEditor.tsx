
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface TextContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  type: string;
}

const TextContentEditor: React.FC<TextContentEditorProps> = ({ 
  content, 
  onContentChange,
  type
}) => {
  const getPlaceholder = () => {
    switch(type) {
      case 'text': 
        return "Contenu à afficher";
      case 'contact': 
        return "Adresse, téléphone, email, etc.";
      case 'legal': 
        return "Texte des mentions légales";
      case 'terms': 
        return "Texte des conditions générales de vente";
      case 'privacy': 
        return "Texte de la politique de confidentialité";
      case 'faq': 
        return "Question: Comment réserver?\nRéponse: Vous pouvez...";
      case 'hero_title':
        return "Titre de la section d'accueil";
      case 'hero_subtitle':
        return "Sous-titre de la section d'accueil";
      default: 
        return "Contenu";
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

export default TextContentEditor;
