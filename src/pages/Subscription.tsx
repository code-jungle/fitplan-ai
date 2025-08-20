import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Crown, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export default function Subscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para assinar",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    toast({
      title: "Redirecionando...",
      description: "Você será redirecionado para o pagamento",
    });

    // Simular redirecionamento para Stripe
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Demo Mode",
        description: "Integração com Stripe será implementada em produção",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass-card border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/dashboard" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <Logo />
          <div></div>
        </div>
      </header>

      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
            Escolha seu <span className="text-gradient">plano</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Transforme seu corpo com IA adaptativa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Trial */}
          <Card className="glass-card relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-success px-4 py-1 rounded-full text-xs font-semibold text-success-foreground">
                ✨ Teste Grátis
              </div>
            </div>
            
            <CardHeader className="text-center pt-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-orbitron">Teste Gratuito</CardTitle>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">Grátis</p>
                <p className="text-sm text-muted-foreground">por 7 dias</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Planos personalizados de IA",
                  "Nutrição adaptativa",
                  "Treinos personalizados",
                  "Acompanhamento de progresso",
                  "Suporte básico"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-success" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <CustomButton variant="outline" className="w-full" disabled>
                Já ativo
              </CustomButton>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Após 7 dias, R$ 14,90/mês automaticamente
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="glass-card relative border-primary/50">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <div className="bg-primary px-4 py-1 rounded-full text-xs font-semibold text-primary-foreground">
                🚀 Mais Popular
              </div>
            </div>
            
            <CardHeader className="text-center pt-8">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl font-orbitron">FitPlan Premium</CardTitle>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-foreground">R$ 14,90</p>
                <p className="text-sm text-muted-foreground">por mês</p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="space-y-3">
                {[
                  "Tudo do plano gratuito",
                  "IA avançada com aprendizado",
                  "Planos ilimitados",
                  "Análises detalhadas",
                  "Suporte prioritário",
                  "Notificações inteligentes",
                  "Integração com wearables"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              <CustomButton 
                onClick={handleSubscribe} 
                disabled={loading}
                className="w-full"
              >
                {loading ? "Processando..." : "Assinar Premium"}
              </CustomButton>
              
              <div className="text-center">
                <p className="text-xs text-muted-foreground">
                  Cancele a qualquer momento • Sem compromisso
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-2xl mx-auto">
          <h2 className="text-2xl font-orbitron font-bold text-center text-foreground mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: "Como funciona o teste gratuito?",
                a: "Você tem 7 dias para testar todos os recursos premium sem custo. Após o período, será cobrado R$ 14,90/mês automaticamente."
              },
              {
                q: "Posso cancelar a qualquer momento?",
                a: "Sim! Você pode cancelar sua assinatura a qualquer momento sem taxas de cancelamento."
              },
              {
                q: "A IA realmente se adapta ao meu progresso?",
                a: "Sim, nossa IA aprende com seus hábitos, preferências e progresso para criar planos cada vez mais personalizados."
              },
              {
                q: "Funciona para todos os níveis de fitness?",
                a: "Absolutamente! Nossos algoritmos se adaptam desde iniciantes até atletas avançados."
              }
            ].map((faq, index) => (
              <Card key={index} className="glass-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}