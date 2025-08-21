import { Brain, Utensils, Dumbbell, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA que Aprende",
    description: "Algoritmos que se adaptam aos seus hábitos únicos"
  },
  {
    icon: Utensils,
    title: "Nutrição Inteligente",
    description: "Planos alimentares que evoluem com você"
  },
  {
    icon: Dumbbell,
    title: "Treinos Adaptativos",
    description: "Exercícios que se ajustam ao seu progresso"
  },
  {
    icon: TrendingUp,
    title: "Resultados Reais",
    description: "Acompanhamento contínuo e otimização"
  }
];

export function MobileFeatures() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-orbitron font-bold text-gradient mb-4">
            Tecnologia avançada
          </h2>
          <p className="text-muted-foreground">
            Descubra como nossa IA revoluciona sua jornada fitness
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-6 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-orbitron font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}