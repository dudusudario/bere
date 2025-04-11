
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

export const useWhatsGwStatus = () => {
  const [isWhatsGwEnabled, setIsWhatsGwEnabled] = useState(false);

  useEffect(() => {
    // Check if WhatsGW is enabled from localStorage
    const whatsgwEnabled = localStorage.getItem('whatsgw_enabled') === 'true';
    setIsWhatsGwEnabled(whatsgwEnabled);

    if (!whatsgwEnabled) {
      toast({
        title: "WhatsGW não configurado",
        description: "Configure o WhatsGW no painel de administração para habilitar funcionalidades do WhatsApp.",
        variant: "destructive"
      });
    }
  }, []);

  return { isWhatsGwEnabled };
};
