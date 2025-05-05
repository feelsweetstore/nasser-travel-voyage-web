
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface ContentFormHeaderProps {
  isEditing: boolean;
}

const ContentFormHeader: React.FC<ContentFormHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditing ? 'Modifier le contenu' : 'Ajouter un nouveau contenu'}
      </DialogTitle>
      <DialogDescription>
        {isEditing 
          ? 'Modifiez les informations du contenu ci-dessous.' 
          : 'Remplissez les champs pour créer un nouveau contenu.'}
      </DialogDescription>
    </DialogHeader>
  );
};

export default ContentFormHeader;
