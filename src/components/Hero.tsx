import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Lock, Play, Brain } from "lucide-react";
import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Header/Navigation */}
      <header className="relative z-20 p-6">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <Link 
              to="/auth" 
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground font-semibold rounded-lg transition-all duration-300 hover:from-primary/90 hover:to-primary/70 hover:shadow-lg hover:shadow-primary/25 transform hover:scale-105 border-0"
            >
              Entrar
            </Link>
            
            
          </div>
        </div>
      </header>

      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-primary/20" />
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className="max-w-md mx-auto text-center">
          
          {/* Main headline */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 leading-tight">
              Seu assistente{" "}
              <span className="text-gradient">fitness de IA</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed px-4">
              Planos personalizados de dieta e treino que se adaptarão ao seu progresso em tempo real. 
              Inteligência artificial que aprende com seus hábitos para resultados reais.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-4 mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth?mode=signup" className="block">
              <CustomButton size="lg" className="w-full text-lg py-6 animate-glow">
                <Lock className="w-5 h-5 mr-2" />
                Experimente Grátis por 7 Dias
              </CustomButton>
            </Link>
          </div>

          {/* IA Feature Highlight */}
          <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="glass-card p-6 rounded-2xl border border-primary/20">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-orbitron font-semibold text-foreground mb-2">
                IA Adaptativa
              </h3>
              <p className="text-muted-foreground text-sm">
                Nossa inteligência artificial aprende continuamente com seus dados para otimizar seus resultados
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}