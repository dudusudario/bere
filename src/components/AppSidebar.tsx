
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart, 
  CalendarDays,
  MessageSquare, 
  Settings, 
  Users, 
  Menu,
  MessageCircle
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

export function AppSidebar() {
  const { pathname } = useLocation();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

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
      href: '/dashboard',
      label: 'Dashboard',
      icon: BarChart,
    },
    {
      href: '/dashboard/conversas',
      label: 'WhatsApp',
      icon: MessageCircle,
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

  return (
    <Sidebar>
      <SidebarHeader className="p-2 flex items-center">
        <div className="flex-1 flex items-center gap-2">
          <span className="font-semibold">Lovable</span>
        </div>
        <SidebarTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarMenu>
            {mainLinks.map(({ href, label, icon: Icon }) => (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton asChild>
                  <NavLink
                    to={href}
                    className={({ isActive }) =>
                      `w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                        isActive || (href !== '/dashboard' && pathname.startsWith(href))
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-muted'
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
        <SidebarGroup className="mt-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`
                  }
                >
                  <Users className="h-4 w-4" />
                  <span>Perfil</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm ${
                      isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                    }`
                  }
                >
                  <Settings className="h-4 w-4" />
                  <span>Admin</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? 'Saindo...' : 'Sair'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
