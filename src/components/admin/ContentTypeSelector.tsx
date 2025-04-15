
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTypeOptions } from './utils/formUtils';

interface ContentTypeSelectorProps {
  page: string;
  type: string;
  onTypeChange: (value: string) => void;
}

export const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({
  page,
  type,
  onTypeChange
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="type">Type de contenu</Label>
      <Select value={type} onValueChange={onTypeChange}>
        <SelectTrigger id="type">
          <SelectValue placeholder="Type de contenu" />
        </SelectTrigger>
        <SelectContent>
          {getTypeOptions(page).map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

