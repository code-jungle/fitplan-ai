import { useState } from "react";
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

export default function ProgressPage() {
  const { user } = useAuth();
  const [newWeight, setNewWeight] = useState("");
  
  // Mock data - seria carregado do banco de dados
  const progressData = {
    currentWeight: 78.5,
    goalWeight: 75.0,
    startWeight: 82.0,
    weeklyProgress: [
      { week: "Sem 1", weight: 82.0 },
      { week: "Sem 2", weight: 81.2 },
      { week: "Sem 3", weight: 80.5 },
      { week: "Sem 4", weight: 79.8 },
      { week: "Sem 5", weight: 79.0 },
      { week: "Sem 6", weight: 78.5 },
    ],
    measurements: {
      chest: 95,
      waist: 85,
      hip: 98,
      arm: 35,
      thigh: 58
    },
    weeklyStats: {
      workoutsCompleted: 4,
      workoutsGoal: 5,
      caloriesAvg: 1850,
      caloriesGoal: 1800,
      waterAvg: 2.1,
      waterGoal: 2.5
    }
  };

  const progressPercentage = ((progressData.startWeight - progressData.currentWeight) / (progressData.startWeight - progressData.goalWeight)) * 100;

  const handleAddWeight = () => {
    if (newWeight) {
      // Aqui salvaria no banco
      console.log("Adding weight:", newWeight);
      setNewWeight("");
    }
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
                {Object.entries(progressData.measurements).map(([part, measurement]) => (
                  <div key={part} className="flex justify-between">
                    <span className="text-muted-foreground capitalize">{part}</span>
                    <span className="font-semibold text-foreground">{measurement}cm</span>
                  </div>
                ))}
                <CustomButton variant="outline" size="sm" className="w-full mt-4">
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