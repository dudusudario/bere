
import { Home, MessageCircle, User, Settings } from 'lucide-react';

// Menu items configuration
export const menuItems = [
  { 
    title: 'Página Inicial', 
    path: '/dashboard', 
    icon: <Home className="h-5 w-5" /> 
  },
  { 
    title: 'Chat', 
    path: '/chat', 
    icon: <MessageCircle className="h-5 w-5" /> 
  },
  { 
    title: 'Perfil', 
    path: '/profile', 
    icon: <User className="h-5 w-5" /> 
  },
  { 
    title: 'Configurações', 
    path: '/admin', 
    icon: <Settings className="h-5 w-5" /> 
  }
];
