
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Message } from '../types';

// Salvar e manipular mensagens no banco de dados

export const saveFavoriteStatus = async (messageId: string, isFavorite: boolean): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('message_history')
      .update({ is_favorite: isFavorite } as any)
      .eq('id', messageId);
    
    if (error) {
      console.error('Error updating favorite status:', error);
      toast.error("Erro ao atualizar status de favorito");
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in toggling favorite:', err);
    return false;
  }
};

export const saveMessage = async (message: Message, userPhone?: string): Promise<boolean> => {
  if (!userPhone) return false;
  
  try {
    // Convert files to a JSON structure if they exist
    let filesJson = null;
    if (message.files && message.files.length > 0) {
      filesJson = message.files.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }));
    }
    
    const { error } = await supabase
      .from('message_history')
      .insert({
        id: message.id,
        user_phone: userPhone,
        content: message.content,
        sender: message.sender,
        is_favorite: message.isFavorite,
        files: filesJson
      } as any);
    
    if (error) {
      console.error('Error saving message to history:', error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in saving message to history:', err);
    return false;
  }
};

export const deleteMessageFromDb = async (messageId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('message_history')
      .delete()
      .eq('id', messageId);
    
    if (error) {
      console.error('Error deleting message:', error);
      toast.error("Erro ao apagar mensagem");
      return false;
    }
    
    return true;
  } catch (err) {
    console.error('Error in deleting message:', err);
    toast.error("Erro ao apagar mensagem");
    return false;
  }
};
