
import React from 'react';
import ResponseTemplateEditor from './content/ResponseTemplateEditor';

const AdminRequestsSettings = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Paramètres des demandes</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-6">
        <ResponseTemplateEditor />
      </div>
    </div>
  );
};

export default AdminRequestsSettings;
