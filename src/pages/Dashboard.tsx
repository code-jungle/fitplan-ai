import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Activity,
  Apple,
  Calendar,
  ChefHat,
  Dumbbell,
  Target,
  TrendingUp,
  User,
  Zap,
  LogOut,
  CreditCard,
  Plus,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Carregar dados do perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Carregar dados de progresso
      const { data: progressData } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false })
        .limit(1);

      // Carregar planos de hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: mealPlan } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan_date', today)
        .single();

      const { data: workoutPlan } = await supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('plan_date', today)
        .single();

      setDashboardData({
        profile: profileData,
        progress: progressData?.[0],
        mealPlan,
        workoutPlan
      });
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass-card border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Logo size="sm" />
          {/* Desktop */}
          <div className="hidden sm:flex items-center gap-4">
            <Link to="/profile">
              <CustomButton variant="glass" size="sm">
                <User className="w-4 h-4" />
                Perfil
              </CustomButton>
            </Link>
            <Link to="/subscription">
              <CustomButton variant="glass" size="sm">
                Assinatura
              </CustomButton>
            </Link>
            <Link to="/progress">
              <CustomButton variant="glass" size="sm">
                Progresso
              </CustomButton>
            </Link>
            <CustomButton variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              Sair
            </CustomButton>
          </div>
          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/profile" title="Perfil">
              <CustomButton variant="glass" size="icon" aria-label="Perfil">
                <User className="w-5 h-5" />
              </CustomButton>
            </Link>
            <Link to="/subscription" title="Assinatura">
              <CustomButton variant="glass" size="icon" aria-label="Assinatura">
                <CreditCard className="w-5 h-5" />
              </CustomButton>
            </Link>
            <Link to="/progress" title="Progresso">
              <CustomButton variant="glass" size="icon" aria-label="Progresso">
                <TrendingUp className="w-5 h-5" />
              </CustomButton>
            </Link>
            <CustomButton
              variant="ghost"
              size="icon"
              aria-label="Sair"
              onClick={handleSignOut}
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </CustomButton>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
            Olá, <span className="text-gradient">{userName}</span>! 👋
          </h1>
          <p className="text-muted-foreground">
            Vamos continuar sua jornada de transformação hoje
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <Card key={index} className="glass-card p-6 text-center animate-pulse">
                  <div className="w-8 h-8 bg-muted rounded mx-auto mb-3"></div>
                  <div className="h-8 bg-muted rounded mb-2"></div>
                  <div className="h-4 bg-muted rounded"></div>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {Array.from({ length: 2 }).map((_, index) => (
                  <Card key={index} className="glass-card p-6 animate-pulse">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-lg"></div>
                        <div>
                          <div className="h-5 bg-muted rounded mb-2"></div>
                          <div className="h-4 bg-muted rounded"></div>
                        </div>
                      </div>
                      <div className="w-20 h-8 bg-muted rounded"></div>
                    </div>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded-lg"></div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
              <div className="space-y-6">
                <Card className="glass-card p-6 animate-pulse">
                  <div className="h-6 bg-muted rounded mb-6"></div>
                  <div className="space-y-4">
                    <div className="h-20 bg-muted rounded"></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="h-16 bg-muted rounded"></div>
                      <div className="h-16 bg-muted rounded"></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { 
                  icon: Target, 
                  label: "Meta Diária", 
                  value: dashboardData?.profile?.goals?.length ? "75%" : "N/A",
                  color: "text-success",
                  description: dashboardData?.profile?.goals?.length ? "Metas definidas" : "Defina suas metas"
                },
                { 
                  icon: Activity, 
                  label: "Calorias", 
                  value: dashboardData?.mealPlan ? "1,847" : "N/A",
                  color: "text-primary",
                  description: dashboardData?.mealPlan ? "Plano ativo" : "Gere seu plano"
                },
                { 
                  icon: Dumbbell, 
                  label: "Treinos", 
                  value: dashboardData?.workoutPlan ? "12" : "N/A",
                  color: "text-secondary",
                  description: dashboardData?.workoutPlan ? "Treino de hoje" : "Gere seu treino"
                },
                { 
                  icon: TrendingUp, 
                  label: "Progresso", 
                  value: dashboardData?.progress ? `${dashboardData.progress.weight}kg` : "N/A",
                  color: "text-warning",
                  description: dashboardData?.progress ? "Último registro" : "Registre seu peso"
                }
              ].map((stat, index) => (
                <Card key={index} className="glass-card p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-2xl font-orbitron font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
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
                        <p className="text-sm text-muted-foreground">
                          {dashboardData?.mealPlan ? "Personalizado pela IA" : "Gere seu plano personalizado"}
                        </p>
                      </div>
                    </div>
                    <CustomButton variant="outline" size="sm">
                      {dashboardData?.mealPlan ? "Ver completo" : "Gerar plano"}
                    </CustomButton>
                  </div>

                  {dashboardData?.mealPlan ? (
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
                  ) : (
                    <div className="text-center py-8">
                      <ChefHat className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Nenhum plano alimentar gerado</p>
                      <p className="text-sm text-muted-foreground">Clique em "Gerar plano" para criar seu cardápio personalizado</p>
                    </div>
                  )}
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
                        <p className="text-sm text-muted-foreground">
                          {dashboardData?.workoutPlan ? "Foco em pernas • 45 min" : "Gere seu treino personalizado"}
                        </p>
                      </div>
                    </div>
                    <CustomButton variant="outline" size="sm">
                      {dashboardData?.workoutPlan ? "Iniciar treino" : "Gerar treino"}
                    </CustomButton>
                  </div>

                  {dashboardData?.workoutPlan ? (
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
                  ) : (
                    <div className="text-center py-8">
                      <Dumbbell className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Nenhum treino gerado</p>
                      <p className="text-sm text-muted-foreground">Clique em "Gerar treino" para criar seu programa personalizado</p>
                    </div>
                  )}
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
                  
                  {dashboardData?.progress ? (
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-muted-foreground">Meta de peso</span>
                          <span className="text-foreground">
                            {dashboardData.progress.weight}kg / {dashboardData.profile?.weight || 0}kg
                          </span>
                        </div>
                        <Progress value={75} className="h-2" />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-success">-2.1kg</p>
                          <p className="text-xs text-muted-foreground">Esta semana</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">12</p>
                          <p className="text-xs text-muted-foreground">Treinos</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-2">Nenhum progresso registrado</p>
                      <p className="text-sm text-muted-foreground">Registre seu peso para acompanhar seu progresso</p>
                      <Link to="/progress">
                        <CustomButton variant="outline" size="sm" className="mt-3">
                          <Plus className="w-4 h-4 mr-2" />
                          Registrar peso
                        </CustomButton>
                      </Link>
                    </div>
                  )}
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
                        �� Parabéns! Você está 15% mais consistente que na semana passada.
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
          </>
        )}
      </div>
    </div>
  );
}