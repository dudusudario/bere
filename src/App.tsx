
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import AdminPanel from "./pages/AdminPanel";
import ProfileSetup from "./pages/ProfileSetup";
import EmailConfirmation from "./pages/EmailConfirmation";
import Auth from "./pages/Auth";
import Login from "./pages/Login";

// Create the QueryClient as a component variable, not global
function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/chat" element={<Index />} />
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/email-confirmation" element={<EmailConfirmation />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/login" element={<Login />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
