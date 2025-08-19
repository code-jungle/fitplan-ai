import { CustomButton } from "@/components/ui/custom-button";
import { Check, Star } from "lucide-react";
import { Link } from "react-router-dom";

export function Pricing() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 text-gradient">
            Investimento em sua saúde
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Um preço justo para uma transformação real. Comece gratuitamente e veja os resultados.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="glass-card p-8 rounded-2xl border-2 border-primary/30 relative overflow-hidden">
            {/* Popular badge */}
            <div className="absolute -top-3 -right-3">
              <div className="bg-gradient-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-1">
                <Star className="w-4 h-4" />
                Mais popular
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-orbitron font-bold text-foreground mb-4">
                FitPlan AI Premium
              </h3>
              <div className="mb-4">
                <span className="text-5xl font-orbitron font-bold text-gradient">R$ 14,90</span>
                <span className="text-muted-foreground">/mês</span>
              </div>
              <p className="text-success font-semibold text-lg">
                7 dias grátis para testar
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Planos de dieta personalizados",
                "Treinos adaptados ao seu nível",
                "IA que aprende com seus hábitos",
                "Ajustes em tempo real",
                "Gráficos de progresso avançados",
                "Notificações inteligentes",
                "Suporte prioritário 24/7",
                "Acesso a todos os recursos"
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-success-foreground" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/auth">
              <CustomButton size="lg" className="w-full mb-4">
                Começar teste gratuito
              </CustomButton>
            </Link>

            <p className="text-xs text-muted-foreground text-center">
              Cancele quando quiser • Sem taxas ocultas • Pagamento 100% seguro
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Mais de <span className="text-primary font-semibold">10.000 pessoas</span> já transformaram suas vidas com o FitPlanAI
          </p>
        </div>
      </div>
    </section>
  );
}