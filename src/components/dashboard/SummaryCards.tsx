
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, ArrowUpRight, Calendar } from 'lucide-react';

interface SummaryCardsProps {
  totalLeads: number;
  totalPatients: number;
  newLeadsToday: number;
  newPatientsToday: number;
  leadConversionRate: number;
  pendingAppointments: number;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalLeads,
  totalPatients, 
  newLeadsToday,
  newPatientsToday,
  leadConversionRate,
  pendingAppointments
}) => {
  return (
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
          <div className="text-2xl font-bold">{totalLeads}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +{newLeadsToday} hoje
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
          <div className="text-2xl font-bold">{totalPatients}</div>
          <div className="text-xs text-muted-foreground mt-1">
            <span className="text-emerald-500 font-medium flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> 
              +{newPatientsToday} hoje
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
          <div className="text-2xl font-bold">{leadConversionRate}%</div>
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
          <div className="text-2xl font-bold">{pendingAppointments}</div>
        </CardContent>
      </Card>
    </div>
  );
};
