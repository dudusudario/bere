
import React from 'react';
import ChatInterface from '@/components/ChatInterface';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Berenice</h1>
            <p className="text-sm text-muted-foreground">Sua assistente pessoal personalizada</p>
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
