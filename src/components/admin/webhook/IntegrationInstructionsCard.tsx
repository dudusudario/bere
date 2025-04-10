
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe } from 'lucide-react';

interface IntegrationInstructionsCardProps {
  sendingWebhookUrl: string;
  receivingWebhookUrl: string;
}

const IntegrationInstructionsCard: React.FC<IntegrationInstructionsCardProps> = ({
  sendingWebhookUrl,
  receivingWebhookUrl
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Instruções de Integração</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Envio de Mensagens (já configurado)</h3>
            <p className="text-sm text-muted-foreground">
              O sistema já está configurado para enviar mensagens para o webhook do N8N.
              Mensagens enviadas pelo usuário são encaminhadas para: <code className="bg-muted px-1 rounded">{sendingWebhookUrl}</code>
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Recebimento de Mensagens (IMPORTANTE)</h3>
            <p className="text-sm text-muted-foreground">
              Para receber respostas do N8N, configure uma requisição HTTP POST
              para a URL acima. A mensagem deve estar no formato:
            </p>
            <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`{
  "message": "Conteúdo da mensagem a ser exibida no chat",
  "sender": "ai",
  "timestamp": "2025-04-10T00:12:13.187-03:00"
}`}
            </pre>
            <div className="bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-md p-3 mt-3">
              <h4 className="font-medium text-amber-800 dark:text-amber-300 flex items-center gap-1">
                <Globe className="h-4 w-4" /> Configuração no N8N
              </h4>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                No seu fluxo N8N, adicione um nó HTTP Request com estas configurações:
              </p>
              <ul className="list-disc list-inside text-xs text-amber-700 dark:text-amber-400 mt-1 space-y-1">
                <li>Método: POST</li>
                <li>URL: {receivingWebhookUrl || '[Gere uma URL acima]'}</li>
                <li>Tipo de conteúdo: JSON</li>
                <li>Envie a resposta formatada conforme o exemplo acima</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationInstructionsCard;
