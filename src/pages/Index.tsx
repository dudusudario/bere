
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartLegendContent } from "@/components/ui/chart";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";
import { Users, UserPlus, Phone, Calendar, ArrowUpRight, ArrowDownRight, MessageSquare } from 'lucide-react';

const Index: React.FC = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    totalLeads: 125,
    totalPatients: 78,
    newLeadsToday: 12,
    newPatientsToday: 3,
    leadConversionRate: 62,
    pendingAppointments: 8,
    notifications: 5
  });

  // Sample chart data
  const leadData = [
    { name: 'Jan', value: 30 },
    { name: 'Feb', value: 40 },
    { name: 'Mar', value: 45 },
    { name: 'Apr', value: 50 },
    { name: 'May', value: 58 },
    { name: 'Jun', value: 68 },
    { name: 'Jul', value: 75 },
    { name: 'Aug', value: 90 },
    { name: 'Sep', value: 100 },
    { name: 'Oct', value: 110 },
    { name: 'Nov', value: 120 },
    { name: 'Dec', value: 125 },
  ];

  const conversionData = [
    { name: 'Converted', value: 78 },
    { name: 'Pending', value: 35 },
    { name: 'Lost', value: 12 },
  ];
  
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

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
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center">
          <SidebarTrigger className="md:hidden mr-4" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-primary">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Visão geral de leads e pacientes</p>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Total de Leads</CardTitle>
                    <CardDescription>Todos os leads registrados</CardDescription>
                  </div>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalLeads}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-500 font-medium flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> 
                      +{dashboardData.newLeadsToday} hoje
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
                    <CardDescription>Leads convertidos em pacientes</CardDescription>
                  </div>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.totalPatients}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    <span className="text-emerald-500 font-medium flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" /> 
                      +{dashboardData.newPatientsToday} hoje
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
                    <CardDescription>Porcentagem de conversão</CardDescription>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.leadConversionRate}%</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-sm font-medium">Consultas Pendentes</CardTitle>
                    <CardDescription>Agendamentos confirmados</CardDescription>
                  </div>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.pendingAppointments}</div>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Evolução de Leads</CardTitle>
                  <CardDescription>Crescimento mensal de novos leads</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      lead: {
                        theme: {
                          light: "#4f46e5",
                          dark: "#818cf8"
                        }
                      }
                    }}
                    className="h-full"
                  >
                    <AreaChart
                      data={leadData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--color-lead, #4f46e5)"
                        fill="var(--color-lead, rgba(79, 70, 229, 0.2))"
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Conversão de Leads</CardTitle>
                  <CardDescription>Status atual dos leads</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ChartContainer
                    config={{
                      converted: { color: "#0088FE" },
                      pending: { color: "#FFBB28" },
                      lost: { color: "#FF8042" }
                    }}
                    className="h-full"
                  >
                    <PieChart>
                      <Pie
                        data={conversionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {conversionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        content={props => (
                          <ChartLegendContent
                            {...props}
                            nameKey="name"
                            verticalAlign="bottom"
                            className="mt-6"
                          />
                        )}
                      />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
            
            {/* Recent Activity Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Leads Recentes</CardTitle>
                  <CardDescription>Novos leads dos últimos 7 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Phone className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">Maria Silva</p>
                            <p className="text-xs text-muted-foreground">(11) 98765-4321</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Há 2 dias</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <a href="#" className="text-sm text-primary hover:underline">Ver todos →</a>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Pacientes Recentes</CardTitle>
                  <CardDescription>Novos pacientes dos últimos 30 dias</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                        <div className="flex items-center space-x-3">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">João Pereira</p>
                            <p className="text-xs text-muted-foreground">Primeira consulta agendada</p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground">Há 5 dias</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <a href="#" className="text-sm text-primary hover:underline">Ver todos →</a>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="leads" className="p-4">
            <h3 className="text-lg font-medium mb-4">Gestão de Leads</h3>
            <p className="text-muted-foreground">Visualize esta aba para gerenciar seus leads de forma detalhada.</p>
          </TabsContent>
          
          <TabsContent value="patients" className="p-4">
            <h3 className="text-lg font-medium mb-4">Gestão de Pacientes</h3>
            <p className="text-muted-foreground">Visualize esta aba para gerenciar seus pacientes de forma detalhada.</p>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
