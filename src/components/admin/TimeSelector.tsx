
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TimeSelectorProps {
  onChange: (value: string) => void;
  value: string;
  day: string;
}

const TimeSelector: React.FC<TimeSelectorProps> = ({ onChange, value, day }) => {
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0') + ':00'
  );

  const [openTime, closeTime] = value.split('-').map(t => t.trim());

  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 items-center">
      <Label>{day}</Label>
      <div className="flex items-center gap-2">
        <Select value={openTime} onValueChange={(v) => onChange(`${v}-${closeTime}`)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Ouverture" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>-</span>
        <Select value={closeTime} onValueChange={(v) => onChange(`${openTime}-${v}`)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Fermeture" />
          </SelectTrigger>
          <SelectContent>
            {hours.map((hour) => (
              <SelectItem key={hour} value={hour}>
                {hour}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TimeSelector;
