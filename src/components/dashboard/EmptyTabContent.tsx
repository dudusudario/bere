
import React from 'react';

interface EmptyTabContentProps {
  title: string;
}

export const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title }) => {
  return (
    <div className="p-4">
      <h3 className="text-lg font-medium mb-4">Gestão de {title}</h3>
      <p className="text-muted-foreground">Visualize esta aba para gerenciar seus {title.toLowerCase()} de forma detalhada.</p>
    </div>
  );
};
