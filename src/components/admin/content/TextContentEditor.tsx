
import React, { useState, useRef, useEffect } from 'react';
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Text,
  Palette
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TextContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  type: string;
}

const TextContentEditor: React.FC<TextContentEditorProps> = ({ 
  content, 
  onContentChange,
  type
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [previewContent, setPreviewContent] = useState(content);
  const [isEmpty, setIsEmpty] = useState(!content);
  
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
      setPreviewContent(content);
      setIsEmpty(!content);
    }
  }, [content]);

  const getPlaceholder = () => {
    switch(type) {
      case 'text': 
        return "Contenu à afficher";
      case 'contact': 
        return "Adresse, téléphone, email, etc.";
      case 'legal': 
        return "Texte des mentions légales";
      case 'terms': 
        return "Texte des conditions générales de vente";
      case 'privacy': 
        return "Texte de la politique de confidentialité";
      case 'faq': 
        return "Question: Comment réserver?\nRéponse: Vous pouvez...";
      case 'hero_title':
        return "Titre de la section d'accueil";
      case 'hero_subtitle':
        return "Sous-titre de la section d'accueil";
      default: 
        return "Contenu";
    }
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const updatedContent = editorRef.current.innerHTML;
      setPreviewContent(updatedContent);
      setIsEmpty(editorRef.current.innerText.trim() === '');
      onContentChange(updatedContent);
    }
  };

  const execFormatCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value || '');
    handleContentChange();
  };

  const formatSelection = (formatType: string, value?: string) => {
    if (window.getSelection()?.toString()) {
      execFormatCommand(formatType, value);
    }
  };
  
  const applyTextColor = (color: string) => {
    if (window.getSelection()?.toString()) {
      execFormatCommand('foreColor', color);
    }
  };

  // CSS for the editor placeholder
  const placeholderStyle = `
    .editor-empty:before {
      content: attr(data-placeholder);
      color: #6b7280;
      pointer-events: none;
      position: absolute;
    }
  `;
  
  // Predefined colors for the color picker
  const colorOptions = [
    { color: "#000000", label: "Noir" },
    { color: "#333333", label: "Gris foncé" },
    { color: "#8E9196", label: "Gris neutre" },
    { color: "#FFFFFF", label: "Blanc" },
    { color: "#8B5CF6", label: "Violet vif" },
    { color: "#9b87f5", label: "Violet primaire" },
    { color: "#D946EF", label: "Rose magenta" },
    { color: "#F97316", label: "Orange vif" },
    { color: "#0EA5E9", label: "Bleu océan" },
    { color: "#10B981", label: "Vert" },
    { color: "#EF4444", label: "Rouge" },
  ];

  return (
    <div className="grid gap-4">
      <Label htmlFor="content">Contenu</Label>
      
      {/* Barre d'outils de formatage */}
      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-t-md border border-gray-300">
        <Select onValueChange={(value) => formatSelection('fontName', value)}>
          <SelectTrigger className="w-28">
            <SelectValue placeholder="Police" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Arial">Arial</SelectItem>
            <SelectItem value="Helvetica">Helvetica</SelectItem>
            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            <SelectItem value="Georgia">Georgia</SelectItem>
            <SelectItem value="Courier New">Courier New</SelectItem>
            <SelectItem value="Verdana">Verdana</SelectItem>
          </SelectContent>
        </Select>
        
        <Select onValueChange={(value) => formatSelection('fontSize', value)}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Taille" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">8px</SelectItem>
            <SelectItem value="2">10px</SelectItem>
            <SelectItem value="3">12px</SelectItem>
            <SelectItem value="4">14px</SelectItem>
            <SelectItem value="5">18px</SelectItem>
            <SelectItem value="6">24px</SelectItem>
            <SelectItem value="7">36px</SelectItem>
          </SelectContent>
        </Select>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-3">
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Couleur du texte</h4>
              <div className="grid grid-cols-5 gap-2">
                {colorOptions.map((option) => (
                  <div 
                    key={option.color}
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-200 flex items-center justify-center"
                    style={{ backgroundColor: option.color }}
                    onClick={() => applyTextColor(option.color)}
                    title={option.label}
                  >
                    {option.color === "#FFFFFF" && (
                      <div className="w-7 h-7 rounded-full border border-gray-300"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
        
        <Separator orientation="vertical" className="h-8" />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('bold')}
          className="h-8 w-8"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('italic')}
          className="h-8 w-8"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('underline')}
          className="h-8 w-8"
        >
          <Underline className="h-4 w-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-8" />
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('justifyLeft')}
          className="h-8 w-8"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('justifyCenter')}
          className="h-8 w-8"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        
        <Button 
          type="button" 
          variant="ghost" 
          size="icon" 
          onClick={() => formatSelection('justifyRight')}
          className="h-8 w-8"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Éditeur de contenu with placeholder handled via CSS */}
      <div 
        ref={editorRef}
        className={`min-h-[200px] border border-gray-300 p-3 rounded-b-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${isEmpty ? 'editor-empty' : ''}`}
        contentEditable={true}
        onInput={handleContentChange}
        onBlur={handleContentChange}
        onFocus={() => {
          if (isEmpty && editorRef.current) {
            editorRef.current.innerHTML = '';
          }
        }}
        data-placeholder={getPlaceholder()}
        style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
      />
      
      {/* CSS for the placeholder using standard style element */}
      <style dangerouslySetInnerHTML={{ __html: placeholderStyle }} />
      
      {/* Aperçu en direct */}
      <div className="mt-6">
        <Label>Aperçu</Label>
        <div className="border border-gray-300 rounded-md p-4 mt-2 min-h-[100px] bg-white">
          <div 
            dangerouslySetInnerHTML={{ __html: previewContent }}
            className="prose prose-sm max-w-none"
            style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}
          />
        </div>
      </div>
    </div>
  );
};

export default TextContentEditor;
