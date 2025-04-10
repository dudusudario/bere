import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, MessageCircle, User, LogOut, Settings, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

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
  const { isMobile, state, setOpen } = useSidebar();
  const [isHovering, setIsHovering] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
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

  const handleNavigation = (path: string) => {
    navigate(path);
    // Auto close sidebar on mobile
    if (isMobile) {
      const sidebarTrigger = document.querySelector('[data-sidebar="trigger"]');
      if (sidebarTrigger) {
        (sidebarTrigger as HTMLButtonElement).click();
      }
    }
  };
  
  // Handle mouse enter to expand the sidebar
  const handleMouseEnter = () => {
    if (!isMobile && state === 'collapsed') {
      setIsHovering(true);
      setOpen(true);
    }
  };
  
  // Handle mouse leave to collapse the sidebar
  const handleMouseLeave = () => {
    if (!isMobile && isHovering) {
      setIsHovering(false);
      setOpen(false);
    }
  };

  return (
    <Sidebar 
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      collapsible="icon"
    >
      <SidebarHeader>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <h2 className="text-xl font-bold text-primary">
              {state === "collapsed" && !isHovering ? "B" : "Berenice"}
            </h2>
          </div>
          {isMobile && (
            <SidebarTrigger />
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Página Inicial" 
                  onClick={() => handleNavigation('/dashboard')}
                  isActive={isActive('/dashboard')}
                >
                  <Home className="h-5 w-5" />
                  <span>Página Inicial</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Chat" 
                  onClick={() => handleNavigation('/chat')}
                  isActive={isActive('/chat')}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {/* Novo item de menu para a Agenda */}
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Agenda" 
                  onClick={() => handleNavigation('/dashboard/agenda')}
                  isActive={isActive('/dashboard/agenda')}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Agenda</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Perfil" 
                  onClick={() => handleNavigation('/profile')}
                  isActive={isActive('/profile')}
                >
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton 
                  tooltip="Configurações" 
                  onClick={() => handleNavigation('/admin')}
                  isActive={isActive('/admin')}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Sair" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
