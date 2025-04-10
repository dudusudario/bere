
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const N8N_WEBHOOK_URL = "https://en8n.berenice.ai/webhook/c0ec8656-3e32-49ab-a5a3-33053921db0e";

interface SendMessageParams {
  username: string;
  numero: string;
  mensagem: string;
}

export const sendToN8n = async ({ username, numero, mensagem }: SendMessageParams): Promise<boolean> => {
  try {
    // Validate required fields
    if (!numero || !mensagem) {
      toast.error("Número e mensagem são obrigatórios");
      return false;
    }

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user: username,
        numero,
        mensagem,
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    // Also save the sent message to our Supabase database
    await saveMessageToSupabase({
      username,
      numero,
      mensagem,
      origem: 'user'
    });

    return true;
  } catch (error) {
    console.error('Error sending message to n8n:', error);
    toast.error("Erro ao enviar mensagem para o agente");
    return false;
  }
};

interface SaveMessageParams {
  username: string;
  numero: string;
  mensagem: string;
  origem: 'user' | 'agent';
}

export const saveMessageToSupabase = async ({ username, numero, mensagem, origem }: SaveMessageParams): Promise<boolean> => {
  try {
    // Insert the message into the user_menssagens table
    const { error } = await supabase
      .from('user_menssagens' as any)
      .insert({
        username,
        numero,
        mensagem,
        origem,
      });

    if (error) {
      throw error;
    }

    return true;
  } catch (error) {
    console.error('Error saving message to Supabase:', error);
    return false;
  }
};
