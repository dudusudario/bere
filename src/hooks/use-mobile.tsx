
import { useEffect, useState } from "react";

export function useMobile(breakpoint: number = 768) {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar listener para resize
    window.addEventListener("resize", checkIfMobile);

    // Limpar listener
    return () => window.removeEventListener("resize", checkIfMobile);
  }, [breakpoint]);

  return isMobile;
}

// Add this alias for backwards compatibility
export const useIsMobile = useMobile;

export default useMobile;
