
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFormInputsProps {
  title: string;
  page: string;
  type: string;
  category: string;
  onTitleChange: (title: string) => void;
  onPageChange: (page: string) => void;
  onTypeChange: (type: string) => void;
  onCategoryChange: (category: string) => void;
}

const ContentFormInputs: React.FC<ContentFormInputsProps> = ({
  title,
  page,
  type,
  category,
  onTitleChange,
  onPageChange,
  onTypeChange,
  onCategoryChange
}) => {
  return (
    <>
      <div className="grid gap-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Titre du contenu"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="page">Page</Label>
          <Select value={page} onValueChange={onPageChange}>
            <SelectTrigger id="page">
              <SelectValue placeholder="Sélectionner une page" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Accueil">Accueil</SelectItem>
              <SelectItem value="À propos">À propos</SelectItem>
              <SelectItem value="Services">Services</SelectItem>
              <SelectItem value="Contact">Contact</SelectItem>
              <SelectItem value="FAQ">FAQ</SelectItem>
              <SelectItem value="Galerie">Galerie</SelectItem>
              <SelectItem value="Accompagnement Visa">Accompagnement Visa</SelectItem>
              <SelectItem value="Conseils Voyage">Conseils Voyage</SelectItem>
              <SelectItem value="Mentions légales">Mentions légales</SelectItem>
              <SelectItem value="CGV">CGV</SelectItem>
              <SelectItem value="Politique de confidentialité">Politique de confidentialité</SelectItem>
              <SelectItem value="Global">Global (toutes les pages)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="type">Type de contenu</Label>
          <Select value={type} onValueChange={onTypeChange}>
            <SelectTrigger id="type">
              <SelectValue placeholder="Type de contenu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Texte</SelectItem>
              <SelectItem value="hours">Heures d'ouverture</SelectItem>
              <SelectItem value="contact">Coordonnées</SelectItem>
              <SelectItem value="link">Lien</SelectItem>
              <SelectItem value="image">Image (URL)</SelectItem>
              <SelectItem value="logo">Logo (URL)</SelectItem>
              <SelectItem value="background">Image de fond (URL)</SelectItem>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
              <SelectItem value="legal">Mentions légales</SelectItem>
              <SelectItem value="terms">CGV</SelectItem>
              <SelectItem value="privacy">Politique de confidentialité</SelectItem>
              <SelectItem value="hero_title">Titre hero</SelectItem>
              <SelectItem value="hero_subtitle">Sous-titre hero</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger id="category">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">Général</SelectItem>
            <SelectItem value="header">En-tête</SelectItem>
            <SelectItem value="footer">Pied de page</SelectItem>
            <SelectItem value="hero">Section Hero</SelectItem>
            <SelectItem value="services">Services</SelectItem>
            <SelectItem value="about">À propos</SelectItem>
            <SelectItem value="contact">Contact</SelectItem>
            <SelectItem value="gallery">Galerie</SelectItem>
            <SelectItem value="legal">Mentions légales</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );
};

export default ContentFormInputs;
