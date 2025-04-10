
import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  tags?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

interface LeadFormFieldsProps {
  formData: Partial<Lead>;
  onFieldChange: (field: string, value: string) => void;
}

export const LeadFormFields: React.FC<LeadFormFieldsProps> = ({
  formData,
  onFieldChange
}) => {
  return (
    <>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">Nome</Label>
        <Input
          id="name"
          value={formData.name || ''}
          onChange={(e) => onFieldChange('name', e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="whatsapp" className="text-right">WhatsApp</Label>
        <Input
          id="whatsapp"
          value={formData.whatsapp || ''}
          onChange={(e) => onFieldChange('whatsapp', e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="email" className="text-right">Email</Label>
        <Input
          id="email"
          value={formData["e-mail"] || ''}
          onChange={(e) => onFieldChange('e-mail', e.target.value)}
          className="col-span-3"
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="interesse" className="text-right">Interesse</Label>
        <Input
          id="interesse"
          value={formData.interesse || ''}
          onChange={(e) => onFieldChange('interesse', e.target.value)}
          className="col-span-3"
        />
      </div>
    </>
  );
};
