
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentItem } from '../../services/ContentService';

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: ContentItem) => void;
  contentItem?: ContentItem;
  currentPage?: string;
}

const ContentForm: React.FC<ContentFormProps> = ({ isOpen, onClose, onSave, contentItem, currentPage }) => {
  const [title, setTitle] = useState('');
  const [page, setPage] = useState('Accueil');
  const [content, setContent] = useState('');
  const [type, setType] = useState('text');
  const [category, setCategory] = useState('general');
  const isEditing = Boolean(contentItem);

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setPage(contentItem.page || 'Accueil');
      setContent(contentItem.content || '');
      setType(contentItem.type || 'text');
      setCategory(contentItem.category || 'general');
    } else {
      // Réinitialiser le formulaire pour un nouvel élément
      setTitle('');
      // Si une page courante est définie, l'utiliser comme valeur par défaut
      setPage(currentPage || 'Accueil');
      setContent('');
      setType('text');
      setCategory('general');
    }
  }, [contentItem, isOpen, currentPage]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newContentItem = {
      ...(contentItem || { id: 0 }),
      title,
      page,
      content,
      type,
      category
    };

    onSave(newContentItem as ContentItem);
    onClose();
  };

  // Configuration des options de type de contenu en fonction de la page actuelle
  const getTypeOptions = () => {
    const baseTypes = [
      { value: "text", label: "Texte" },
      { value: "image", label: "Image (URL)" },
    ];

    // Ajout des types spécifiques en fonction de la page
    switch (page) {
      case 'Accueil':
        return [
          ...baseTypes,
          { value: "logo", label: "Logo (URL)" },
          { value: "background", label: "Image de fond (URL)" },
        ];
      case 'À propos':
        return [
          ...baseTypes,
          { value: "quote", label: "Citation" },
        ];
      case 'FAQ':
        return [
          ...baseTypes,
          { value: "faq-question", label: "Question FAQ" },
          { value: "faq-answer", label: "Réponse FAQ" },
        ];
      case 'Global':
        return [
          ...baseTypes,
          { value: "logo", label: "Logo (URL)" },
          { value: "hours", label: "Heures d'ouverture" },
          { value: "contact", label: "Coordonnées" },
        ];
      case 'Mentions légales':
        return [
          ...baseTypes,
          { value: "legal", label: "Mentions légales" },
        ];
      case 'Politique de confidentialité':
        return [
          ...baseTypes,
          { value: "privacy", label: "Politique de confidentialité" },
        ];
      case 'CGV':
        return [
          ...baseTypes,
          { value: "terms", label: "CGV" },
        ];
      default:
        return baseTypes;
    }
  };

  // Configuration des options de catégorie en fonction de la page actuelle
  const getCategoryOptions = () => {
    const baseCategories = [
      { value: "general", label: "Général" },
      { value: "header", label: "En-tête" },
    ];

    // Ajout des catégories spécifiques en fonction de la page
    switch (page) {
      case 'Accueil':
        return [
          ...baseCategories,
          { value: "hero", label: "Section Hero" },
          { value: "services", label: "Services" },
        ];
      case 'À propos':
        return [
          ...baseCategories,
          { value: "history", label: "Notre Histoire" },
          { value: "team", label: "Notre Équipe" },
          { value: "founder", label: "Fondateur" },
          { value: "values", label: "Nos Valeurs" },
          { value: "trust", label: "Pourquoi nous faire confiance" },
        ];
      case 'Galerie':
        return [
          ...baseCategories,
          { value: "gallery", label: "Galerie d'images" },
        ];
      case 'FAQ':
        return [
          ...baseCategories,
          { value: "general", label: "Questions générales" },
          { value: "payment", label: "Paiement" },
          { value: "cancellation", label: "Annulations" },
          { value: "services", label: "Services additionnels" },
        ];
      case 'Global':
        return [
          ...baseCategories,
          { value: "footer", label: "Pied de page" },
          { value: "legal", label: "Mentions légales" },
        ];
      default:
        return baseCategories;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le contenu' : 'Ajouter un nouveau contenu'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du contenu"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="page">Page</Label>
              <Select value={page} onValueChange={setPage}>
                <SelectTrigger id="page">
                  <SelectValue placeholder="Sélectionner une page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Accueil">Accueil</SelectItem>
                  <SelectItem value="À propos">À propos</SelectItem>
                  <SelectItem value="Galerie">Galerie</SelectItem>
                  <SelectItem value="FAQ">FAQ</SelectItem>
                  <SelectItem value="Mentions légales">Mentions légales</SelectItem>
                  <SelectItem value="Politique de confidentialité">Politique de confidentialité</SelectItem>
                  <SelectItem value="CGV">CGV</SelectItem>
                  <SelectItem value="Global">Global (toutes les pages)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="type">Type de contenu</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Type de contenu" />
                </SelectTrigger>
                <SelectContent>
                  {getTypeOptions().map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                {getCategoryOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="content">Contenu</Label>
            {type === 'text' || type === 'quote' || type === 'hours' || type === 'contact' || type === 'legal' || type === 'terms' || type === 'privacy' || type === 'faq-question' || type === 'faq-answer' ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'text' ? "Contenu à afficher" : 
                  type === 'quote' ? "Citation à afficher" :
                  type === 'hours' ? "Lundi: 08:00-18:00\nMardi: 08:00-18:00\n..." : 
                  type === 'contact' ? "Adresse, téléphone, email, etc." :
                  type === 'legal' ? "Texte des mentions légales" :
                  type === 'terms' ? "Texte des conditions générales de vente" :
                  type === 'privacy' ? "Texte de la politique de confidentialité" :
                  type === 'faq-question' ? "Question: Comment réserver?" :
                  type === 'faq-answer' ? "Réponse: Vous pouvez..." :
                  "Contenu"
                }
                rows={8}
              />
            ) : (
              <Input
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'image' ? "URL de l'image" : 
                  type === 'logo' ? "URL du logo" :
                  type === 'background' ? "URL de l'image de fond" :
                  "Contenu"
                }
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;
