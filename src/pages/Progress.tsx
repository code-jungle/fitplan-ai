import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  TrendingUp, 
  Target, 
  Calendar,
  Scale,
  Ruler,
  Activity,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProgressData {
  currentWeight: number;
  goalWeight: number;
  startWeight: number;
  weeklyProgress: Array<{ week: string; weight: number; date: string | null }>;
  measurements: Partial<{
    chest: number;
    waist: number;
    hip: number;
    arm: number;
    thigh: number;
  }>;
  weeklyStats: {
    workoutsCompleted: number;
    workoutsGoal: number;
    caloriesAvg: number;
    caloriesGoal: number;
    waterAvg: number;
    waterGoal: number;
  };
}

export default function ProgressPage() {
  const { user } = useAuth();
  const [newWeight, setNewWeight] = useState("");
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    if (user?.id) {
      loadProgressData();
    }
  }, [user?.id]);

  const loadProgressData = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Carregar dados de progresso do banco
      const { data: progressRecords, error: progressError } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });

      if (progressError) {
        console.error('Erro ao carregar progresso:', progressError);
        return;
      }

      // Carregar perfil para obter peso inicial e meta
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('weight, goals')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', profileError);
      }

      if (progressRecords && progressRecords.length > 0) {
        const currentWeight = progressRecords[0].weight || 0;
        const startWeight = profileData?.weight || currentWeight;
        const goalWeight = startWeight * 0.9; // Meta de 10% de redução

        // Criar progresso semanal baseado em dados reais
        const weeklyProgress = progressRecords.slice(0, 6).map((record, index) => ({
          week: `Sem ${index + 1}`,
          weight: record.weight,
          date: record.record_date
        }));

        // Preencher semanas restantes se necessário
        while (weeklyProgress.length < 6) {
          weeklyProgress.push({
            week: `Sem ${weeklyProgress.length + 1}`,
            weight: startWeight,
            date: null
          });
        }

        setProgressData({
          currentWeight,
          goalWeight,
          startWeight,
          weeklyProgress,
          measurements: {}, // Será implementado quando houver tabela de medições
          weeklyStats: {
            workoutsCompleted: 0, // Será implementado quando houver tabela de treinos
            workoutsGoal: 5,
            caloriesAvg: 0, // Será implementado quando houver tabela de calorias
            caloriesGoal: 1800,
            waterAvg: 0, // Será implementado quando houver tabela de água
            waterGoal: 2.5
          }
        });
      } else {
        // Usuário sem dados de progresso
        const startWeight = profileData?.weight || 70;
        setProgressData({
          currentWeight: startWeight,
          goalWeight: startWeight * 0.9,
          startWeight,
          weeklyProgress: Array.from({ length: 6 }, (_, i) => ({
            week: `Sem ${i + 1}`,
            weight: startWeight,
            date: null
          })),
          measurements: {},
          weeklyStats: {
            workoutsCompleted: 0,
            workoutsGoal: 5,
            caloriesAvg: 0,
            caloriesGoal: 1800,
            waterAvg: 0,
            waterGoal: 2.5
          }
        });
      }
    } catch (error) {
      console.error('Erro ao carregar dados de progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddWeight = async () => {
    if (!newWeight || !user?.id || !progressData) return;

    try {
      const weight = parseFloat(newWeight);
      if (isNaN(weight) || weight <= 0) {
        toast({
          title: "Peso inválido",
          description: "Digite um peso válido maior que zero.",
          variant: "destructive"
        });
        return;
      }

      // Salvar novo peso no banco
      const { error } = await supabase
        .from('progress_tracking')
        .insert([{
          user_id: user.id,
          record_date: new Date().toISOString().split('T')[0],
          weight: weight,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }]);

      if (error) {
        throw error;
      }

      // Atualizar dados locais
      setProgressData(prev => prev ? {
        ...prev,
        currentWeight: weight,
        weeklyProgress: [
          ...prev.weeklyProgress.slice(1),
          { week: `Sem ${prev.weeklyProgress.length + 1}`, weight, date: new Date().toISOString().split('T')[0] }
        ]
      } : null);

      setNewWeight("");
      toast({
        title: "Peso registrado!",
        description: "Seu novo peso foi salvo com sucesso.",
      });

      // Recarregar dados
      await loadProgressData();
    } catch (error) {
      console.error('Erro ao salvar peso:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o peso. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <div className="container mx-auto p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando progresso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!progressData) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <div className="container mx-auto p-4">
          <div className="text-center">
            <p className="text-muted-foreground">Nenhum dado de progresso encontrado.</p>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = ((progressData.startWeight - progressData.currentWeight) / (progressData.startWeight - progressData.goalWeight)) * 100;

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

      <div className="container mx-auto p-6 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-3xl font-orbitron font-bold text-foreground mb-2">
            Meu <span className="text-gradient">Progresso</span>
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua jornada de transformação
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Weight Progress */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Progress Card */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-orbitron">Progresso de Peso</CardTitle>
                    <p className="text-sm text-muted-foreground">Meta: {progressData.goalWeight} kg</p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-orbitron font-bold text-foreground mb-2">
                    {progressData.currentWeight} kg
                  </div>
                  <p className="text-muted-foreground">
                    Faltam {(progressData.currentWeight - progressData.goalWeight).toFixed(1)} kg para sua meta
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progresso</span>
                    <span className="text-foreground">{progressPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-foreground">{progressData.startWeight}</p>
                    <p className="text-sm text-muted-foreground">Inicial</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-primary">{progressData.currentWeight}</p>
                    <p className="text-sm text-muted-foreground">Atual</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-success">{progressData.goalWeight}</p>
                    <p className="text-sm text-muted-foreground">Meta</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-xl font-orbitron">Estatísticas Semanais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Activity className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {progressData.weeklyStats.workoutsCompleted}/{progressData.weeklyStats.workoutsGoal}
                    </p>
                    <p className="text-sm text-muted-foreground">Treinos esta semana</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-secondary/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Target className="w-8 h-8 text-secondary" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {progressData.weeklyStats.caloriesAvg}
                    </p>
                    <p className="text-sm text-muted-foreground">Calorias médias/dia</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-success/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                      <Scale className="w-8 h-8 text-success" />
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {progressData.weeklyStats.waterAvg}L
                    </p>
                    <p className="text-sm text-muted-foreground">Água média/dia</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Weight */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg font-orbitron">Registrar Peso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="weight">Peso atual (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    placeholder="Ex: 78.5"
                    className="bg-input/50 border-border/50"
                  />
                </div>
                <CustomButton onClick={handleAddWeight} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar
                </CustomButton>
              </CardContent>
            </Card>

            {/* Body Measurements */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Ruler className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-orbitron">Medidas</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.keys(progressData.measurements).length > 0 ? (
                  Object.entries(progressData.measurements).map(([part, measurement]) => (
                    <div key={part} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">{part}</span>
                      <span className="font-semibold text-foreground">{measurement}cm</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Ruler className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Nenhuma medida registrada</p>
                    <p className="text-xs text-muted-foreground">Funcionalidade em desenvolvimento</p>
                  </div>
                )}
                <CustomButton variant="outline" size="sm" className="w-full mt-4" disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Atualizar medidas
                </CustomButton>
              </CardContent>
            </Card>

            {/* Recent Progress */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg font-orbitron">Progresso Recente</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {progressData.weeklyProgress.slice(-4).map((week, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{week.week}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{week.weight}kg</span>
                      {index > 0 && (
                        <span className={`text-xs ${
                          week.weight < progressData.weeklyProgress[progressData.weeklyProgress.length - 2 - index]?.weight 
                            ? 'text-success' : 'text-warning'
                        }`}>
                          {week.weight < progressData.weeklyProgress[progressData.weeklyProgress.length - 2 - index]?.weight 
                            ? '↓' : '↑'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}