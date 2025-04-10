
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MessageSquare } from 'lucide-react';

export const RecentActivity: React.FC = () => {
  return (
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
  );
};
