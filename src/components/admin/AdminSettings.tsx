
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import AdminRequestsSettings from './AdminRequestsSettings';

// This component would contain all the settings sections
const AdminSettings = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Paramètres</h1>
      
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6 border-b w-full justify-start">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="requests">Demandes</TabsTrigger>
          <TabsTrigger value="appearance">Apparence</TabsTrigger>
          <TabsTrigger value="advanced">Avancé</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p>Paramètres généraux du site</p>
            {/* Contenu des paramètres généraux */}
          </div>
        </TabsContent>
        
        <TabsContent value="requests">
          <AdminRequestsSettings />
        </TabsContent>
        
        <TabsContent value="appearance">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p>Paramètres d'apparence</p>
            {/* Contenu des paramètres d'apparence */}
          </div>
        </TabsContent>
        
        <TabsContent value="advanced">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <p>Paramètres avancés</p>
            {/* Contenu des paramètres avancés */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
