
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  CalendarDays,
  MessageSquare, 
  Settings, 
  Menu,
  MessageCircle,
  Home,
  User,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarGroup,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { useWhatsappIntegration } from '@/hooks/useWhatsappIntegration';

export function AppSidebar() {
  const { pathname } = useLocation();
  const [isSigningOut, setIsSigningOut] = React.useState(false);
  const { isWhatsGWEnabled } = useWhatsappIntegration();

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: "Erro ao sair",
        description: "Houve um problema ao tentar sair da sua conta.",
        variant: "destructive",
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  // Links para o menu principal
  const mainLinks = [
    {
      href: '/',
      label: 'Landing Page',
      icon: Home,
    },
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart,
    },
    {
      href: '/dashboard/conversas',
      label: 'WhatsApp',
      icon: MessageCircle,
      badge: isWhatsGWEnabled ? 'Ativo' : 'Inativo',
      badgeColor: isWhatsGWEnabled ? 'bg-green-500' : 'bg-red-500',
    },
    {
      href: '/chat',
      label: 'Chat Assistente',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/mensagens',
      label: 'Mensagens',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/agenda',
      label: 'Agenda',
      icon: CalendarDays,
    },
  ];

  // Links para configurações e perfil
  const settingsLinks = [
    {
      href: '/profile',
      label: 'Perfil',
      icon: User,
    },
    {
      href: '/admin',
      label: 'Admin',
      icon: Settings,
    },
    {
      href: '/login',
      label: 'Login',
      icon: User,
    },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="p-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <span className="font-semibold">Lovable</span>
        </div>
        <SidebarTrigger>
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle sidebar</span>
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {mainLinks.map(({ href, label, icon: Icon, badge, badgeColor }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                        isActive || (href !== '/' && pathname.startsWith(href))
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1">{label}</span>
                    {badge && (
                      <span className={`text-xs px-2 py-0.5 rounded text-white ${badgeColor}`}>
                        {badge}
                      </span>
                    )}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-2">
          <SidebarMenu>
            {settingsLinks.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                        isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center gap-2" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          <LogOut className="h-4 w-4" />
          <span>{isSigningOut ? 'Saindo...' : 'Sair'}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
