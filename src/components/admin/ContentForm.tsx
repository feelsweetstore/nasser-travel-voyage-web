
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";

import ContentFormHeader from './content/ContentFormHeader';
import ContentFormInputs from './content/ContentFormInputs';
import ContentFormActions from './content/ContentFormActions';
import ContentEditorSelector from './content/ContentEditorSelector';

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

  // Reset form when dialog opens/closes or contentItem changes
  useEffect(() => {
    if (isOpen && contentItem) {
      // Small timeout to ensure the dialog is fully open before populating fields
      setTimeout(() => {
        setTitle(contentItem.title || '');
        setPage(contentItem.page || 'Accueil');
        setContent(contentItem.content || '');
        setType(contentItem.type || 'text');
        setCategory(contentItem.category || 'general');
      }, 50);
    } else if (!isOpen) {
      // Only reset the form when closing
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
      <DialogContent className="sm:max-w-[800px] w-full max-h-[85vh] overflow-hidden">
        <ContentFormHeader isEditing={isEditing} />
        <div className="grid gap-4 py-3 overflow-y-auto max-h-[calc(85vh-130px)] pr-2">
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
            key={isOpen ? "open" : "closed"}
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
