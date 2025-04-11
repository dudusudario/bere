
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// WhatsGW API configuration
const WHATSGW_API_BASE_URL = 'https://api.whatsgw.com.br'; 
const WHATSGW_API_KEY = 'e2fb8f7d-9d74-4665-8e08-678cde37a0c1'; // A chave API que você forneceu

interface SendMessageParams {
  number: string;
  message: string;
  files?: File[];
}

// Function to send a message via WhatsGW API
export const sendWhatsAppMessage = async ({ number, message, files }: SendMessageParams): Promise<boolean> => {
  try {
    // Normalize phone number (remove non-numeric characters)
    const normalizedNumber = number.replace(/\D/g, '');
    
    // Create form data for the request
    const formData = new FormData();
    formData.append('number', normalizedNumber);
    formData.append('message', message);
    
    // Add files if available
    if (files && files.length > 0) {
      files.forEach(file => {
        formData.append('files', file);
      });
    }
    
    // Make API request
    const response = await fetch(`${WHATSGW_API_BASE_URL}/send-message`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${WHATSGW_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Error sending WhatsApp message: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Log success and save message to database
    console.log('WhatsApp message sent successfully:', data);
    
    // Save the sent message to our database
    await saveMessageToDatabase({
      phoneNumber: normalizedNumber,
      message,
      direction: 'outgoing',
      status: 'sent',
      timestamp: new Date().toISOString(),
    });
    
    return true;
  } catch (error) {
    console.error('Failed to send WhatsApp message:', error);
    toast.error('Falha ao enviar mensagem pelo WhatsApp');
    return false;
  }
};

// Function to receive webhooks from WhatsGW API
export const handleWhatsGwWebhook = async (webhookData: any): Promise<void> => {
  try {
    const { 
      fromNumber, 
      message, 
      messageId,
      timestamp,
      media = [] 
    } = webhookData;
    
    console.log('Received WhatsGW webhook:', webhookData);
    
    // Save the received message to database
    await saveMessageToDatabase({
      phoneNumber: fromNumber,
      message,
      messageId,
      direction: 'incoming',
      status: 'received',
      media,
      timestamp: timestamp || new Date().toISOString(),
    });
    
    // You can emit an event or update UI here to show new messages
  } catch (error) {
    console.error('Error handling WhatsGW webhook:', error);
  }
};

// Helper function to save messages to database
interface MessageData {
  phoneNumber: string;
  message: string;
  messageId?: string;
  direction: 'incoming' | 'outgoing';
  status: string;
  media?: any[];
  timestamp: string;
}

async function saveMessageToDatabase(data: MessageData): Promise<void> {
  try {
    // Store message in the user_menssagens table which already exists
    const { error } = await supabase
      .from('user_menssagens')
      .insert({
        numero: data.phoneNumber,
        mensagem: data.message,
        origem: data.direction === 'incoming' ? 'user' : 'assistant',
        timestamp: data.timestamp
      });
      
    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error saving message to database:', error);
  }
}

// Function to initialize webhooks
export const setupWhatsGwWebhooks = (callbackUrl: string): void => {
  console.log(`WhatsGW webhooks should be set to: ${callbackUrl}`);
  // In a real implementation, you would register this callback URL with the WhatsGW API
  // This typically requires an API call to WhatsGW's webhook registration endpoint
};

// Function to fetch message history for a specific contact
export const fetchWhatsAppMessageHistory = async (phoneNumber: string): Promise<any[]> => {
  try {
    // Use the existing user_menssagens table to fetch messages
    const { data, error } = await supabase
      .from('user_menssagens')
      .select('*')
      .eq('numero', phoneNumber)
      .order('timestamp', { ascending: true });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching WhatsApp message history:', error);
    return [];
  }
};
