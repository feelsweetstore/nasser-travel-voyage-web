
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

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
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState('main');
  const isEditing = Boolean(contentItem);

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setPage(contentItem.page || 'Accueil');
      setContent(contentItem.content || '');
      setType(contentItem.type || 'text');
      setImageUrl(contentItem.imageUrl || '');
      setIsActive(contentItem.isActive !== false);
      setPosition(contentItem.position || 'main');
    } else {
      // Réinitialiser le formulaire pour un nouvel élément
      setTitle('');
      setPage('Accueil');
      setContent('');
      setType('text');
      setImageUrl('');
      setIsActive(true);
      setPosition('main');
    }
  }, [contentItem, isOpen]);

  const handleSave = () => {
    if (!title.trim()) return;
    
    // Vérifier les champs obligatoires selon le type
    if (type === 'text' && !content.trim()) return;
    if (type === 'image' && !imageUrl.trim()) return;

    const newContentItem = {
      ...(contentItem || {}),
      title,
      page,
      content,
      type,
      imageUrl,
      isActive,
      position,
      updatedAt: new Date().toISOString()
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
                  <SelectItem value="Global">Toutes les pages</SelectItem>
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
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="hours">Heures d'ouverture</SelectItem>
                  <SelectItem value="contact">Coordonnées</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="position">Position</Label>
              <Select value={position} onValueChange={setPosition}>
                <SelectTrigger id="position">
                  <SelectValue placeholder="Position sur la page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="header">En-tête</SelectItem>
                  <SelectItem value="main">Contenu principal</SelectItem>
                  <SelectItem value="sidebar">Barre latérale</SelectItem>
                  <SelectItem value="footer">Pied de page</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="status">Statut</Label>
              <div className="flex items-center justify-between p-2 border rounded-md">
                <span>Actif</span>
                <Switch 
                  id="status"
                  checked={isActive} 
                  onCheckedChange={setIsActive} 
                />
              </div>
            </div>
          </div>
          
          {type === 'image' && (
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">URL de l'image</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemple.com/image.jpg"
              />
              {imageUrl && (
                <div className="mt-2 border p-2 rounded-md">
                  <img 
                    src={imageUrl} 
                    alt="Aperçu de l'image"
                    className="max-h-40 mx-auto"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                      target.alt = "Image non disponible";
                    }} 
                  />
                </div>
              )}
            </div>
          )}
          
          {type !== 'image' && (
            <div className="grid gap-2">
              <Label htmlFor="content">Contenu</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={
                  type === 'hours' 
                    ? "Lundi-Vendredi: 8h-18h\nSamedi: 9h-15h\nDimanche: Fermé" 
                    : type === 'contact' 
                      ? "Adresse: 123 Rue Example\nTéléphone: +235 12 34 56 78\nEmail: contact@example.com" 
                      : "Contenu à afficher"
                }
                rows={8}
              />
            </div>
          )}
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
