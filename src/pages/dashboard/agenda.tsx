
import React, { useState } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Bell, X } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';

type Event = {
  id: string;
  title: string;
  date: Date;
  color: string;
  attendees?: number;
};

type UpcomingEvent = {
  id: string;
  title: string;
  description: string;
  date: string;
  author?: string;
};

const AgendaPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(new Date());
  
  // Dados mockados para o exemplo
  const events: Event[] = [
    { 
      id: '1', 
      title: 'Reunião de equipe',
      date: new Date(2025, 3, 9), // 9 de Abril de 2025
      color: 'bg-primary',
      attendees: 3
    },
    { 
      id: '2', 
      title: 'Revisão de projeto',
      date: new Date(2025, 3, 16), // 16 de Abril de 2025
      color: 'bg-green-500',
      attendees: 2
    },
    { 
      id: '3', 
      title: 'Planejamento mensal',
      date: new Date(2025, 3, 22), // 22 de Abril de 2025
      color: 'bg-yellow-500',
      attendees: 4
    },
  ];
  
  const upcomingEvents: UpcomingEvent[] = [
    {
      id: '1',
      title: 'Lothair Johnson',
      description: 'Atualize nossos rastreadores para o calendário que você criou',
      date: '27 July',
    },
    {
      id: '2',
      title: 'Charles Duminy',
      description: 'Precisamos discutir progresso do projeto',
      date: '30 July',
    },
    {
      id: '3',
      title: 'Paulo motta team status',
      description: 'Reunião rápida para atualizar sobre o projeto',
      date: '6 Aug',
    },
    {
      id: '4',
      title: 'Tayil Nielsen update',
      description: 'Precisamos revisar novos designs',
      date: '17 Aug',
    },
    {
      id: '5',
      title: 'One-on-one review',
      description: 'Revisão mensal de desempenho',
      date: '1 Sept',
    },
    {
      id: '6',
      title: 'Charles Duminy',
      description: 'Precisamos discutir progresso do projeto',
      date: '30 July',
    },
  ];
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  // Mock data for progress bars
  const progressData = {
    todo: 40,
    progress: 30,
    review: 30
  };
  
  const taskNotification = {
    title: "Desenvolvimento business team melhorado 21%, vamos impulsionar hoje!",
    isActive: true
  };
  
  const toggleNotification = () => {
    // Função que seria implementada para ativar/desativar a notificação
    console.log("Notification toggle clicked");
  };
  
  return (
    <AppLayout>
      <div className="min-h-screen">
        <header className="border-b bg-background sticky top-0 z-10">
          <div className="container mx-auto px-4 md:px-6 py-4">
            <h1 className="text-2xl font-bold font-playfair text-foreground">Agenda</h1>
            <p className="text-sm text-muted-foreground">Gerencie seus compromissos e eventos</p>
          </div>
        </header>
        
        <main className="container mx-auto px-4 md:px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna da esquerda - Calendário */}
            <div className="lg:col-span-2 space-y-6">
              {/* Seção de boas vindas */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Olá Berenice,</p>
                  <h2 className="text-2xl font-bold">Bom dia</h2>
                </div>
                
                <div className="flex space-x-2 items-center">
                  <div className="flex items-center space-x-2 border rounded-md px-2 py-1">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{format(currentDate, 'MMMM', { locale: ptBR })}</span>
                  </div>
                  <Button variant="outline" size="icon" onClick={prevMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={nextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button variant="default" size="sm" className="ml-2">
                    <span>Hoje</span>
                  </Button>
                </div>
              </div>
              
              {/* Notificação de tarefas */}
              {taskNotification.isActive && (
                <div className="relative bg-primary/10 rounded-lg p-4 pr-12">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6 rounded-full"
                    onClick={toggleNotification}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/20 p-2 rounded-md">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                    </div>
                    <p className="text-sm">{taskNotification.title}</p>
                  </div>
                  
                  {/* Barras de progresso */}
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Todo: {progressData.todo}%</span>
                      <span>Progresso: {progressData.progress}%</span>
                      <span>Review: {progressData.review}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden flex">
                      <div className="bg-blue-400" style={{ width: `${progressData.todo}%` }}></div>
                      <div className="bg-green-400" style={{ width: `${progressData.progress}%` }}></div>
                      <div className="bg-red-400" style={{ width: `${progressData.review}%` }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Calendário */}
              <Card className="border shadow-sm">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-7 gap-2 text-center text-xs text-muted-foreground mb-2">
                    {['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'].map((day, i) => (
                      <div key={i} className="py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {(() => {
                      const monthStart = startOfMonth(currentMonth);
                      const monthEnd = endOfMonth(monthStart);
                      const startDate = new Date(monthStart);
                      startDate.setDate(startDate.getDate() - startDate.getDay());
                      const endDate = new Date(monthEnd);
                      endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
                      
                      const days = eachDayOfInterval({ start: startDate, end: endDate });
                      
                      return days.map((day, idx) => {
                        // Verificar se o dia tem eventos
                        const dayEvents = events.filter(event => isSameDay(day, event.date));
                        const isCurrentMonth = isSameMonth(day, currentMonth);
                        const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
                        
                        return (
                          <div 
                            key={idx}
                            className={`
                              min-h-[80px] p-1 border rounded-md relative
                              ${!isCurrentMonth ? 'opacity-40 bg-muted/20' : ''}
                              ${isSelected ? 'ring-2 ring-primary' : ''}
                            `}
                            onClick={() => setSelectedDay(day)}
                          >
                            <span className="absolute top-1 left-1 text-xs">
                              {format(day, 'd')}
                            </span>
                            
                            <div className="mt-6 space-y-1">
                              {dayEvents.map(event => (
                                <div 
                                  key={event.id}
                                  className={`
                                    ${event.color} text-white rounded p-1 text-xs flex items-center justify-between
                                  `}
                                >
                                  <span className="truncate">{event.title}</span>
                                  {event.attendees && (
                                    <span className="bg-white/20 rounded-full text-[10px] p-1 w-5 h-5 flex items-center justify-center">
                                      {event.attendees}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </CardContent>
              </Card>
              
              {/* Agenda do dia */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Agenda</h3>
                  <Button variant="outline" size="sm">Ver tudo</Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <Card key={event.id} className="border shadow-sm">
                      <CardContent className="p-4 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(event.date, 'PPP', { locale: ptBR })}
                          </p>
                        </div>
                        <Badge className={event.color.replace('bg-', 'bg-opacity-20 text-')}>
                          {format(event.date, 'HH:mm')}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Coluna da direita - Eventos próximos e notificações */}
            <div className="space-y-6">
              {/* Eventos próximos */}
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl">Próximos eventos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="flex gap-4 items-start">
                      <div className="min-w-[60px] text-sm font-medium">{event.date}</div>
                      <div className="border-l-2 border-primary pl-4">
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-xs text-muted-foreground">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              {/* Seção de notificações */}
              <Card className="border shadow-sm bg-gradient-to-br from-primary/80 to-primary text-white">
                <CardContent className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-lg">Sincronizar notificações</h3>
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center space-y-4">
                    <h4 className="font-bold text-primary">Ativar Notificações</h4>
                    <p className="text-xs text-gray-600">Adicione notificações para receber lembretes e manter-se conectado aos seus eventos</p>
                    <Button className="bg-primary text-white hover:bg-primary/90">
                      Ativar notificações
                    </Button>
                    
                    <div className="relative w-full h-32">
                      <img 
                        src="/lovable-uploads/9aa06aec-a5ca-40dc-91bc-3b70bffc17c2.png" 
                        alt="Notification illustration" 
                        className="object-contain w-24 h-24 mx-auto"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </AppLayout>
  );
};

export default AgendaPage;
