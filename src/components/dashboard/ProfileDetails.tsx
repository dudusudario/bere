
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, User, Shield, FileCheck, KeyRound, Upload, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProfileField {
  name: string;
  label: string;
  value: string;
  required?: boolean;
}

interface ProfileDetailsProps {
  title?: string;
  fields: ProfileField[];
  avatar?: string;
  onSave: (formData: Record<string, string>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  title = "Perfil",
  fields,
  avatar,
  onSave,
  onCancel,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<Record<string, string>>(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.value
    }), {})
  );
  
  const [activeTab, setActiveTab] = useState("personal");
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    const nameField = fields.find(f => f.name === 'nome' || f.name === 'name');
    if (!nameField) return "U";
    
    return nameField.value
      .split(' ')
      .slice(0, 2)
      .map(name => name[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-gray-600" />
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <span className="font-medium">{
              fields.find(f => f.name === 'nome' || f.name === 'name')?.value || 'Usuário'
            }</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="personal" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-6">
          <TabsTrigger value="personal" className="gap-2">
            <User size={16} />
            Datos personales
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield size={16} />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="verification" className="gap-2">
            <FileCheck size={16} />
            Verificación KYC
          </TabsTrigger>
          <TabsTrigger value="2fa" className="gap-2">
            <KeyRound size={16} />
            Two-factor Authentication
          </TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <h3 className="font-semibold text-lg mb-4">Datos personales</h3>
          
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatar} alt="Profile" />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Upload size={14} />
                Subir foto
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 text-red-600">
                <Trash2 size={14} />
                Eliminar
              </Button>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <h3 className="font-semibold mb-6">Editar información personal</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="text-sm font-medium flex items-center">
                    {field.required && <span className="text-red-500 mr-1">*</span>}
                    {field.label}
                  </label>
                  <Input
                    value={formData[field.name] || ''}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-4 mt-8">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-indigo-900 hover:bg-indigo-800"
              >
                {isLoading ? 'Guardando...' : 'Guardar'}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <div className="text-center py-12">
            <Shield className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Configuración de seguridad</h3>
            <p className="text-gray-500">
              Aquí puede gestionar la configuración de seguridad de su cuenta.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <div className="text-center py-12">
            <FileCheck className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Verificación KYC</h3>
            <p className="text-gray-500">
              Complete su proceso de verificación Know Your Customer.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="2fa">
          <div className="text-center py-12">
            <KeyRound className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">Autenticación de dos factores</h3>
            <p className="text-gray-500">
              Configure la autenticación de dos factores para mayor seguridad.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
