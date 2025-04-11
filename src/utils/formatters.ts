
/**
 * Format a phone number to display format
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
  }
  return phone;
};

/**
 * Truncate message for preview
 */
export const formatMessagePreview = (message: string): string => {
  return message.length > 35 ? message.substring(0, 35) + '...' : message;
};

/**
 * Format timestamp to relative time
 */
export const formatTimestamp = (timestamp: Date): string => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();
  const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    // Today: show time
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffDays === 1) {
    return 'Ontem';
  } else if (diffDays < 7) {
    // Days of the week
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    return days[timestamp.getDay()];
  } else {
    // Full date for older messages
    return timestamp.toLocaleDateString();
  }
};
