import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookConfig from '@/components/admin/WebhookConfig';
// Add WhatsGwConfig import to the top of the file with other imports
import WhatsGwConfig from '@/components/admin/WhatsGwConfig';

const AdminPanel = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      
      <Tabs defaultValue="webhooks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="webhooks">Webhooks N8N</TabsTrigger>
          <TabsTrigger value="whatsgw">WhatsGW API</TabsTrigger>
        </TabsList>
        
        <TabsContent value="webhooks">
          <WebhookConfig />
        </TabsContent>
        
        <TabsContent value="whatsgw">
          <WhatsGwConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
