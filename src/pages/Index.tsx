
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const userPhone = localStorage.getItem('userPhone');

  const handleLogout = () => {
    localStorage.removeItem('userPhone');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Berenice</h1>
            <p className="text-sm text-muted-foreground">Sua assistente pessoal personalizada</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground hidden sm:block">
              Telefone: {userPhone}
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto">
        <ChatInterface />
      </main>
    </div>
  );
};

export default Index;
