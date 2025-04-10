
import React, { createContext, useContext, useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SidebarProvider = ({
  children,
  defaultOpen = true,
  className,
  style,
  animate = true,
  open: openProp,
  setOpen: setOpenProp,
}: SidebarProviderProps) => {
  const isMobile = useIsMobile();
  const [openState, setOpenState] = useState(defaultOpen && !isMobile);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  const toggleSidebar = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, [setOpen]);

  const contextValue = React.useMemo(() => ({
    open,
    setOpen,
    isMobile,
    toggleSidebar,
    animate,
  }), [open, setOpen, isMobile, toggleSidebar, animate]);

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
