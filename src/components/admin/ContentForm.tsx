
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUpload from './ImageUpload';
import TimeSelector from './TimeSelector';

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

    console.log('Saving content item:', newContentItem);
    onSave(newContentItem);
    onClose();
  };

  const handleTimeChange = (day: string, time: string) => {
    const hours = content.split('\n');
    const dayIndex = hours.findIndex(h => h.startsWith(day));
    
    if (dayIndex !== -1) {
      hours[dayIndex] = `${day}: ${time}`;
      setContent(hours.join('\n'));
    }
  };

  const getTimeForDay = (day: string): string => {
    if (!content) return '08:00-18:00';
    const hours = content.split('\n');
    const dayLine = hours.find(h => h.startsWith(day));
    if (!dayLine) return '08:00-18:00';
    const time = dayLine.split(': ')[1];
    return time || '08:00-18:00';
  };

  const renderContentInput = () => {
    if (type === 'image' || type === 'logo' || type === 'background') {
      return (
        <ImageUpload
          value={content}
          onChange={setContent}
        />
      );
    }

    if (type === 'hours') {
      return (
        <div className="space-y-4">
          {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
            <TimeSelector
              key={day}
              day={day}
              value={getTimeForDay(day)}
              onChange={(time) => handleTimeChange(day, time)}
            />
          ))}
        </div>
      );
    }

    // Special case for hero content
    if (category === 'hero_title' || category === 'hero_subtitle') {
      return (
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            category === 'hero_title' ? "Titre principal de la page d'accueil" : 
            "Sous-titre de la page d'accueil"
          }
          rows={3}
        />
      );
    }

    return (
      <Textarea
        id="content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={
          type === 'text' ? "Contenu à afficher" : 
          type === 'contact' ? "Adresse, téléphone, email, etc." :
          type === 'legal' ? "Texte des mentions légales" :
          type === 'terms' ? "Texte des conditions générales de vente" :
          type === 'privacy' ? "Texte de la politique de confidentialité" :
          type === 'faq' ? "Question: Comment réserver?\nRéponse: Vous pouvez..." :
          "Contenu"
        }
        rows={8}
      />
    );
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
                <SelectItem value="hero_title">Titre Hero</SelectItem>
                <SelectItem value="hero_subtitle">Sous-titre Hero</SelectItem>
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
            {renderContentInput()}
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
