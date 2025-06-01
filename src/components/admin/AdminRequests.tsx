
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings } from 'lucide-react';
import RequestDetails from './RequestDetails';

interface AdminRequestsProps {
  requests: any[];
  activeRequest: any;
  onViewRequest: (request: any) => void;
  onCloseDetails: () => void;
  onOpenResponseDialog: () => void;
  onGeneratePDF: () => void;
  onDirectPDFDownload: () => void;
  onOpenTemplateManager: () => void;
}

const AdminRequests: React.FC<AdminRequestsProps> = ({
  requests,
  activeRequest,
  onViewRequest,
  onCloseDetails,
  onOpenResponseDialog,
  onGeneratePDF,
  onDirectPDFDownload,
  onOpenTemplateManager
}) => {
  const renderRequestList = (filteredRequests: any[]) => {
    if (filteredRequests.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          Aucune demande pour le moment
        </div>
      );
    }

    return (
      <div className="space-y-2 pb-4">
        {filteredRequests.map((request) => (
          <div 
            key={request.id} 
            className={`p-3 rounded-md cursor-pointer ${activeRequest?.id === request.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
            onClick={() => onViewRequest(request)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{request.fullName}</h4>
                <p className="text-sm text-gray-500">{request.destination}</p>
              </div>
              {request.type === 'quote' && (
                <Badge variant="outline" className="ml-2">
                  Devis
                </Badge>
              )}
              {request.type !== 'quote' && (
                <Badge variant="default" className="ml-2">
                  Réservation
                </Badge>
              )}
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                request.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                request.status === "traité" ? "bg-green-100 text-green-800" :
                request.status === "en attente" ? "bg-yellow-100 text-yellow-800" :
                "bg-gray-100 text-gray-800"
              }`}>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Demandes reçues</CardTitle>
              <CardDescription>
                Réservations et devis
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={onOpenTemplateManager}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Modèles de réponse</span>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all" className="px-6">
              <TabsList className="mb-4 w-full">
                <TabsTrigger value="all" className="flex-1">Toutes</TabsTrigger>
                <TabsTrigger value="reservations" className="flex-1">Réservations</TabsTrigger>
                <TabsTrigger value="quotes" className="flex-1">Devis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="max-h-[70vh] overflow-y-auto">
                {renderRequestList(requests)}
              </TabsContent>
              
              <TabsContent value="reservations" className="max-h-[70vh] overflow-y-auto">
                {renderRequestList(requests.filter(r => r.type !== 'quote'))}
              </TabsContent>
              
              <TabsContent value="quotes" className="max-h-[70vh] overflow-y-auto">
                {renderRequestList(requests.filter(r => r.type === 'quote'))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <RequestDetails 
          activeRequest={activeRequest}
          onCloseDetails={onCloseDetails}
          onOpenResponseDialog={onOpenResponseDialog}
          onGeneratePDF={onGeneratePDF}
          onDirectPDFDownload={onDirectPDFDownload}
        />
      </div>
    </div>
  );
};

export default AdminRequests;
