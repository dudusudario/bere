
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useWhatsappIntegration = () => {
  const [isWhatsGWEnabled, setIsWhatsGWEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkWhatsappStatus = () => {
      try {
        const whatsgwEnabled = localStorage.getItem('whatsgw_enabled') === 'true';
        setIsWhatsGWEnabled(whatsgwEnabled);
      } catch (error) {
        console.error('Error checking WhatsApp status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkWhatsappStatus();
    
    // Listen for storage changes in case the status is updated in another tab
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'whatsgw_enabled') {
        setIsWhatsGWEnabled(e.newValue === 'true');
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    isWhatsGWEnabled,
    isLoading
  };
};
