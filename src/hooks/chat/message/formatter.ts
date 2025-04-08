
// Funções para formatação e parsing de mensagens

export const parseResponse = (responseText: string): string => {
  try {
    // Checking if response is already a clean string without JSON structure
    if (typeof responseText === 'string' && !responseText.startsWith('{') && !responseText.startsWith('[')) {
      // If it's already a clean string, return it directly
      return responseText.trim();
    }
    
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
      
      // If it's an array of strings
      if (typeof jsonResponse[0] === 'string') {
        return jsonResponse.join('\n\n');
      }
    }
    
    // Handle single message object
    if (jsonResponse.message) {
      return jsonResponse.message;
    }
    
    // Check for 'content' field which is common in API responses
    if (jsonResponse.content) {
      return jsonResponse.content;
    }
    
    // Check for 'text' field which is also common
    if (jsonResponse.text) {
      return jsonResponse.text;
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
    
    // If it's a complex object and we couldn't extract a message,
    // convert it to a formatted string for display
    return JSON.stringify(jsonResponse, null, 2);
  } catch (e) {
    // Se não for JSON, retorna o texto original sem alterações
    return responseText;
  }
};
