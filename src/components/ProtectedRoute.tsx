
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando autenticação...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  // Se for uma rota apenas para admin, precisamos verificar o perfil do usuário
  // Isso pode ser implementado posteriormente conforme a estrutura de perfis de usuário
  if (adminOnly) {
    // Verificação temporária - pode ser substituída pela lógica real de verificação de admin
    const isAdmin = user.email?.endsWith('@admin.com') || false;
    
    if (!isAdmin) {
      return <Navigate to="/chat" replace />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
