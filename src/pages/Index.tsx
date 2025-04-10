
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  SummaryCards, 
  DashboardCharts, 
  RecentActivity, 
  DashboardHeader,
  EmptyTabContent,
  PatientsDetailedView,
  LeadsDetailedView
} from '@/components/dashboard';

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
      <DashboardHeader />
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="leads">Leads</TabsTrigger>
            <TabsTrigger value="patients">Pacientes</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            {/* Summary Cards */}
            <SummaryCards 
              totalLeads={dashboardData.totalLeads}
              totalPatients={dashboardData.totalPatients}
              newLeadsToday={dashboardData.newLeadsToday}
              newPatientsToday={dashboardData.newPatientsToday}
              leadConversionRate={dashboardData.leadConversionRate}
              pendingAppointments={dashboardData.pendingAppointments}
            />
            
            {/* Charts */}
            <DashboardCharts leadData={leadData} conversionData={conversionData} />
            
            {/* Recent Activity Cards */}
            <RecentActivity />
          </TabsContent>
          
          <TabsContent value="leads">
            <LeadsDetailedView />
          </TabsContent>
          
          <TabsContent value="patients">
            <PatientsDetailedView />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
