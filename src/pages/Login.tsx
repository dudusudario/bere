
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Redirect to the Auth page instead of directly to chat
  useEffect(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecionando...</p>
    </div>
  );
};

export default Login;
