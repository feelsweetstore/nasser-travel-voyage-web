
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TimeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const TimeSelector: React.FC<TimeSelectorProps> = ({ value, onChange }) => {
  // Convertir le format texte actuel en objet pour faciliter la manipulation
  const timesByDay = value.split('\n').reduce((acc, line) => {
    const [day, times] = line.split(': ');
    if (day && times) {
      acc[day] = times;
    }
    return acc;
  }, {} as Record<string, string>);

  const days = [
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
    'Dimanche'
  ];

  const timeOptions = [
    'Fermé',
    '08:00-18:00',
    '08:00-17:00',
    '08:00-16:00',
    '09:00-18:00',
    '09:00-17:00',
    '09:00-16:00',
    '09:00-13:00',
    '10:00-18:00',
    '10:00-17:00',
    '10:00-16:00'
  ];

  const handleTimeChange = (day: string, time: string) => {
    const newTimesByDay = { ...timesByDay, [day]: time };
    const formattedHours = days
      .map(d => `${d}: ${newTimesByDay[d] || 'Fermé'}`)
      .join('\n');
    onChange(formattedHours);
  };

  return (
    <div className="space-y-4">
      {days.map((day) => (
        <div key={day} className="flex items-center gap-4">
          <span className="w-24">{day}:</span>
          <Select
            value={timesByDay[day] || 'Fermé'}
            onValueChange={(time) => handleTimeChange(day, time)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};
