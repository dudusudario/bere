
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from "recharts";

interface LeadData {
  name: string;
  value: number;
}

interface ConversionData {
  name: string;
  value: number;
}

interface DashboardChartsProps {
  leadData: LeadData[];
  conversionData: ConversionData[];
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({ leadData, conversionData }) => {
  const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];
  
  return (
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
                payload={conversionData.map((item, index) => ({
                  value: item.name,
                  color: COLORS[index % COLORS.length]
                }))}
                layout="horizontal"
                verticalAlign="bottom"
              />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
