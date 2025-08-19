import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Sparkles, Zap, Target } from "lucide-react";
import { Link } from "react-router-dom";
import heroBackground from "@/assets/hero-bg.jpg";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-secondary" />
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--primary)/0.1),transparent_70%)]" />
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 animate-float">
        <div className="w-20 h-20 rounded-full bg-gradient-primary opacity-20 blur-xl" />
      </div>
      <div className="absolute top-40 right-20 animate-float" style={{ animationDelay: "2s" }}>
        <div className="w-32 h-32 rounded-full bg-gradient-primary opacity-15 blur-2xl" />
      </div>
      <div className="absolute bottom-20 left-1/4 animate-float" style={{ animationDelay: "4s" }}>
        <div className="w-24 h-24 rounded-full bg-secondary opacity-20 blur-xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        {/* Logo */}
        <div className="mb-8 animate-fade-in">
          <Logo size="xl" className="justify-center mb-4" />
          <p className="text-muted-foreground text-lg font-inter">
            Seu assistente pessoal de fitness com IA
          </p>
        </div>

        {/* Main headline */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-orbitron font-bold mb-6 leading-tight">
            Transforme sua{" "}
            <span className="text-gradient">saúde</span>
            <br />
            com IA
          </h2>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Planos personalizados de dieta e treino que se adaptam ao seu progresso diário
          </p>
        </div>

        {/* Value proposition */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="glass-card p-8 max-w-4xl mx-auto rounded-2xl">
            <h3 className="text-2xl md:text-3xl font-orbitron font-semibold mb-4 text-gradient">
              Experimente grátis por 7 dias
            </h3>
            <p className="text-lg md:text-xl text-foreground mb-6">
              Depois, apenas <span className="text-success font-bold">R$ 14,90/mês</span> para ter seu plano de saúde inteligente
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                <span className="text-foreground">Planos personalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-foreground">Adaptação automática</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <span className="text-foreground">Resultados reais</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <CustomButton size="xl" className="animate-glow">
                  Começar teste gratuito
                </CustomButton>
              </Link>
              <CustomButton variant="glass" size="xl">
                Ver como funciona
              </CustomButton>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="animate-fade-in" style={{ animationDelay: "0.6s" }}>
          <p className="text-sm text-muted-foreground mb-4">
            ✓ Sem compromisso • ✓ Cancele quando quiser • ✓ 100% seguro
          </p>
        </div>
      </div>
    </section>
  );
}