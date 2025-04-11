
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WhatsAppMessageSender } from '@/components/dashboard/WhatsAppMessageSender';
import { ChatFeed } from '@/components/ChatFeed';
import { Search, MessageSquare, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Contact {
  phoneNumber: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

const ConversasPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWhatsGwEnabled, setIsWhatsGwEnabled] = useState(false);

  useEffect(() => {
    // Verificar se WhatsGW está ativado
    const whatsgwEnabled = localStorage.getItem('whatsgw_enabled') === 'true';
    setIsWhatsGwEnabled(whatsgwEnabled);

    if (!whatsgwEnabled) {
      toast({
        title: "WhatsGW não configurado",
        description: "Configure o WhatsGW no painel de administração para habilitar funcionalidades do WhatsApp.",
        variant: "destructive"
      });
    }

    // Buscar contatos únicos das conversas
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      // Buscar mensagens únicas agrupadas por número
      const { data, error } = await supabase
        .from('user_menssagens')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Processar para obter contatos únicos com última mensagem
      const contactMap = new Map<string, Contact>();
      
      data?.forEach(msg => {
        if (!contactMap.has(msg.numero)) {
          contactMap.set(msg.numero, {
            phoneNumber: msg.numero,
            lastMessage: msg.mensagem,
            timestamp: new Date(msg.timestamp),
            unread: false // Implementar lógica de mensagens não lidas posteriormente
          });
        }
      });
      
      setContacts(Array.from(contactMap.values()));
    } catch (error) {
      console.error("Erro ao carregar contatos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de contatos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => 
    contact.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactSelect = (phoneNumber: string) => {
    setSelectedContact(phoneNumber);
  };

  const handleMessageSent = () => {
    // Recarregar contatos após envio de mensagem
    fetchContacts();
  };

  const formatPhoneNumber = (phone: string) => {
    // Formatar número de telefone para exibição
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 11) {
      return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`;
    }
    return phone;
  };

  const formatMessagePreview = (message: string) => {
    // Truncar mensagem para preview
    return message.length > 35 ? message.substring(0, 35) + '...' : message;
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Hoje: mostrar hora
      return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Ontem';
    } else if (diffDays < 7) {
      // Dias da semana
      const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      return days[timestamp.getDay()];
    } else {
      // Data completa para mensagens mais antigas
      return timestamp.toLocaleDateString();
    }
  };

  if (!isWhatsGwEnabled) {
    return (
      <div className="container mx-auto p-4">
        <Card className="border">
          <CardHeader>
            <CardTitle>WhatsGW não configurado</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Para utilizar a funcionalidade de conversas do WhatsApp, configure a integração com o WhatsGW no painel de administração.</p>
            <Button asChild>
              <a href="/admin">Ir para configurações</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4">
      <h1 className="text-2xl font-bold mb-4">Conversas WhatsApp</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 border rounded-md overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar contato..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto h-[calc(100vh-250px)]">
            {loading ? (
              <div className="p-4 text-center">Carregando contatos...</div>
            ) : filteredContacts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                Nenhum contato encontrado
              </div>
            ) : (
              filteredContacts.map(contact => (
                <div
                  key={contact.phoneNumber}
                  className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/50 ${
                    selectedContact === contact.phoneNumber ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleContactSelect(contact.phoneNumber)}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium truncate">{formatPhoneNumber(contact.phoneNumber)}</p>
                      <span className="text-xs text-muted-foreground">{formatTimestamp(contact.timestamp)}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {formatMessagePreview(contact.lastMessage)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-span-2 border rounded-md overflow-hidden">
          {selectedContact ? (
            <div className="flex flex-col h-[calc(100vh-160px)]">
              <div className="p-3 border-b flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatPhoneNumber(selectedContact)}</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <Tabs defaultValue="chat" className="flex-1 flex flex-col">
                <TabsList className="mx-3 my-2">
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="info">Informações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="chat" className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <ChatFeed phoneNumber={selectedContact} />
                  </div>
                  <div className="p-3 border-t">
                    <WhatsAppMessageSender 
                      phoneNumber={selectedContact} 
                      onSendSuccess={handleMessageSent}
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="info" className="p-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Informações do Contato</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div>
                          <dt className="text-sm text-muted-foreground">Número</dt>
                          <dd>{formatPhoneNumber(selectedContact)}</dd>
                        </div>
                        {/* Adicione mais informações do contato conforme necessário */}
                      </dl>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground p-4">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Selecione uma conversa para visualizar as mensagens</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversasPage;
