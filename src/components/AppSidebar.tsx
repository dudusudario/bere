
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isMobile, open, setOpen, toggleSidebar } = useSidebar();
  
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

  // Menu items for the sidebar
  const menuItems = [
    { 
      icon: <Home className="h-5 w-5" />, 
      label: 'Página Inicial', 
      path: '/dashboard',
      isActive: isActive('/dashboard'),
      action: () => navigate('/dashboard')
    },
    { 
      icon: <MessageCircle className="h-5 w-5" />, 
      label: 'Chat', 
      path: '/chat',
      isActive: isActive('/chat'),
      action: () => navigate('/chat')
    },
    { 
      icon: <User className="h-5 w-5" />, 
      label: 'Perfil', 
      path: '/profile',
      isActive: isActive('/profile'),
      action: () => navigate('/profile')
    },
    { 
      icon: <Settings className="h-5 w-5" />, 
      label: 'Configurações', 
      path: '/admin',
      isActive: isActive('/admin'),
      action: () => navigate('/admin')
    }
  ];

  const DesktopSidebar = () => (
    <motion.div
      className={cn(
        "h-full hidden md:flex md:flex-col bg-sidebar text-sidebar-foreground",
        "transition-all duration-300 ease-in-out"
      )}
      animate={{
        width: open ? 'var(--sidebar-width)' : 'var(--sidebar-width-icon)'
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <motion.div 
            className="flex items-center"
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="text-xl font-bold text-primary">Berenice</h2>
          </motion.div>
          {isMobile && (
            <SidebarTrigger />
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <motion.div
            animate={{ opacity: open ? 1 : 0, height: open ? 'auto' : 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          </motion.div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton 
                    tooltip={!open ? item.label : undefined} 
                    onClick={item.action}
                    isActive={item.isActive}
                    className="flex items-center gap-3"
                  >
                    <div className="flex-shrink-0">{item.icon}</div>
                    <motion.span
                      animate={{
                        opacity: open ? 1 : 0,
                        width: open ? 'auto' : 0
                      }}
                      transition={{ duration: 0.2 }}
                      className="whitespace-pre text-sm group-hover/sidebar:translate-x-1 transition duration-150 overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={!open ? "Sair" : undefined} onClick={handleLogout}>
              <div className="flex-shrink-0">
                <LogOut className="h-5 w-5" />
              </div>
              <motion.span
                animate={{
                  opacity: open ? 1 : 0,
                  width: open ? 'auto' : 0
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                Sair
              </motion.span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </motion.div>
  );

  const MobileSidebar = () => (
    <>
      {isMobile && (
        <div className="md:hidden">
          <div 
            className="flex justify-end p-4 cursor-pointer"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </div>
          
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut"
                }}
                className="fixed inset-0 z-50 bg-sidebar"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-4">
                    <h2 className="text-xl font-bold text-primary">Berenice</h2>
                    <button onClick={toggleSidebar} className="p-2">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4">
                    <div className="flex flex-col gap-4">
                      {menuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            item.action();
                            toggleSidebar();
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-md text-sidebar-foreground",
                            item.isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : 
                            "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          )}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 border-t border-border">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full p-3 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );

  return (
    <Sidebar>
      <DesktopSidebar />
      <MobileSidebar />
    </Sidebar>
  );
}
