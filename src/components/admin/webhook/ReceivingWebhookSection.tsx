
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { 
  Copy, Check, Globe, RefreshCw, ArrowRight, AlertTriangle, Code 
} from 'lucide-react';

interface ReceivingWebhookSectionProps {
  receivingWebhookUrl: string;
  setReceivingWebhookUrl: (url: string) => void;
  generateNewReceivingUrl: () => void;
  testWebhookAccessibility: () => Promise<void>;
  testingWebhookAccess: boolean;
}

const ReceivingWebhookSection: React.FC<ReceivingWebhookSectionProps> = ({
  receivingWebhookUrl,
  setReceivingWebhookUrl,
  generateNewReceivingUrl,
  testWebhookAccessibility,
  testingWebhookAccess
}) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(receivingWebhookUrl);
    setCopied(true);
    toast.success("URL copiada para a área de transferência");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="receivingWebhookUrl" className="flex items-center gap-2 text-primary font-semibold">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-webhook"><path d="M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2"/><path d="m6 17 3.13-5.78c.53-.97.43-2.21-.26-3.07A4.01 4.01 0 0 1 22 8.92"/><path d="m12 8-3.13 5.73C8.34 14.7 8.44 15.94 9.13 16.8A4 4 0 0 1 2 19"/></svg>
        URL para Receber Mensagens (COPIE ESTA URL)
      </Label>
      <div className="flex space-x-2">
        <div className="relative flex-1">
          <Input
            id="receivingWebhookUrl"
            value={receivingWebhookUrl}
            onChange={(e) => setReceivingWebhookUrl(e.target.value)}
            placeholder="https://seu-servidor/api/webhook"
            className="font-mono text-sm pr-10"
          />
          <Button 
            type="button"
            variant="ghost" 
            size="icon"
            className="absolute right-0 top-0 h-full"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={generateNewReceivingUrl}
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Gerar URL
        </Button>
      </div>
      
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
        <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" /> Importante: Esta URL deve estar publicamente acessível!
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
          Para receber mensagens, garanta que esta URL esteja publicada e acessível na internet. Use serviços
          como Vercel, Netlify ou similares para hospedar seu endpoint de webhook.
        </p>
      </div>
      
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={testWebhookAccessibility}
          disabled={testingWebhookAccess}
        >
          {testingWebhookAccess ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> Testando acessibilidade...
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" /> Verificar acessibilidade do webhook
            </>
          )}
        </Button>
      </div>
      
      <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
        <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
          <ArrowRight className="h-4 w-4" /> O que fazer com esta URL:
        </h4>
        <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
          <span className="font-semibold">IMPORTANTE:</span> Copie esta URL e configure-a no N8N como o endpoint 
          para onde as respostas devem ser enviadas.
        </p>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-md p-3 mt-3">
        <h4 className="font-medium flex items-center gap-1">
          <Code className="h-4 w-4" /> Exemplo de código para enviar mensagens para o webhook (POST):
        </h4>
        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-2 mt-2 rounded overflow-x-auto">
{`fetch("${receivingWebhookUrl}", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    message: "Sua mensagem aqui",
    sender: "ai",
    timestamp: "${new Date().toISOString()}"
  })
})`}
        </pre>
      </div>
    </div>
  );
};

export default ReceivingWebhookSection;
