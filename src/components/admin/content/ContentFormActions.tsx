
import React from 'react';
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ContentFormActionsProps {
  onClose: () => void;
  onSave: () => void;
}

const ContentFormActions: React.FC<ContentFormActionsProps> = ({ onClose, onSave }) => {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onClose}>Annuler</Button>
      <Button onClick={onSave}>Enregistrer</Button>
    </DialogFooter>
  );
};

export default ContentFormActions;
