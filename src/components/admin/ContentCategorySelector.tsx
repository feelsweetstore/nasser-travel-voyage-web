
import React from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getCategoryOptions } from './utils/formUtils';

interface ContentCategorySelectorProps {
  page: string;
  category: string;
  onCategoryChange: (value: string) => void;
}

export const ContentCategorySelector: React.FC<ContentCategorySelectorProps> = ({
  page,
  category,
  onCategoryChange
}) => {
  return (
    <div className="grid gap-2">
      <Label htmlFor="category">Catégorie</Label>
      <Select value={category} onValueChange={onCategoryChange}>
        <SelectTrigger id="category">
          <SelectValue placeholder="Catégorie" />
        </SelectTrigger>
        <SelectContent>
          {getCategoryOptions(page).map(option => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

