
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: any) => void;
  contentItem?: any;
}

const ContentForm: React.FC<ContentFormProps> = ({ isOpen, onClose, onSave, contentItem }) => {
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
      setPage('Accueil');
      setContent('');
      setType('text');
      setCategory('general');
    }
  }, [contentItem, isOpen]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;

    const newContentItem = {
      ...(contentItem || {}),
      title,
      page,
      content,
      type,
      category
    };

    onSave(newContentItem);
    onClose();
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
                  <SelectItem value="Services">Services</SelectItem>
                  <SelectItem value="Contact">Contact</SelectItem>
                  <SelectItem value="FAQ">FAQ</SelectItem>
                  <SelectItem value="Galerie">Galerie</SelectItem>
                  <SelectItem value="Mentions légales">Mentions légales</SelectItem>
                  <SelectItem value="CGV">CGV</SelectItem>
                  <SelectItem value="Politique de confidentialité">Politique de confidentialité</SelectItem>
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
          
          <div className="grid gap-2">
            <Label htmlFor="content">Contenu</Label>
            {type === 'text' || type === 'hours' || type === 'contact' || type === 'legal' || type === 'terms' || type === 'privacy' || type === 'faq' ? (
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'text' ? "Contenu à afficher" : 
                  type === 'hours' ? "Lundi: 08:00-18:00\nMardi: 08:00-18:00\n..." : 
                  type === 'contact' ? "Adresse, téléphone, email, etc." :
                  type === 'legal' ? "Texte des mentions légales" :
                  type === 'terms' ? "Texte des conditions générales de vente" :
                  type === 'privacy' ? "Texte de la politique de confidentialité" :
                  type === 'faq' ? "Question: Comment réserver?\nRéponse: Vous pouvez..." :
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
                  type === 'link' ? "URL du lien" : 
                  type === 'image' ? "URL de l'image" : 
                  type === 'logo' ? "URL du logo" :
                  type === 'background' ? "URL de l'image de fond" :
                  type === 'service' ? "Nom du service" :
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
