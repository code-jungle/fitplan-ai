import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Activity,
  Apple,
  Calendar,
  ChefHat,
  Dumbbell,
  Target,
  TrendingUp,
  User,
  Zap
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass-card border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <CustomButton variant="glass" size="sm">
              <User className="w-4 h-4" />
              Perfil
            </CustomButton>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
            Olá, <span className="text-gradient">João</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Vamos continuar sua jornada de transformação hoje
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Target, label: "Meta Diária", value: "75%", color: "text-success" },
            { icon: Activity, label: "Calorias", value: "1,847", color: "text-primary" },
            { icon: Dumbbell, label: "Treinos", value: "12", color: "text-secondary" },
            { icon: TrendingUp, label: "Progresso", value: "+2.1kg", color: "text-warning" }
          ].map((stat, index) => (
            <Card key={index} className="glass-card p-6 text-center">
              <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
              <p className="text-2xl font-orbitron font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Today's Plan */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meal Plan */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-foreground">Plano Alimentar</h3>
                    <p className="text-sm text-muted-foreground">Personalizado pela IA</p>
                  </div>
                </div>
                <CustomButton variant="outline" size="sm">Ver completo</CustomButton>
              </div>

              <div className="space-y-4">
                {[
                  { meal: "Café da manhã", food: "Aveia com frutas vermelhas", calories: "320 kcal", time: "07:00" },
                  { meal: "Almoço", food: "Salmão grelhado com quinoa", calories: "485 kcal", time: "12:00" },
                  { meal: "Jantar", food: "Frango com batata doce", calories: "410 kcal", time: "19:00" }
                ].map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-card/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Apple className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{meal.food}</p>
                        <p className="text-sm text-muted-foreground">{meal.meal} • {meal.time}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-primary">{meal.calories}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Workout Plan */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Dumbbell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-foreground">Treino de Hoje</h3>
                    <p className="text-sm text-muted-foreground">Foco em pernas • 45 min</p>
                  </div>
                </div>
                <CustomButton variant="outline" size="sm">Iniciar treino</CustomButton>
              </div>

              <div className="space-y-3">
                {[
                  "Agachamento livre - 4x12",
                  "Leg press - 3x15",
                  "Stiff - 4x10",
                  "Panturrilha - 3x20"
                ].map((exercise, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-card/30 rounded-lg">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className="text-foreground">{exercise}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Progress Sidebar */}
          <div className="space-y-6">
            {/* Weekly Progress */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-semibold text-foreground">Progresso Semanal</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Meta de peso</span>
                    <span className="text-foreground">78kg / 80kg</span>
                  </div>
                  <Progress value={97} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Treinos</span>
                    <span className="text-foreground">4 / 5</span>
                  </div>
                  <Progress value={80} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Hidratação</span>
                    <span className="text-foreground">2.1L / 2.5L</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
              </div>
            </Card>

            {/* AI Insights */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-semibold text-foreground">Insights da IA</h3>
              </div>
              
              <div className="space-y-3">
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success-foreground">
                    🎉 Parabéns! Você está 15% mais consistente que na semana passada.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary-foreground">
                    💡 Sugestão: Adicione 5 minutos de aquecimento antes do treino para melhor performance.
                  </p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="space-y-3">
              <CustomButton variant="glass" className="w-full justify-start">
                <Calendar className="w-4 h-4" />
                Agendar treino
              </CustomButton>
              <CustomButton variant="glass" className="w-full justify-start">
                <Activity className="w-4 h-4" />
                Registrar peso
              </CustomButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}