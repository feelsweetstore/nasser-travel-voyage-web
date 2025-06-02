
import React, { useState, useEffect } from 'react';
import { User, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ClientAreaService from '@/services/ClientAreaService';

const EditableProfile = () => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    email: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    country: ''
  });
  const [originalData, setOriginalData] = useState(profileData);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const profile = await ClientAreaService.getUserProfile();
      const fullProfile = {
        email: profile.email || '',
        name: profile.name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        country: profile.country || 'Tchad'
      };
      setProfileData(fullProfile);
      setOriginalData(fullProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await ClientAreaService.updateUserProfile(profileData);
      setOriginalData(profileData);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData(originalData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5" />
          Mon profil
        </h3>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            Modifier
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
          />
        </div>

        <div>
          <Label htmlFor="name">Nom complet</Label>
          <Input
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
          />
        </div>

        <div>
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            name="phone"
            value={profileData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
          />
        </div>

        <div>
          <Label htmlFor="address">Adresse</Label>
          <Input
            id="address"
            name="address"
            value={profileData.address}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
            placeholder="Votre adresse complète"
          />
        </div>

        <div>
          <Label htmlFor="city">Ville</Label>
          <Input
            id="city"
            name="city"
            value={profileData.city}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
            placeholder="Votre ville"
          />
        </div>

        <div>
          <Label htmlFor="country">Pays</Label>
          <Input
            id="country"
            name="country"
            value={profileData.country}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={!isEditing ? "bg-gray-100" : ""}
          />
        </div>

        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Save className="h-4 w-4 mr-2 animate-spin" />
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditableProfile;
