
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ChatInterface from '@/components/ChatInterface';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from '@/components/ui/button';
import { AlertCircle, Phone } from 'lucide-react';

const Index: React.FC = () => {
  const [user, setUser] = useState(null);
  const userPhone = localStorage.getItem('userPhone') || '';

  useEffect(() => {
    // Check if user is authenticated
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <SidebarTrigger className="md:hidden mr-4" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary">Berenice Chat</h1>
              <p className="text-sm text-muted-foreground">Sua assistente pessoal personalizada</p>
            </div>
          </div>
          
          {!userPhone && (
            <Link to="/profile">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive">Configure seu telefone</span>
              </Button>
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
