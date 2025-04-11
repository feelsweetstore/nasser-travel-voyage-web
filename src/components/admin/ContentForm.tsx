
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload } from 'lucide-react';

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
  const [link, setLink] = useState('');
  const [contactInfo, setContactInfo] = useState({
    address: '',
    phone: '',
    email: '',
    whatsapp: '',
    hours: ''
  });
  const isEditing = Boolean(contentItem);

  useEffect(() => {
    if (contentItem) {
      setTitle(contentItem.title || '');
      setPage(contentItem.page || 'Accueil');
      setContent(contentItem.content || '');
      setType(contentItem.type || 'text');
      setImageUrl(contentItem.imageUrl || '');
      setLink(contentItem.link || '');
      
      // Load contact info if available
      if (contentItem.type === 'contact') {
        setContactInfo({
          address: contentItem.address || '',
          phone: contentItem.phone || '',
          email: contentItem.email || '',
          whatsapp: contentItem.whatsapp || '',
          hours: contentItem.hours || ''
        });
      }
    } else {
      // Reset form for new item
      setTitle('');
      setPage('Accueil');
      setContent('');
      setType('text');
      setImageUrl('');
      setLink('');
      setContactInfo({
        address: '',
        phone: '',
        email: '',
        whatsapp: '',
        hours: ''
      });
    }
  }, [contentItem, isOpen]);

  const handleSave = () => {
    // Basic validation
    if (!title.trim()) return;
    
    // Build the content item based on type
    let newContentItem = {
      ...(contentItem || {}),
      title,
      page,
      type
    };

    // Add specific fields based on content type
    switch (type) {
      case 'text':
        if (!content.trim()) return;
        newContentItem = { ...newContentItem, content };
        break;
      case 'image':
        if (!imageUrl.trim()) return;
        newContentItem = { ...newContentItem, imageUrl, content: content || '' };
        break;
      case 'link':
        if (!link.trim()) return;
        newContentItem = { ...newContentItem, link, content: content || '' };
        break;
      case 'contact':
        newContentItem = { 
          ...newContentItem, 
          ...contactInfo,
          content: 'Informations de contact' 
        };
        break;
      default:
        if (!content.trim()) return;
        newContentItem = { ...newContentItem, content };
    }

    onSave(newContentItem);
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to server/storage
      // For this demo, we'll create a data URL
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContactInfoChange = (field: keyof typeof contactInfo, value: string) => {
    setContactInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Modifier le contenu' : 'Ajouter un nouveau contenu'}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre du contenu"
              />
            </div>
            
            <div>
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
                  <SelectItem value="Global">Global (En-tête/Pied de page)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="type">Type de contenu</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="type">
                <SelectValue placeholder="Type de contenu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Texte</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="link">Lien</SelectItem>
                <SelectItem value="contact">Informations de contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Tabs value={type} className="mt-2">
            <TabsContent value="text" className="space-y-4">
              <div>
                <Label htmlFor="content">Contenu</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Contenu à afficher"
                  rows={8}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="image" className="space-y-4">
              <div>
                <Label htmlFor="image">Image</Label>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <Input
                      id="image-url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="URL de l'image"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <Label htmlFor="image-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 inline-flex items-center justify-center px-4 py-2 rounded-md">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                
                {imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Aperçu:</p>
                    <div className="border rounded-md p-2">
                      <img src={imageUrl} alt="Aperçu" className="max-h-[200px] object-contain mx-auto" />
                    </div>
                  </div>
                )}
                
                <div className="mt-4">
                  <Label htmlFor="image-desc">Description (alt)</Label>
                  <Textarea
                    id="image-desc"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Description de l'image (pour l'accessibilité)"
                    rows={2}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="link" className="space-y-4">
              <div>
                <Label htmlFor="link">URL du lien</Label>
                <Input
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="link-text">Texte du lien</Label>
                <Input
                  id="link-text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Texte à afficher"
                />
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={contactInfo.address}
                    onChange={(e) => handleContactInfoChange('address', e.target.value)}
                    placeholder="Adresse complète"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="hours">Horaires d'ouverture</Label>
                  <Textarea
                    id="hours"
                    value={contactInfo.hours}
                    onChange={(e) => handleContactInfoChange('hours', e.target.value)}
                    placeholder="Lun-Ven: 9h-18h..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={contactInfo.phone}
                    onChange={(e) => handleContactInfoChange('phone', e.target.value)}
                    placeholder="+235 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={contactInfo.whatsapp}
                    onChange={(e) => handleContactInfoChange('whatsapp', e.target.value)}
                    placeholder="+235 XX XX XX XX"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={contactInfo.email}
                    onChange={(e) => handleContactInfoChange('email', e.target.value)}
                    placeholder="contact@example.com"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
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
