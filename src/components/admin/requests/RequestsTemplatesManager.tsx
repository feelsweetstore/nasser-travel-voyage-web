
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import ResponseTemplatesTab from './ResponseTemplatesTab';

// Ce composant sera intégré dans l'onglet "Demandes" du tableau de bord administrateur
const RequestsTemplatesManager = () => {
  const [activeTab, setActiveTab] = useState('requests');
  
  return (
    <div className="w-full">
      <Tabs 
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="templates">Modèles de réponse</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests">
          {/* Intégration du composant de gestion des demandes existant */}
          <div className="text-sm text-gray-500 p-4">
            Gestionnaire de demandes
          </div>
        </TabsContent>
        
        <TabsContent value="templates">
          <ResponseTemplatesTab />
        </TabsContent>
        
        <TabsContent value="history">
          <div className="text-sm text-gray-500 p-4">
            Historique des demandes traitées
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RequestsTemplatesManager;
