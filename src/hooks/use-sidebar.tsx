
import React, { createContext, useContext, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type SidebarContextType = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isMobile: boolean;
  toggleSidebar: () => void;
  animate: boolean;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}

interface SidebarProviderProps {
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  style?: React.CSSProperties;
  animate?: boolean;
}

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  className,
  style,
  animate = true,
}: SidebarProviderProps) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(defaultOpen && !isMobile);

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    isMobile,
    toggleSidebar,
    animate,
  }), [open, isMobile, toggleSidebar, animate]);

  return (
    <SidebarContext.Provider value={contextValue}>
      <div
        style={{
          ...style,
        }}
        className={className}
      >
        {children}
      </div>
    </SidebarContext.Provider>
  );
};
