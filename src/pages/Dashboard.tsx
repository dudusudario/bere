
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart, Calendar, MessageCircle, User, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userPhone = localStorage.getItem('userPhone') || '';

  // Dados de exemplo para estatísticas do dashboard
  const stats = [
    { title: 'Total de Conversas', value: '27', icon: MessageCircle, color: 'bg-blue-100 text-blue-700' },
    { title: 'Próximos Eventos', value: '3', icon: Calendar, color: 'bg-green-100 text-green-700' },
    { title: 'Tarefas Pendentes', value: '8', icon: Settings, color: 'bg-amber-100 text-amber-700' },
    { title: 'Relatórios', value: '12', icon: BarChart, color: 'bg-purple-100 text-purple-700' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Painel Principal</h1>
          
          {!userPhone && (
            <Button variant="outline" size="sm" onClick={() => navigate('/profile')} className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Configurar Perfil</span>
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Bem-vindo ao Berenice</h2>
          <p className="text-muted-foreground">
            Acesse todas as funcionalidades da sua assistente pessoal através do menu lateral.
          </p>
        </div>

        <section className="mb-8">
          <h3 className="text-lg font-medium mb-4">Resumo de Atividades</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="bg-card border rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`rounded-full p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              <span>Conversas Recentes</span>
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Nenhuma conversa recente para exibir.
              </p>
              <Button onClick={() => navigate('/chat')} variant="outline" size="sm">
                Iniciar Nova Conversa
              </Button>
            </div>
          </div>

          <div className="bg-card border rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span>Próximos Eventos</span>
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Nenhum evento programado.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
