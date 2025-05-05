
import React from 'react';
import { Label } from "@/components/ui/label";
import TimeSelector from '../TimeSelector';

interface HoursContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const HoursContentEditor: React.FC<HoursContentEditorProps> = ({ 
  content, 
  onContentChange 
}) => {
  const handleTimeChange = (day: string, time: string) => {
    const hours = content.split('\n');
    const dayIndex = hours.findIndex(h => h.startsWith(day));
    
    if (dayIndex !== -1) {
      hours[dayIndex] = `${day}: ${time}`;
      onContentChange(hours.join('\n'));
    }
  };

  const getTimeForDay = (day: string): string => {
    if (!content) return '08:00-18:00';
    const hours = content.split('\n');
    const dayLine = hours.find(h => h.startsWith(day));
    if (!dayLine) return '08:00-18:00';
    const time = dayLine.split(': ')[1];
    return time || '08:00-18:00';
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="content">Heures d'ouverture</Label>
      <div className="space-y-4">
        {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map((day) => (
          <TimeSelector
            key={day}
            day={day}
            value={getTimeForDay(day)}
            onChange={(time) => handleTimeChange(day, time)}
          />
        ))}
      </div>
    </div>
  );
};

export default HoursContentEditor;
