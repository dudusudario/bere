
import React from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { RefreshCw, Send } from 'lucide-react';

interface TestWebhookSectionProps {
  testReceiveWebhook: () => Promise<void>;
  handleSaveReceivingWebhook: () => void;
  testingReceiving: boolean;
  receivingWebhookUrl: string;
}

const TestWebhookSection: React.FC<TestWebhookSectionProps> = ({
  testReceiveWebhook,
  handleSaveReceivingWebhook,
  testingReceiving,
  receivingWebhookUrl
}) => {
  return (
    <CardFooter className="flex justify-between flex-col sm:flex-row gap-4">
      <Button 
        variant="outline"
        onClick={testReceiveWebhook}
        disabled={testingReceiving || !receivingWebhookUrl}
        className="w-full sm:w-auto"
      >
        {testingReceiving ? (
          <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Testando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Testar Recebimento (POST)
          </>
        )}
      </Button>
      
      <Button 
        onClick={handleSaveReceivingWebhook}
        disabled={!receivingWebhookUrl}
        className="w-full sm:w-auto"
      >
        Salvar Configuração
      </Button>
    </CardFooter>
  );
};

export default TestWebhookSection;
