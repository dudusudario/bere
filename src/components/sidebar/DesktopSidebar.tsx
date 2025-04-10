
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import * as motion from 'motion';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { menuItems } from './menu-items';
import { handleLogout } from './sidebar-utils';

export function DesktopSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen, animate } = useSidebar();

  // Check if the current path matches the route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.div
      className="h-full hidden md:flex flex-col bg-sidebar text-sidebar-foreground border-r"
      animate={{
        width: open ? "16rem" : "4.5rem",
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <motion.div
          animate={{
            opacity: open ? 1 : 0,
            width: open ? 'auto' : 0,
          }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden whitespace-nowrap"
        >
          <h2 className="text-xl font-bold text-primary">Berenice</h2>
        </motion.div>
      </div>
      
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => (
            <div 
              key={item.path}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors cursor-pointer group/sidebar",
                isActive(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground hover:bg-primary/5"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <motion.div
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? 'auto' : 0,
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                <span className="text-sm group-hover/sidebar:translate-x-1 transition-transform duration-150">
                  {item.title}
                </span>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t">
        <div 
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/5 transition-colors cursor-pointer group/sidebar"
          onClick={() => handleLogout(navigate)}
        >
          <LogOut className="h-5 w-5" />
          <motion.div
            animate={{
              opacity: open ? 1 : 0,
              width: open ? 'auto' : 0,
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            <span className="text-sm group-hover/sidebar:translate-x-1 transition-transform duration-150">
              Sair
            </span>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
