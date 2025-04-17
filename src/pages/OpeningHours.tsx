
import React from 'react';
import ContentService from '../services/ContentService';
import { Clock } from 'lucide-react';

const OpeningHours = () => {
  const hoursContent = ContentService.getContentByTypeAndCategory('hours', 'footer')[0]?.content || '';
  const hours = hoursContent.split('\n');

  return (
    <main className="bg-white py-16">
      <div className="container-custom">
        <h1 className="text-4xl font-heading font-bold mb-8 text-center">Heures d'ouverture</h1>
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8">
          <div className="flex items-center justify-center mb-6">
            <Clock className="w-12 h-12 text-nasser-primary" />
          </div>
          <div className="space-y-4">
            {hours.map((day, index) => {
              const [dayName, time] = day.split(': ');
              return (
                <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2">
                  <span className="font-medium text-gray-700">{dayName}</span>
                  <span className="text-gray-600">{time}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OpeningHours;
