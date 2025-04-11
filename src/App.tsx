
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, lazy, Suspense } from "react";
import { supabase } from "@/integrations/supabase/client";
import AppLayout from "./components/AppLayout";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import ProfileSetup from "./pages/ProfileSetup";
import EmailConfirmation from "./pages/EmailConfirmation";
import ChatInterface from "./components/ChatInterface";

// Lazy load the pages
const MessagesPage = lazy(() => import('./pages/dashboard/mensagens'));
const ConversasPage = lazy(() => import('./pages/dashboard/conversas')); 
const AgendaPage = lazy(() => import('./pages/dashboard/agenda'));

function App() {
  const queryClient = new QueryClient();
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setIsLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Rotas com layout padrão e sidebar */}
          <Route path="/dashboard" element={
            <AppLayout>
              <Index />
            </AppLayout>
          } />
          <Route path="/chat" element={
            <AppLayout>
              <ChatInterface />
            </AppLayout>
          } />
          <Route path="/profile" element={
            <AppLayout>
              <UserProfile />
            </AppLayout>
          } />
          <Route path="/admin" element={
            <AppLayout>
              <AdminPanel />
            </AppLayout>
          } />
          
          {/* Rotas sem sidebar */}
          <Route path="/profile-setup" element={<ProfileSetup />} />
          <Route path="/email-confirmation" element={<EmailConfirmation />} />
          
          {/* Rotas do dashboard */}
          <Route path="/dashboard/mensagens" element={
            <AppLayout>
              <Suspense fallback={<div>Carregando...</div>}>
                <MessagesPage />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/dashboard/conversas" element={
            <AppLayout>
              <Suspense fallback={<div>Carregando...</div>}>
                <ConversasPage />
              </Suspense>
            </AppLayout>
          } />
          <Route path="/dashboard/agenda" element={
            <AppLayout>
              <Suspense fallback={<div>Carregando...</div>}>
                <AgendaPage />
              </Suspense>
            </AppLayout>
          } />
          
          {/* Rota coringa para páginas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
