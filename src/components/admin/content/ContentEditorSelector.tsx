
import React from 'react';
import TextContentEditor from './TextContentEditor';
import ImageContentEditor from './ImageContentEditor';
import HoursContentEditor from './HoursContentEditor';

interface ContentEditorSelectorProps {
  type: string;
  content: string;
  onContentChange: (content: string) => void;
}

const ContentEditorSelector: React.FC<ContentEditorSelectorProps> = ({ 
  type, 
  content, 
  onContentChange 
}) => {
  if (type === 'image' || type === 'logo' || type === 'background') {
    return (
      <ImageContentEditor
        content={content}
        onContentChange={onContentChange}
        type={type as 'image' | 'logo' | 'background'}
      />
    );
  }

  if (type === 'hours') {
    return (
      <HoursContentEditor
        content={content}
        onContentChange={onContentChange}
      />
    );
  }

  return (
    <TextContentEditor
      content={content}
      onContentChange={onContentChange}
      type={type}
    />
  );
};

export default ContentEditorSelector;
