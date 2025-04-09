
import React from 'react';
import { Globe } from 'lucide-react';

interface IntegrationInstructionsProps {
  receivingWebhookUrl: string;
}

const IntegrationInstructions: React.FC<IntegrationInstructionsProps> = ({ receivingWebhookUrl }) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-1">Envio de Mensagens (já configurado)</h3>
        <p className="text-sm text-muted-foreground">
          O sistema já está configurado para enviar mensagens para o webhook do N8N.
        </p>
      </div>
      
      <div>
        <h3 className="font-semibold mb-1">Recebimento de Mensagens (IMPORTANTE)</h3>
        <p className="text-sm text-muted-foreground">
          Para receber respostas do N8N, configure uma requisição HTTP POST
          para a URL abaixo. A mensagem deve estar no formato:
        </p>
        <pre className="bg-muted p-2 rounded my-2 text-xs overflow-x-auto">
{`POST ${receivingWebhookUrl}
Content-Type: application/json

{
  "message": "Conteúdo da mensagem a ser exibida no chat"
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
            <li>URL: {receivingWebhookUrl}</li>
            <li>Tipo de conteúdo: JSON</li>
            <li>Corpo: {"{ \"message\": \"Sua resposta aqui\" }"}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default IntegrationInstructions;
