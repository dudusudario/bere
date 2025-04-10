
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/hooks/use-sidebar';
import { Button } from '@/components/ui/button';
import { menuItems } from './menu-items';
import { handleLogout } from './sidebar-utils';

export function MobileSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen, toggleSidebar } = useSidebar();
  
  // Check if the current path matches the route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-background border-b">
        <h2 className="text-xl font-bold text-primary">Berenice</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {open && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setOpen(false)}
          />
          
          <div
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-sidebar p-4 z-50 flex flex-col md:hidden"
            style={{ 
              transform: 'translateX(0)',
              transition: 'transform 0.3s ease-in-out'
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-primary">Berenice</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <div 
                    key={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-3 transition-colors cursor-pointer",
                      isActive(item.path) 
                        ? "bg-primary/10 text-primary" 
                        : "text-sidebar-foreground hover:bg-primary/5"
                    )}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="pt-4 border-t mt-6">
              <div 
                className="flex items-center gap-3 rounded-md px-4 py-3 hover:bg-primary/5 transition-colors cursor-pointer"
                onClick={() => handleLogout(navigate)}
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
