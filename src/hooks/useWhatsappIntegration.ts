
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useWhatsappIntegration = () => {
  const [isWhatsGWEnabled, setIsWhatsGWEnabled] = useState(false);

  useEffect(() => {
    const whatsgwEnabled = localStorage.getItem('whatsgw_enabled') === 'true';
    setIsWhatsGWEnabled(whatsgwEnabled);
  }, []);

  return {
    isWhatsGWEnabled
  };
};
