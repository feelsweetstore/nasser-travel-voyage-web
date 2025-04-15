
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Pencil, Trash, Search } from 'lucide-react';
import { ContentItem } from '../../services/ContentService';
import ContentForm from './ContentForm';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface ContentTableProps {
  contentItems: ContentItem[];
  onSave: (contentItem: ContentItem) => void;
  onDelete: (id: number) => void;
}

const ContentTable: React.FC<ContentTableProps> = ({ contentItems, onSave, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [contentDialogOpen, setContentDialogOpen] = useState(false);
  const [activeContentItem, setActiveContentItem] = useState<ContentItem | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);

  // Filtrer le contenu en fonction de la recherche et de l'onglet actif
  const filteredContent = contentItems.filter(item => {
    const matchesSearch = searchTerm 
      ? item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
      
    const matchesTab = activeTab === 'all' 
      ? true 
      : item.page.toLowerCase() === activeTab.toLowerCase();
    
    return matchesSearch && matchesTab;
  });

  // Gérer l'ajout d'un nouvel élément
  const handleAddContent = () => {
    setActiveContentItem(undefined);
    setContentDialogOpen(true);
  };

  // Gérer la modification d'un élément existant
  const handleEditContent = (item: ContentItem) => {
    setActiveContentItem(item);
    setContentDialogOpen(true);
  };

  // Gérer la suppression d'un élément
  const handleDeleteClick = (id: number) => {
    setContentToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirmer la suppression
  const confirmDelete = () => {
    if (contentToDelete !== null) {
      onDelete(contentToDelete);
      setDeleteDialogOpen(false);
      setContentToDelete(null);
    }
  };

  // Tronquer le texte long pour l'affichage
  const truncateText = (text: string, maxLength: number = 50) => {
    if (text && text.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-6">
        <div className="w-full md:w-1/3 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher du contenu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full md:w-2/3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-grow">Tout</TabsTrigger>
            <TabsTrigger value="Accueil" className="flex-grow">Accueil</TabsTrigger>
            <TabsTrigger value="Services" className="flex-grow">Services</TabsTrigger>
            <TabsTrigger value="À propos" className="flex-grow">À propos</TabsTrigger>
            <TabsTrigger value="Galerie" className="flex-grow">Galerie</TabsTrigger>
            <TabsTrigger value="FAQ" className="flex-grow">FAQ</TabsTrigger>
            <TabsTrigger value="Global" className="flex-grow">Global</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddContent} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">ID</TableHead>
              <TableHead className="w-[200px]">Titre</TableHead>
              <TableHead className="w-[150px]">Page</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[100px]">Catégorie</TableHead>
              <TableHead>Contenu</TableHead>
              <TableHead className="w-[100px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContent.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  {searchTerm || activeTab !== 'all' 
                    ? "Aucun contenu ne correspond à votre recherche" 
                    : "Aucun contenu disponible"}
                </TableCell>
              </TableRow>
            ) : (
              filteredContent.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell>{item.page}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>
                    {item.type === 'image' || item.type === 'logo' || item.type === 'background' 
                      ? <a href={item.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Voir l'image</a>
                      : truncateText(item.content)
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditContent(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(item.id)}>
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Formulaire de contenu */}
      <ContentForm 
        isOpen={contentDialogOpen} 
        onClose={() => setContentDialogOpen(false)} 
        onSave={(content) => {
          onSave(content as ContentItem);
          setContentDialogOpen(false);
        }} 
        contentItem={activeContentItem}
        currentPage={activeTab !== 'all' ? activeTab : undefined}
      />

      {/* Boîte de dialogue de confirmation de suppression */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cet élément?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action est irréversible. Cet élément sera supprimé définitivement de la base de données.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentTable;
