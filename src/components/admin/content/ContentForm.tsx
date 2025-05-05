
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

import ContentFormHeader from './ContentFormHeader';
import ContentFormInputs from './ContentFormInputs';
import ContentFormActions from './ContentFormActions';
import ContentEditorSelector from './ContentEditorSelector';

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: any) => void;
  contentItem?: any;
}

const ContentForm: React.FC<ContentFormProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  contentItem 
}) => {
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

    onSave(newContentItem);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <ContentFormHeader isEditing={isEditing} />
        <div className="grid gap-4 py-4">
          <ContentFormInputs
            title={title}
            page={page}
            type={type}
            category={category}
            onTitleChange={setTitle}
            onPageChange={setPage}
            onTypeChange={setType}
            onCategoryChange={setCategory}
          />
          
          <ContentEditorSelector
            type={type}
            content={content}
            onContentChange={setContent}
          />
        </div>
        <ContentFormActions onClose={onClose} onSave={handleSave} />
      </DialogContent>
    </Dialog>
  );
};

export default ContentForm;
