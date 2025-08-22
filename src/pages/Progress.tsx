import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { CustomButton } from "@/components/ui/custom-button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { 
  ArrowLeft,
  TrendingUp,
  Target,
  Ruler,
  Weight,
  Calendar,
  Plus,
  Minus,
  Activity,
  Zap
} from "lucide-react";
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

export default function Progress() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [progressData, setProgressData] = useState<ProgressData>({
    currentWeight: 0,
    goalWeight: 0,
    startWeight: 0,
    weeklyProgress: [],
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
  const [loading, setLoading] = useState(true);
  const [newWeight, setNewWeight] = useState('');
  const [isAddingWeight, setIsAddingWeight] = useState(false);

  const loadProgressData = useCallback(async () => {
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
      const { data: progressRecords } = await supabase
        .from('progress_tracking')
        .select('*')
        .eq('user_id', user.id)
        .order('record_date', { ascending: false });

      if (progressRecords && progressRecords.length > 0) {
        const currentWeight = progressRecords[0].weight || 0;
        const startWeight = profileData?.weight || currentWeight;
        const goalWeight = startWeight * 0.9; // Meta de 10% de redução

        const weeklyProgress = progressRecords.slice(0, 6).map((record, index) => ({
          week: `Sem ${index + 1}`,
          weight: record.weight || 0,
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

        setProgressData(prev => ({
          ...prev,
          currentWeight,
          goalWeight,
          startWeight,
          weeklyProgress,
          weeklyStats: {
            workoutsCompleted: 0,
            workoutsGoal: 5,
            caloriesAvg: 0,
            caloriesGoal: 1800,
            waterAvg: 0,
            waterGoal: 2.5
          }
        }));
      } else {
        // Se não há dados de progresso, usar peso inicial do perfil
        const startWeight = profileData?.weight || 70;
        setProgressData(prev => ({
          ...prev,
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
        }));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de progresso:', error);
      toast({
        title: "Erro ao carregar dados",
        description: "Não foi possível carregar seus dados de progresso.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (user?.id) {
      loadProgressData();
    }
  }, [user?.id, loadProgressData]);

  const handleAddWeight = async () => {
    if (!newWeight || !user?.id) return;
    
    const weight = parseFloat(newWeight);
    if (isNaN(weight) || weight <= 0) {
      toast({
        title: "Peso inválido",
        description: "Digite um peso válido maior que zero.",
        variant: "destructive"
      });
      return;
    }

    setIsAddingWeight(true);
    try {
      const { error } = await supabase
        .from('progress_tracking')
        .insert([{
          user_id: user.id,
          weight,
          record_date: new Date().toISOString().split('T')[0],
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast({
        title: "Peso registrado!",
        description: "Seu progresso foi atualizado com sucesso.",
      });

      setNewWeight('');
      loadProgressData(); // Recarregar dados
    } catch (error) {
      console.error('Erro ao registrar peso:', error);
      toast({
        title: "Erro ao registrar peso",
        description: "Não foi possível salvar o registro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsAddingWeight(false);
    }
  };

  const calculateProgress = () => {
    if (progressData.startWeight === 0 || progressData.goalWeight === 0) return 0;
    const totalWeight = progressData.startWeight - progressData.goalWeight;
    const currentProgress = progressData.startWeight - progressData.currentWeight;
    return Math.min(Math.max((currentProgress / totalWeight) * 100, 0), 100);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-secondary">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-32"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass-card border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <CustomButton 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Voltar</span>
          </CustomButton>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-orbitron font-bold text-foreground">
            Acompanhe seu Progresso
          </h1>
          <div className="w-20"></div> {/* Spacer para centralizar título */}
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Progress Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Weight Progress */}
            <Card className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <Weight className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-orbitron font-semibold text-foreground">Progresso do Peso</h3>
                    <p className="text-sm text-muted-foreground">Acompanhe sua evolução semanal</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-card/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{progressData.currentWeight}kg</p>
                  <p className="text-sm text-muted-foreground">Peso Atual</p>
                </div>
                <div className="text-center p-4 bg-card/30 rounded-lg">
                  <p className="text-2xl font-bold text-success">{progressData.startWeight}kg</p>
                  <p className="text-sm text-muted-foreground">Peso Inicial</p>
                </div>
                <div className="text-center p-4 bg-card/30 rounded-lg">
                  <p className="text-2xl font-bold text-warning">{progressData.goalWeight.toFixed(1)}kg</p>
                  <p className="text-sm text-muted-foreground">Meta</p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Progresso geral</span>
                  <span className="text-foreground">{calculateProgress().toFixed(1)}%</span>
                </div>
                <ProgressBar value={calculateProgress()} className="h-3" />
              </div>

              {/* Add New Weight */}
              <div className="flex items-end gap-4 p-4 bg-card/30 rounded-lg">
                <div className="flex-1">
                  <Label htmlFor="newWeight" className="text-sm text-muted-foreground">Novo Peso (kg)</Label>
                  <Input
                    id="newWeight"
                    type="number"
                    step="0.1"
                    placeholder="70.5"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <CustomButton 
                  onClick={handleAddWeight}
                  disabled={isAddingWeight || !newWeight}
                  size="sm"
                >
                  {isAddingWeight ? "Salvando..." : "Registrar"}
                </CustomButton>
              </div>
            </Card>

            {/* Weekly Progress Chart */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-semibold text-foreground">Progresso Semanal</h3>
              </div>
              
              <div className="grid grid-cols-6 gap-4">
                {progressData.weeklyProgress.map((week, index) => (
                  <div key={index} className="text-center">
                    <div className="text-xs text-muted-foreground mb-2">{week.week}</div>
                    <div className="text-lg font-bold text-foreground mb-1">
                      {week.weight}kg
                    </div>
                    {week.date && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(week.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Measurements */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Ruler className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-semibold text-foreground">Medidas</h3>
              </div>
              
              {Object.keys(progressData.measurements).length > 0 ? (
                <div className="space-y-3">
                  {Object.entries(progressData.measurements).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center p-2 bg-card/30 rounded">
                      <span className="text-sm text-muted-foreground capitalize">
                        {key === 'chest' ? 'Peito' : 
                         key === 'waist' ? 'Cintura' : 
                         key === 'hip' ? 'Quadril' : 
                         key === 'arm' ? 'Braço' : 
                         key === 'thigh' ? 'Coxa' : key}
                      </span>
                      <span className="text-sm font-medium text-foreground">{value}cm</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <Ruler className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Nenhuma medida registrada</p>
                  <p className="text-xs text-muted-foreground">Funcionalidade em desenvolvimento</p>
                </div>
              )}
            </Card>

            {/* Weekly Stats */}
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="w-6 h-6 text-primary" />
                <h3 className="font-orbitron font-semibold text-foreground">Estatísticas Semanais</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Treinos completados</span>
                  <span className="text-sm font-medium text-foreground">
                    {progressData.weeklyStats.workoutsCompleted}/{progressData.weeklyStats.workoutsGoal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Calorias médias</span>
                  <span className="text-sm font-medium text-foreground">
                    {progressData.weeklyStats.caloriesAvg}/{progressData.weeklyStats.caloriesGoal}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Água (L)</span>
                  <span className="text-sm font-medium text-foreground">
                    {progressData.weeklyStats.waterAvg}/{progressData.weeklyStats.waterGoal}
                  </span>
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
                    🎯 Continue assim! Sua consistência está excelente.
                  </p>
                </div>
                
                <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg">
                  <p className="text-sm text-primary-foreground">
                    💡 Dica: Beba água antes das refeições para controlar o apetite.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}