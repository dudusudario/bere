
import React from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1">
            {children}
          </div>
        </div>
      </TooltipProvider>
    </SidebarProvider>
  );
}
