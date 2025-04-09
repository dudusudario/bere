
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  profile_image: string | null;
  created_at: string;
}

interface UsersTableProps {
  users: UserWithProfile[];
  loading: boolean;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, loading }) => {
  // Função para obter as iniciais do nome para o avatar
  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Usuários Registrados
        </CardTitle>
        <CardDescription>Lista de todos os usuários registrados no sistema</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Registrado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profile_image || ''} alt={user.full_name || ''} />
                          <AvatarFallback>{getInitials(user.full_name)}</AvatarFallback>
                        </Avatar>
                        <span>{user.full_name || 'Usuário sem nome'}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                    <TableCell>
                      {user.created_at 
                        ? new Date(user.created_at).toLocaleDateString('pt-BR')
                        : 'N/A'
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        Ver detalhes
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-center py-8 text-muted-foreground">Nenhum usuário encontrado.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default UsersTable;
