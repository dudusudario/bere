
// Funções utilitárias para mensagens

// Gera um identificador único para mensagens
export const generateId = (): string => {
  // Generate a proper UUID for compatibility with Supabase
  return crypto.randomUUID();
};
