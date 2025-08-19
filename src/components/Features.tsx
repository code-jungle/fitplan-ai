import { Brain, Utensils, Dumbbell, TrendingUp, Shield, Smartphone } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "IA Adaptativa",
    description: "Algoritmos avançados que aprendem com seus hábitos e preferências para criar planos únicos."
  },
  {
    icon: Utensils,
    title: "Planos Alimentares",
    description: "Dietas personalizadas baseadas em suas restrições, objetivos e preferências culinárias."
  },
  {
    icon: Dumbbell,
    title: "Treinos Personalizados",
    description: "Exercícios adaptados ao seu nível, equipamentos disponíveis e tempo livre."
  },
  {
    icon: TrendingUp,
    title: "Acompanhamento em Tempo Real",
    description: "Monitore seu progresso e receba ajustes automáticos baseados nos seus resultados."
  },
  {
    icon: Shield,
    title: "Dados Seguros",
    description: "Suas informações pessoais protegidas com criptografia de nível militar."
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    description: "Acesso completo pelo celular, com notificações e lembretes inteligentes."
  }
];

export function Features() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-orbitron font-bold mb-6 text-gradient">
            Tecnologia que transforma vidas
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Descubra como nossa IA revoluciona sua jornada fitness com recursos inteligentes e personalizados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card p-8 rounded-2xl hover:shadow-glow transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-orbitron font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}