
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

interface Lead {
  id: number;
  name: string;
  whatsapp: string;
  tags?: string;
  interesse?: string;
  "e-mail"?: string;
  created_at?: string;
}

interface LeadDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onLeadUpdated: () => void;
}

export const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({ 
  isOpen, 
  onClose, 
  lead,
  onLeadUpdated
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  React.useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        whatsapp: lead.whatsapp,
        tags: lead.tags,
        interesse: lead.interesse,
        "e-mail": lead["e-mail"]
      });
    }
  }, [lead]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!lead) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('leads')
        .update(formData)
        .eq('id', lead.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Lead atualizado",
        description: "As informações do lead foram atualizadas com sucesso.",
      });
      onLeadUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar lead",
        description: "Não foi possível atualizar as informações do lead.",
      });
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "gengivoplastia", label: "Gengivoplastia", color: "bg-green-50 text-green-700 border-green-200" },
    { value: "implante", label: "Implante", color: "bg-orange-50 text-orange-700 border-orange-200" },
    { value: "protese", label: "Prótese", color: "bg-pink-50 text-pink-700 border-pink-200" },
    { value: "dentadura", label: "Dentadura", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    { value: "canal", label: "Canal", color: "bg-purple-50 text-purple-700 border-purple-200" },
    { value: "coroa", label: "Coroa", color: "bg-amber-50 text-amber-700 border-amber-200" },
    { value: "lentes", label: "Lentes", color: "bg-blue-50 text-blue-700 border-blue-200" },
    { value: "desqualificado", label: "Desqualificado", color: "bg-red-50 text-red-700 border-red-200" },
    { value: "pausado", label: "Pausado", color: "bg-gray-50 text-gray-700 border-gray-200" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Detalhes do Lead</DialogTitle>
        </DialogHeader>
        
        {lead && (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="whatsapp" className="text-right">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp || ''}
                onChange={(e) => handleChange('whatsapp', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">Email</Label>
              <Input
                id="email"
                value={formData["e-mail"] || ''}
                onChange={(e) => handleChange('e-mail', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="interesse" className="text-right">Interesse</Label>
              <Input
                id="interesse"
                value={formData.interesse || ''}
                onChange={(e) => handleChange('interesse', e.target.value)}
                className="col-span-3"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select 
                value={formData.tags || ''} 
                onValueChange={(value) => handleChange('tags', value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
