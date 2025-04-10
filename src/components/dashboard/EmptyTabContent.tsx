
import React from 'react';
import { LeadsDetailedView } from './LeadsDetailedView';
import { PatientsDetailedView } from './PatientsDetailedView';

interface EmptyTabContentProps {
  title: string;
}

export const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ title }) => {
  return (
    <div className="p-4">
      {title === 'Leads' ? <LeadsDetailedView /> : <PatientsDetailedView />}
    </div>
  );
};
