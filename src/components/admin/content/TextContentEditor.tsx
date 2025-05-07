
import React, { useState } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface TextContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  type: string;
}

interface TextStyle {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  fontStyle: string;
  textDecoration: string;
  textAlign: string;
}

const parseStyleString = (content: string): { text: string, style: TextStyle } => {
  // Format: <!--style:{"fontFamily":"Arial",...}-->Content text
  const styleRegex = /<!--style:(.*?)-->([\s\S]*)/;
  const match = content.match(styleRegex);
  
  const defaultStyle = {
    fontFamily: 'Arial',
    fontSize: '16px',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    textAlign: 'left'
  };
  
  if (match && match[1] && match[2]) {
    try {
      const style = JSON.parse(match[1]);
      return { text: match[2], style: { ...defaultStyle, ...style } };
    } catch (e) {
      console.error("Error parsing style JSON:", e);
    }
  }
  
  return { text: content, style: defaultStyle };
};

const generateStyleString = (text: string, style: TextStyle): string => {
  return `<!--style:${JSON.stringify(style)}-->${text}`;
};

const TextContentEditor: React.FC<TextContentEditorProps> = ({ 
  content, 
  onContentChange,
  type
}) => {
  const { text, style } = parseStyleString(content);
  const [textContent, setTextContent] = useState(text);
  const [textStyle, setTextStyle] = useState<TextStyle>(style);
  
  const updateContent = (newText: string, newStyle?: TextStyle) => {
    const updatedText = newText ?? textContent;
    const updatedStyle = newStyle ?? textStyle;
    const formattedContent = generateStyleString(updatedText, updatedStyle);
    onContentChange(formattedContent);
    setTextContent(updatedText);
    if (newStyle) setTextStyle(newStyle);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextContent(e.target.value);
    updateContent(e.target.value);
  };
  
  const updateStyle = (property: keyof TextStyle, value: string) => {
    const newStyle = { ...textStyle, [property]: value };
    setTextStyle(newStyle);
    updateContent(null, newStyle);
  };
  
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

  return (
    <div className="grid gap-4">
      <div className="bg-gray-100 p-3 rounded-md">
        <div className="flex flex-wrap gap-2 mb-2">
          <Select 
            value={textStyle.fontFamily} 
            onValueChange={(value) => updateStyle('fontFamily', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Police" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Helvetica">Helvetica</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            value={textStyle.fontSize} 
            onValueChange={(value) => updateStyle('fontSize', value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Taille" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12px">12px</SelectItem>
              <SelectItem value="14px">14px</SelectItem>
              <SelectItem value="16px">16px</SelectItem>
              <SelectItem value="18px">18px</SelectItem>
              <SelectItem value="20px">20px</SelectItem>
              <SelectItem value="24px">24px</SelectItem>
              <SelectItem value="28px">28px</SelectItem>
              <SelectItem value="32px">32px</SelectItem>
            </SelectContent>
          </Select>
          
          <Toggle 
            pressed={textStyle.fontWeight === 'bold'} 
            onPressedChange={(pressed) => updateStyle('fontWeight', pressed ? 'bold' : 'normal')}
            aria-label="Gras"
          >
            <Bold className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            pressed={textStyle.fontStyle === 'italic'} 
            onPressedChange={(pressed) => updateStyle('fontStyle', pressed ? 'italic' : 'normal')}
            aria-label="Italique"
          >
            <Italic className="h-4 w-4" />
          </Toggle>
          
          <Toggle 
            pressed={textStyle.textDecoration === 'underline'} 
            onPressedChange={(pressed) => updateStyle('textDecoration', pressed ? 'underline' : 'none')}
            aria-label="Souligné"
          >
            <Underline className="h-4 w-4" />
          </Toggle>
          
          <div className="flex border rounded-md overflow-hidden">
            <Toggle 
              pressed={textStyle.textAlign === 'left'} 
              onPressedChange={() => updateStyle('textAlign', 'left')}
              aria-label="Aligné à gauche"
              className="rounded-none border-r"
            >
              <AlignLeft className="h-4 w-4" />
            </Toggle>
            
            <Toggle 
              pressed={textStyle.textAlign === 'center'} 
              onPressedChange={() => updateStyle('textAlign', 'center')}
              aria-label="Centré"
              className="rounded-none border-r"
            >
              <AlignCenter className="h-4 w-4" />
            </Toggle>
            
            <Toggle 
              pressed={textStyle.textAlign === 'right'} 
              onPressedChange={() => updateStyle('textAlign', 'right')}
              aria-label="Aligné à droite"
              className="rounded-none"
            >
              <AlignRight className="h-4 w-4" />
            </Toggle>
          </div>
        </div>
      </div>
      
      <div className="grid gap-2">
        <Label htmlFor="content">Contenu</Label>
        <Textarea
          id="content"
          value={textContent}
          onChange={handleTextChange}
          placeholder={getPlaceholder()}
          rows={8}
          className="whitespace-pre-wrap"
        />
      </div>
      
      <div className="mt-2 p-3 border rounded-md">
        <Label className="block mb-2 text-sm">Aperçu</Label>
        <div className="p-3 bg-white border rounded-md min-h-[100px]">
          <pre 
            className="whitespace-pre-wrap"
            style={{
              fontFamily: textStyle.fontFamily,
              fontSize: textStyle.fontSize,
              fontWeight: textStyle.fontWeight,
              fontStyle: textStyle.fontStyle,
              textDecoration: textStyle.textDecoration,
              textAlign: textStyle.textAlign as any
            }}
          >
            {textContent}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TextContentEditor;
