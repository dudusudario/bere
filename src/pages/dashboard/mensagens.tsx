
import React, { useState } from 'react';
import { useMessages } from '@/hooks/useMessages';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { formatDisplayTimestamp } from '@/utils/dateFormatter';

const MensagensPage = () => {
  const [searchPhone, setSearchPhone] = useState('');
  const [filterPhone, setFilterPhone] = useState('');
  const { messages, isLoading, refreshMessages } = useMessages(filterPhone || undefined);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterPhone(searchPhone);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Feed de Mensagens</h1>
      
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Filtrar por número de telefone..."
            value={searchPhone}
            onChange={(e) => setSearchPhone(e.target.value)}
            className="max-w-sm"
          />
          <Button type="submit">
            <Search className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          {filterPhone && (
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchPhone('');
                setFilterPhone('');
              }}
            >
              Limpar
            </Button>
          )}
        </form>
      </div>
      
      {isLoading ? (
        <p>Carregando mensagens...</p>
      ) : messages.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-muted-foreground">Nenhuma mensagem encontrada</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-sm">
                    {message.origem === 'user' ? 'Usuário' : 'Agente'}
                  </CardTitle>
                  <span className="text-xs text-muted-foreground">
                    {formatDisplayTimestamp(message.timestamp)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm font-medium mb-1">{message.username || message.numero}</p>
                <p className="text-sm mb-2">{message.mensagem}</p>
                <p className="text-xs text-muted-foreground">Telefone: {message.numero}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MensagensPage;
