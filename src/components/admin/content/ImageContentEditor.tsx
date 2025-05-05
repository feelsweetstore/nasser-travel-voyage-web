
import React from 'react';
import { Label } from "@/components/ui/label";
import ImageUpload from '../ImageUpload';

interface ImageContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  type: 'image' | 'logo' | 'background';
}

const ImageContentEditor: React.FC<ImageContentEditorProps> = ({ 
  content, 
  onContentChange,
  type
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="content">
        {type === 'image' ? 'Image' : 
         type === 'logo' ? 'Logo' : 
         'Image de fond'}
      </Label>
      <ImageUpload
        value={content}
        onChange={onContentChange}
      />
    </div>
  );
};

export default ImageContentEditor;
