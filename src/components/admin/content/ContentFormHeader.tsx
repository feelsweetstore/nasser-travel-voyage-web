
import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ContentFormHeaderProps {
  isEditing: boolean;
}

const ContentFormHeader: React.FC<ContentFormHeaderProps> = ({ isEditing }) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {isEditing ? 'Modifier le contenu' : 'Ajouter un nouveau contenu'}
      </DialogTitle>
    </DialogHeader>
  );
};

export default ContentFormHeader;
