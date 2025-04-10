
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User, LogOut, Settings, Menu, X } from 'lucide-react';
import * as motion from 'motion';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useSidebar } from '@/hooks/use-sidebar';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { open, setOpen, isMobile, toggleSidebar } = useSidebar();
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: 'Logout realizado',
        description: 'Você foi desconectado com sucesso.',
      });
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer logout',
        description: 'Ocorreu um erro. Tente novamente.',
      });
    }
  };

  // Check if the current path matches the route
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  // Menu items configuration
  const menuItems = [
    { 
      title: 'Página Inicial', 
      path: '/dashboard', 
      icon: <Home className="h-5 w-5" /> 
    },
    { 
      title: 'Chat', 
      path: '/chat', 
      icon: <MessageCircle className="h-5 w-5" /> 
    },
    { 
      title: 'Perfil', 
      path: '/profile', 
      icon: <User className="h-5 w-5" /> 
    },
    { 
      title: 'Configurações', 
      path: '/admin', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  // Desktop sidebar with animation
  const DesktopSidebar = () => (
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
                "flex items-center gap-2 rounded-md px-3 py-2 transition-colors cursor-pointer",
                isActive(item.path) 
                  ? "bg-primary/10 text-primary" 
                  : "text-sidebar-foreground hover:bg-primary/5"
              )}
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? 'auto' : 0,
                }}
                className="overflow-hidden whitespace-nowrap"
              >
                {item.title}
              </motion.span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t">
        <div 
          className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/5 transition-colors cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <motion.span
            animate={{
              opacity: open ? 1 : 0,
              width: open ? 'auto' : 0,
            }}
            className="overflow-hidden whitespace-nowrap"
          >
            Sair
          </motion.span>
        </div>
      </div>
    </motion.div>
  );

  // Mobile sidebar with animation
  const MobileSidebar = () => (
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
      
      {/* We need to handle AnimatePresence differently with the motion library */}
      {isMobile && open && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setOpen(false)}
          />
          
          <motion.div
            className="fixed top-0 left-0 bottom-0 w-3/4 max-w-xs bg-sidebar p-4 z-50 flex flex-col md:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
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
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
}
