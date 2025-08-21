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
  Info,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingMeal, setGeneratingMeal] = useState(false);
  const [generatingWorkout, setGeneratingWorkout] = useState(false);

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

  // Calcular calorias baseado no perfil do usuário
  const calculateDailyCalories = () => {
    if (!dashboardData?.profile) return 0;
    
    const { weight, height, age, gender, activity_level } = dashboardData.profile;
    
    if (!weight || !height || !age) return 0;
    
    // Fórmula de Harris-Benedict para TMB (Taxa Metabólica Basal)
    let bmr = 0;
    if (gender === 'masculino') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }
    
    // Multiplicador de atividade
    const activityMultipliers = {
      'sedentario': 1.2,
      'leve': 1.375,
      'moderado': 1.55,
      'intenso': 1.725,
      'muito_intenso': 1.9
    };
    
    const multiplier = activityMultipliers[activity_level] || 1.2;
    const dailyCalories = Math.round(bmr * multiplier);
    
    // Ajustar baseado no objetivo
    const primaryGoal = dashboardData.profile.goals?.[0];
    if (primaryGoal === 'weight_loss' || primaryGoal === 'perda_peso') {
      return Math.round(dailyCalories * 0.85); // Déficit de 15%
    } else if (primaryGoal === 'muscle_gain' || primaryGoal === 'ganho_massa') {
      return Math.round(dailyCalories * 1.1); // Superávit de 10%
    }
    
    return dailyCalories;
  };

  // Gerar plano alimentar com IA
  const generateMealPlan = async () => {
    if (!user?.id) return;
    
    setGeneratingMeal(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-meal-plan', {
        body: { targetDate: new Date().toISOString().split('T')[0] }
      });
      
      if (error) throw error;
      
      if (data?.mealPlan) {
        // Salvar plano no banco
        const { error: saveError } = await supabase
          .from('meal_plans')
          .upsert([{
            user_id: user.id,
            plan_date: new Date().toISOString().split('T')[0],
            plan_data: data.mealPlan,
            created_at: new Date().toISOString()
          }]);
        
        if (!saveError) {
          toast({
            title: "🍽️ Plano alimentar gerado!",
            description: "Sua dieta personalizada foi criada com sucesso pela IA.",
          });
          loadDashboardData(); // Recarregar dados
        }
      }
    } catch (error) {
      console.error('Erro ao gerar plano alimentar:', error);
      toast({
        title: "❌ Erro ao gerar plano",
        description: "Não foi possível gerar o plano alimentar. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingMeal(false);
    }
  };

  // Gerar plano de treino com IA
  const generateWorkoutPlan = async () => {
    if (!user?.id) return;
    
    setGeneratingWorkout(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout-plan', {
        body: { targetDate: new Date().toISOString().split('T')[0] }
      });
      
      if (error) throw error;
      
      if (data?.workoutPlan) {
        // Salvar plano no banco
        const { error: saveError } = await supabase
          .from('workout_plans')
          .upsert([{
            user_id: user.id,
            plan_date: new Date().toISOString().split('T')[0],
            plan_data: data.workoutPlan,
            created_at: new Date().toISOString()
          }]);
        
        if (!saveError) {
          toast({
            title: "💪 Plano de treino gerado!",
            description: "Seu programa de exercícios foi criado com sucesso pela IA.",
          });
          loadDashboardData(); // Recarregar dados
        }
      }
    } catch (error) {
      console.error('Erro ao gerar plano de treino:', error);
      toast({
        title: "❌ Erro ao gerar treino",
        description: "Não foi possível gerar o plano de treino. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setGeneratingWorkout(false);
    }
  };

  // Configurar metas
  const configureGoals = () => {
    navigate('/profile');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  const dailyCalories = calculateDailyCalories();
  
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
                <User className="w-4 h-4 mr-2" />
                Perfil
              </CustomButton>
            </Link>
            <Link to="/subscription">
              <CustomButton variant="glass" size="sm">
                <CreditCard className="w-4 h-4 mr-2" />
                Assinatura
              </CustomButton>
            </Link>
            <Link to="/progress">
              <CustomButton variant="glass" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Progresso
              </CustomButton>
            </Link>
            <CustomButton variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </CustomButton>
          </div>
          {/* Mobile */}
          <div className="flex sm:hidden items-center gap-2">
            <Link to="/profile">
              <CustomButton variant="glass" size="icon">
                <User className="w-4 h-4" />
              </CustomButton>
            </Link>
            <Link to="/subscription">
              <CustomButton variant="glass" size="icon">
                <CreditCard className="w-4 h-4" />
              </CustomButton>
            </Link>
            <Link to="/progress">
              <CustomButton variant="glass" size="icon">
                <TrendingUp className="w-4 h-4" />
              </CustomButton>
            </Link>
            <CustomButton variant="outline" size="icon" onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
            </CustomButton>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-foreground mb-2">
            Olá, <span className="text-primary">{userName.toUpperCase()}</span>! 👋
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
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
                <Card className="glass-card p-6 animate-pulse">
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
                  description: dashboardData?.profile?.goals?.length ? "Metas definidas" : "Defina suas metas",
                  action: dashboardData?.profile?.goals?.length ? null : configureGoals,
                  actionText: "Configurar"
                },
                { 
                  icon: Activity, 
                  label: "Calorias", 
                  value: dailyCalories > 0 ? `${dailyCalories.toLocaleString()}` : "N/A",
                  color: "text-primary",
                  description: dailyCalories > 0 ? "Meta diária calculada" : "Complete seu perfil",
                  action: dailyCalories === 0 ? configureGoals : null,
                  actionText: "Completar perfil"
                },
                { 
                  icon: Dumbbell, 
                  label: "Treinos", 
                  value: dashboardData?.workoutPlan ? "12" : "N/A",
                  color: "text-secondary",
                  description: dashboardData?.workoutPlan ? "Treino de hoje" : "Gere seu treino",
                  action: !dashboardData?.workoutPlan ? generateWorkoutPlan : null,
                  actionText: "Gerar treino"
                },
                { 
                  icon: TrendingUp, 
                  label: "Progresso", 
                  value: dashboardData?.progress ? `${dashboardData.progress.weight}kg` : "N/A",
                  color: "text-warning",
                  description: dashboardData?.progress ? "Último registro" : "Registre seu peso",
                  action: !dashboardData?.progress ? () => navigate('/progress') : null,
                  actionText: "Registrar peso"
                }
              ].map((stat, index) => (
                <Card key={index} className="glass-card p-6 text-center">
                  <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                  <p className="text-2xl font-orbitron font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                  {stat.action && (
                    <CustomButton 
                      variant="outline" 
                      size="sm" 
                      className="mt-3 w-full"
                      onClick={stat.action}
                    >
                      {stat.actionText}
                    </CustomButton>
                  )}
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
                    <CustomButton 
                      variant="outline" 
                      size="sm"
                      onClick={generateMealPlan}
                      disabled={generatingMeal}
                    >
                      {generatingMeal ? "Gerando..." : dashboardData?.mealPlan ? "Ver completo" : "Gerar plano"}
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
                    <CustomButton 
                      variant="outline" 
                      size="sm"
                      onClick={generateWorkoutPlan}
                      disabled={generatingWorkout}
                    >
                      {generatingWorkout ? "Gerando..." : dashboardData?.workoutPlan ? "Iniciar treino" : "Gerar treino"}
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
                        🎯 Parabéns! Você está 15% mais consistente que na semana passada.
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