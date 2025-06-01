
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

interface AdminSettingsProps {
  onlineReservation: boolean;
  clientAreaEnabled: boolean;
  testimonialsEnabled: boolean;
  isLoading: boolean;
  onReservationToggle: () => void;
  onClientAreaToggle: () => void;
  onTestimonialsToggle: () => void;
}

const AdminSettings: React.FC<AdminSettingsProps> = ({
  onlineReservation,
  clientAreaEnabled,
  testimonialsEnabled,
  isLoading,
  onReservationToggle,
  onClientAreaToggle,
  onTestimonialsToggle
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Paramètres généraux</CardTitle>
        <CardDescription>
          Activez ou désactivez les fonctionnalités du site
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Réservation en ligne</h3>
              <p className="text-sm text-gray-500">Permet aux clients de réserver directement en ligne</p>
            </div>
            <Switch 
              checked={onlineReservation} 
              onCheckedChange={onReservationToggle}
              disabled={isLoading}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Espace client</h3>
              <p className="text-sm text-gray-500">Activer l'espace client</p>
            </div>
            <Switch 
              checked={clientAreaEnabled}
              onCheckedChange={onClientAreaToggle}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Témoignages</h3>
              <p className="text-sm text-gray-500">Activer la section témoignages</p>
            </div>
            <Switch 
              checked={testimonialsEnabled}
              onCheckedChange={onTestimonialsToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSettings;
