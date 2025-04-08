
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, MessageCircle, Shield, Sparkles } from 'lucide-react';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Navigation */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-playfair font-bold text-primary">Berenice</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            variant="ghost" 
            className="hidden md:flex"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
          <Button 
            onClick={() => navigate('/login')}
            className="shadow-lg"
          >
            Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-10 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold mb-6 leading-tight">
            Sua assistente pessoal <span className="text-primary">inteligente</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
            Conheça Berenice, sua assistente pessoal que te ajuda a organizar seu dia a dia com inteligência e simplicidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={() => navigate('/login')}
              className="shadow-lg text-base"
            >
              Experimente Grátis
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => navigate('/login')}
              className="text-base"
            >
              Saiba Mais
            </Button>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center md:justify-end">
          <div className="relative">
            <div className="absolute -top-6 -left-6 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl"></div>
            <div className="relative bg-card rounded-2xl shadow-xl border border-border p-4 md:p-6 max-w-md">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="ml-3">
                  <h3 className="font-medium text-lg">Berenice</h3>
                  <p className="text-xs text-muted-foreground">Sua assistente pessoal</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="message-bubble message-ai">
                  Olá! Como posso ajudar você hoje?
                </div>
                <div className="message-bubble message-user">
                  Preciso organizar minha agenda para a semana.
                </div>
                <div className="message-bubble message-ai">
                  Claro! Vou te ajudar a organizar sua agenda de forma eficiente. Quais são seus principais compromissos?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-12">
          Por que escolher Berenice?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Conversas Naturais</h3>
            <p className="text-muted-foreground">
              Interaja naturalmente com a Berenice como se estivesse falando com um assistente real.
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Privacidade Garantida</h3>
            <p className="text-muted-foreground">
              Suas conversas e dados são criptografados e protegidos com os mais altos padrões de segurança.
            </p>
          </div>
          <div className="bg-card rounded-xl p-6 shadow-sm border border-border">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalização Inteligente</h3>
            <p className="text-muted-foreground">
              Quanto mais você usa, mais a Berenice aprende suas preferências e necessidades.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-gradient-to-r from-primary/20 to-accent/30 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold mb-6">
            Pronto para começar?
          </h2>
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-muted-foreground">
            Junte-se a milhares de pessoas que já estão utilizando a Berenice para organizar melhor seu dia a dia.
          </p>
          <Button 
            size="lg" 
            onClick={() => navigate('/login')}
            className="shadow-lg text-base"
          >
            Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border mt-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Berenice. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Termos</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacidade</a>
            <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Contato</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
