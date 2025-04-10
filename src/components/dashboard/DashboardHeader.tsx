
import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

export const DashboardHeader: React.FC = () => {
  return (
    <header className="border-b bg-background sticky top-0 z-10">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center">
        <SidebarTrigger className="md:hidden mr-4" />
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-primary">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Visão geral de leads e pacientes</p>
        </div>
      </div>
    </header>
  );
};
