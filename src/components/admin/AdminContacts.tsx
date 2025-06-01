
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactDetails from './ContactDetails';

interface AdminContactsProps {
  contactMessages: any[];
  activeContactMessage: any;
  onViewContactMessage: (message: any) => void;
  onCloseContactDetails: () => void;
  onOpenContactResponseDialog: () => void;
  onContactPDFDownload: () => void;
}

const AdminContacts: React.FC<AdminContactsProps> = ({
  contactMessages,
  activeContactMessage,
  onViewContactMessage,
  onCloseContactDetails,
  onOpenContactResponseDialog,
  onContactPDFDownload
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Messages de contact</CardTitle>
            <CardDescription>
              Demandes et messages reçus via le formulaire de contact
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="px-6">
              <div className="max-h-[70vh] overflow-y-auto">
                {contactMessages.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Aucun message pour le moment
                  </div>
                ) : (
                  <div className="space-y-2 pb-4">
                    {contactMessages.map((message) => (
                      <div 
                        key={message.id} 
                        className={`p-3 rounded-md cursor-pointer ${activeContactMessage?.id === message.id ? 'bg-nasser-primary/10 border-l-4 border-nasser-primary' : 'hover:bg-gray-100'}`}
                        onClick={() => onViewContactMessage(message)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{message.name}</h4>
                            <p className="text-sm text-gray-500">{message.subject || 'Sans objet'}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            message.status === "nouveau" ? "bg-blue-100 text-blue-800" :
                            message.status === "traité" ? "bg-green-100 text-green-800" :
                            message.status === "lu" ? "bg-gray-100 text-gray-800" :
                            "bg-gray-100 text-gray-800"
                          }`}>
                            {message.status.charAt(0).toUpperCase() + message.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="md:col-span-2">
        <ContactDetails 
          activeContactMessage={activeContactMessage}
          onCloseContactDetails={onCloseContactDetails}
          onOpenContactResponseDialog={onOpenContactResponseDialog}
          onContactPDFDownload={onContactPDFDownload}
        />
      </div>
    </div>
  );
};

export default AdminContacts;
