
// Funções para formatação e parsing de mensagens

export const parseResponse = (responseText: string): string => {
  try {
    // Tenta parsear como JSON
    const jsonResponse = JSON.parse(responseText);
    
    // Handle array of messages (fractional messages)
    if (Array.isArray(jsonResponse) && jsonResponse.length > 0) {
      // Check if we have message objects with message property
      if (jsonResponse[0].message !== undefined) {
        // Join all messages, preserving formatting without JSON
        return jsonResponse
          .map(item => item.message)
          .filter(msg => msg) // Filter out any undefined/null/empty messages
          .join('\n\n');
      }
    }
    
    // Handle single message object
    if (jsonResponse.message) {
      return jsonResponse.message;
    }
    
    // Se o JSON não tem o formato esperado mas parece ser uma string,
    // retorna o texto diretamente se for uma propriedade do objeto
    if (typeof jsonResponse === 'object') {
      // Tenta encontrar a primeira propriedade string no objeto
      const firstStringValue = Object.values(jsonResponse).find(
        value => typeof value === 'string'
      );
      
      if (firstStringValue) {
        return firstStringValue;
      }
    }
    
    // Se for uma string simples no JSON, retorna ela diretamente
    if (typeof jsonResponse === 'string') {
      return jsonResponse;
    }
    
    // Em último caso, retorna o texto original
    return responseText;
  } catch (e) {
    // Se não for JSON, retorna o texto original sem alterações
    return responseText;
  }
};
