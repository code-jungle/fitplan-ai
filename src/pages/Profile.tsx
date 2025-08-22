import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Palette,
  Target,
  Activity,
  Apple,
  Dumbbell,
  Save,
  Eye,
  EyeOff,
  Brain,
  Zap,
  Plus,
  CreditCard,
  TrendingUp
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { usePWA } from "@/hooks/use-pwa";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  personalInfo: {
    name: string;
    email: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    height: number;
    weight: number;
    activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  };
  fitnessGoals: {
    primary: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
    secondary: string[];
    targetWeight?: number;
    targetDate?: string;
  };
  preferences: {
    dietType: 'balanced' | 'low_carb' | 'high_protein' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'dash' | 'custom';
    workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed' | 'yoga' | 'pilates' | 'crossfit' | 'running' | 'cycling' | 'swimming';
    workoutDuration: '15min' | '30min' | '45min' | '60min' | '75min' | '90min' | '120min';
    workoutDays: number;
    notifications: {
      meals: boolean;
      workouts: boolean;
      progress: boolean;
      reminders: boolean;
      achievements: boolean;
      weeklyReports: boolean;
    };
  };
  restrictions: {
    allergies: string[];
    intolerances: string[];
    medications: string[];
    injuries: string[];
  };
}

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { notificationsEnabled, requestNotificationPermission } = usePWA();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadUserProfile();
    }
  }, [user?.id]);

  const loadUserProfile = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      
      // Carregar perfil principal
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Erro ao carregar perfil:', profileError);
        return;
      }

      // Carregar preferências de treino
      const { data: workoutData, error: workoutError } = await supabase
        .from('workout_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Carregar preferências de dieta
      const { data: dietData, error: dietError } = await supabase
        .from('dietary_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Carregar preferências de notificação
      const { data: notificationData, error: notificationError } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Combinar todos os dados
      const combinedProfile: UserProfile = {
        personalInfo: {
          name: profileData?.name || profileData?.full_name || user?.user_metadata?.full_name || 'Usuário', // Adicionando fallback para name
          email: user?.email || '',
          age: profileData?.age || 0,
          gender: profileData?.gender === 'masculino' ? 'male' : 
                  profileData?.gender === 'feminino' ? 'female' : 'other',
          height: profileData?.height || 0,
          weight: profileData?.weight || 0,
          activityLevel: profileData?.activity_level === 'sedentario' ? 'sedentary' :
                        profileData?.activity_level === 'leve' ? 'light' :
                        profileData?.activity_level === 'moderado' ? 'moderate' :
                        profileData?.activity_level === 'intenso' ? 'active' : 'very_active'
        },
        fitnessGoals: {
          primary: profileData?.goals?.[0] || 'general_fitness',
          secondary: profileData?.goals?.slice(1) || [],
          targetWeight: profileData?.weight || 0,
          targetDate: new Date().toISOString().split('T')[0]
        },
        preferences: {
          dietType: dietData?.diet_type || 'balanced',
          workoutType: workoutData?.workout_type || 'mixed',
          workoutDuration: workoutData?.workout_duration || '60min',
          workoutDays: workoutData?.workout_days || 0,
          notifications: {
            meals: notificationData?.meals ?? true,
            workouts: notificationData?.workouts ?? true,
            progress: notificationData?.progress ?? true,
            reminders: notificationData?.reminders ?? false,
            achievements: notificationData?.achievements ?? true,
            weeklyReports: notificationData?.weekly_reports ?? true
          }
        },
        restrictions: {
          allergies: dietData?.allergies || [],
          intolerances: dietData?.intolerances || [],
          medications: dietData?.medications || [],
          injuries: dietData?.injuries || []
        }
      };

      setProfile(combinedProfile);
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id || !profile) return;

    setLoading(true);
    try {
      // Salvar perfil principal
      const profileData = {
        full_name: profile.personalInfo.name,
        age: profile.personalInfo.age,
        gender: profile.personalInfo.gender === 'male' ? 'masculino' : 
                profile.personalInfo.gender === 'female' ? 'feminino' : 'outro',
        weight: profile.personalInfo.weight,
        height: profile.personalInfo.height,
        activity_level: profile.personalInfo.activityLevel === 'sedentary' ? 'sedentario' :
                      profile.personalInfo.activityLevel === 'light' ? 'leve' :
                      profile.personalInfo.activityLevel === 'moderate' ? 'moderado' :
                      profile.personalInfo.activityLevel === 'active' ? 'intenso' : 'muito_intenso',
        goals: [profile.fitnessGoals.primary, ...profile.fitnessGoals.secondary],
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{ user_id: user.id, ...profileData }]);

      if (profileError) {
        throw profileError;
      }

      // Salvar preferências de treino
      const workoutData = {
        user_id: user.id,
        workout_type: profile.preferences.workoutType,
        workout_duration: profile.preferences.workoutDuration,
        workout_days: profile.preferences.workoutDays,
        updated_at: new Date().toISOString()
      };

      const { error: workoutError } = await supabase
        .from('workout_preferences')
        .upsert([workoutData]);

      if (workoutError) {
        console.error('Erro ao salvar preferências de treino:', workoutError);
      }

      // Salvar preferências de dieta
      const dietData = {
        user_id: user.id,
        diet_type: profile.preferences.dietType,
        allergies: profile.restrictions.allergies,
        intolerances: profile.restrictions.intolerances,
        medications: profile.restrictions.medications,
        injuries: profile.restrictions.injuries,
        updated_at: new Date().toISOString()
      };

      const { error: dietError } = await supabase
        .from('dietary_preferences')
        .upsert([dietData]);

      if (dietError) {
        console.error('Erro ao salvar preferências de dieta:', dietError);
      }

      // Salvar preferências de notificação
      const notificationData = {
        user_id: user.id,
        meals: profile.preferences.notifications.meals,
        workouts: profile.preferences.notifications.workouts,
        progress: profile.preferences.notifications.progress,
        reminders: profile.preferences.notifications.reminders,
        achievements: profile.preferences.notifications.achievements,
        weekly_reports: profile.preferences.notifications.weeklyReports,
        updated_at: new Date().toISOString()
      };

      const { error: notificationError } = await supabase
        .from('notification_preferences')
        .upsert([notificationData]);

      if (notificationError) {
        console.error('Erro ao salvar preferências de notificação:', notificationError);
      }

      setIsEditing(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar suas alterações. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationPermission = async () => {
    await requestNotificationPermission();
  };

  const updateProfile = (section: keyof UserProfile, field: string, value: any) => {
    if (profile) {
      setProfile({
        ...profile,
        [section]: {
          ...profile[section],
          [field]: value
        }
      });
    }
  };

  const getGoalLabel = (goal: string) => {
    const labels = {
      weight_loss: 'Perda de Peso',
      muscle_gain: 'Ganho de Massa',
      maintenance: 'Manutenção',
      strength: 'Força',
      endurance: 'Resistência',
      flexibility: 'Flexibilidade',
      general_fitness: 'Fitness Geral'
    };
    return labels[goal as keyof typeof labels] || goal;
  };

  const getActivityLevelLabel = (level: string) => {
    const labels = {
      sedentary: 'Sedentário',
      light: 'Leve',
      moderate: 'Moderado',
      active: 'Ativo',
      very_active: 'Muito Ativo'
    };
    return labels[level as keyof typeof labels] || level;
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (!profile) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-secondary">
      {/* Header */}
      <header className="glass-card border-b border-border/30 p-4">
        <div className="container mx-auto flex items-center justify-between">
          {/* Desktop Back Button */}
          <Link to="/dashboard" className="hidden sm:inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
          {/* Mobile Back Button */}
          <Link to="/dashboard" className="sm:hidden inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <Logo />
          <div></div>
        </div>
      </header>

      <div className="container mx-auto p-4 sm:p-6 max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-orbitron font-bold text-foreground mb-2">
            Meu <span className="text-gradient">Perfil</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gerencie suas informações pessoais e preferências
          </p>
        </div>

        {/* Profile Header */}
        <Card className="glass-card mb-6 sm:mb-8">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-orbitron font-bold text-foreground mb-2">
                  {profile.personalInfo.name}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground mb-3 break-all">{profile.personalInfo.email}</p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                  <Badge variant="secondary" className="bg-primary/20 text-primary text-xs">
                    <Brain className="w-3 h-3 mr-1" />
                    IA Ativa
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {profile.fitnessGoals.primary === 'weight_loss' ? 'Perda de Peso' : 'Fitness'}
                  </Badge>
                </div>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                {isEditing ? (
                  <>
                    <CustomButton variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1 sm:flex-none">
                      Cancelar
                    </CustomButton>
                    <CustomButton size="sm" onClick={handleSave} disabled={loading} className="flex-1 sm:flex-none">
                      {loading ? 'Salvando...' : 'Salvar'}
                    </CustomButton>
                  </>
                ) : (
                  <CustomButton onClick={() => setIsEditing(true)} size="sm" className="w-full sm:w-auto">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar
                  </CustomButton>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Personal Information */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <User className="w-5 h-5 text-primary" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium mb-2 block">Nome</Label>
                  <Input
                    id="name"
                    value={profile.personalInfo.name}
                    onChange={(e) => updateProfile('personalInfo', 'name', e.target.value)}
                    disabled={!isEditing}
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="age" className="text-sm font-medium mb-2 block">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={profile.personalInfo.age || ''}
                    onChange={(e) => updateProfile('personalInfo', 'age', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    placeholder="Digite sua idade"
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="height" className="text-sm font-medium mb-2 block">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={profile.personalInfo.height || ''}
                    onChange={(e) => updateProfile('personalInfo', 'height', parseInt(e.target.value) || 0)}
                    disabled={!isEditing}
                    placeholder="Digite sua altura"
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium mb-2 block">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.personalInfo.weight || ''}
                    onChange={(e) => updateProfile('personalInfo', 'weight', parseFloat(e.target.value) || 0)}
                    disabled={!isEditing}
                    placeholder="Digite seu peso"
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gender" className="text-sm font-medium mb-2 block">Gênero</Label>
                  <Select
                    value={profile.personalInfo.gender}
                    onValueChange={(value) => updateProfile('personalInfo', 'gender', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="activityLevel" className="text-sm font-medium mb-2 block">Nível de Atividade</Label>
                  <Select
                    value={profile.personalInfo.activityLevel}
                    onValueChange={(value) => updateProfile('personalInfo', 'activityLevel', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentário</SelectItem>
                      <SelectItem value="light">Leve</SelectItem>
                      <SelectItem value="moderate">Moderado</SelectItem>
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="very_active">Muito Ativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Target className="w-5 h-5 text-primary" />
                Metas de Fitness
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="primaryGoal" className="text-sm font-medium mb-2 block">Meta Principal</Label>
                <Select
                  value={profile.fitnessGoals.primary}
                  onValueChange={(value) => updateProfile('fitnessGoals', 'primary', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight_loss">Perda de Peso</SelectItem>
                    <SelectItem value="muscle_gain">Ganho de Massa</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="strength">Força</SelectItem>
                    <SelectItem value="endurance">Resistência</SelectItem>
                    <SelectItem value="flexibility">Flexibilidade</SelectItem>
                    <SelectItem value="general_fitness">Fitness Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                  <Label htmlFor="targetWeight" className="text-sm font-medium mb-2 block">Peso Alvo (kg)</Label>
                <Input
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  value={profile.fitnessGoals.targetWeight || ''}
                  onChange={(e) => updateProfile('fitnessGoals', 'targetWeight', parseFloat(e.target.value) || 0)}
                  disabled={!isEditing}
                    className="bg-input/50 border-border/50 h-10 text-sm"
                />
              </div>
              <div>
                  <Label htmlFor="targetDate" className="text-sm font-medium mb-2 block">Data Alvo</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={profile.fitnessGoals.targetDate || ''}
                  onChange={(e) => updateProfile('fitnessGoals', 'targetDate', e.target.value)}
                  disabled={!isEditing}
                    className="bg-input/50 border-border/50 h-10 text-sm"
                />
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Metas Secundárias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {['muscle_gain', 'endurance', 'flexibility', 'strength', 'weight_loss', 'maintenance', 'general_fitness'].map((goal) => (
                    <Badge
                      key={goal}
                      variant={profile.fitnessGoals.secondary.includes(goal) ? 'default' : 'outline'}
                      className="cursor-pointer text-xs px-2 py-1"
                      onClick={() => {
                        if (isEditing) {
                          const newSecondary = profile.fitnessGoals.secondary.includes(goal)
                            ? profile.fitnessGoals.secondary.filter(g => g !== goal)
                            : [...profile.fitnessGoals.secondary, goal];
                          updateProfile('fitnessGoals', 'secondary', newSecondary);
                        }
                      }}
                    >
                      {getGoalLabel(goal)}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Palette className="w-5 h-5 text-primary" />
                Preferências
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="dietType" className="text-sm font-medium mb-2 block">Tipo de Dieta</Label>
                <Select
                  value={profile.preferences.dietType}
                  onValueChange={(value) => updateProfile('preferences', 'dietType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="balanced">Equilibrada</SelectItem>
                    <SelectItem value="low_carb">Baixo Carboidrato</SelectItem>
                    <SelectItem value="high_protein">Alta Proteína</SelectItem>
                    <SelectItem value="vegetarian">Vegetariana</SelectItem>
                    <SelectItem value="vegan">Vegana</SelectItem>
                    <SelectItem value="keto">Cetogênica</SelectItem>
                    <SelectItem value="paleo">Paleo</SelectItem>
                    <SelectItem value="mediterranean">Mediterrânea</SelectItem>
                    <SelectItem value="dash">DASH</SelectItem>
                    <SelectItem value="custom">Personalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="workoutType" className="text-sm font-medium mb-2 block">Tipo de Treino</Label>
                <Select
                  value={profile.preferences.workoutType}
                  onValueChange={(value) => updateProfile('preferences', 'workoutType', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Força</SelectItem>
                    <SelectItem value="cardio">Cardio</SelectItem>
                    <SelectItem value="flexibility">Flexibilidade</SelectItem>
                    <SelectItem value="mixed">Misto</SelectItem>
                    <SelectItem value="yoga">Yoga</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="running">Corrida</SelectItem>
                    <SelectItem value="cycling">Ciclismo</SelectItem>
                    <SelectItem value="swimming">Natação</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workoutDuration" className="text-sm font-medium mb-2 block">Duração do Treino</Label>
                  <Select
                    value={profile.preferences.workoutDuration}
                    onValueChange={(value) => updateProfile('preferences', 'workoutDuration', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="bg-input/50 border-border/50 h-10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15min">15 minutos</SelectItem>
                      <SelectItem value="30min">30 minutos</SelectItem>
                      <SelectItem value="45min">45 minutos</SelectItem>
                      <SelectItem value="60min">1 hora</SelectItem>
                      <SelectItem value="75min">1.25 horas</SelectItem>
                      <SelectItem value="90min">1.5 horas</SelectItem>
                      <SelectItem value="120min">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="workoutDays" className="text-sm font-medium mb-2 block">Dias de Treino</Label>
                  <Input
                    id="workoutDays"
                    type="number"
                    min="1"
                    max="7"
                    value={profile.preferences.workoutDays}
                    onChange={(e) => updateProfile('preferences', 'workoutDays', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="w-5 h-5 text-primary" />
                Notificações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium block">Lembretes de Refeições</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber notificações para refeições</p>
                </div>
                <Switch
                  checked={profile.preferences.notifications.meals}
                  onCheckedChange={(checked) => updateProfile('preferences', 'notifications', {
                    ...profile.preferences.notifications,
                    meals: checked
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium block">Lembretes de Treino</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber notificações para treinos</p>
                </div>
                <Switch
                  checked={profile.preferences.notifications.workouts}
                  onCheckedChange={(checked) => updateProfile('preferences', 'notifications', {
                    ...profile.preferences.notifications,
                    workouts: checked
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium block">Atualizações de Progresso</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber insights da IA</p>
                </div>
                <Switch
                  checked={profile.preferences.notifications.progress}
                  onCheckedChange={(checked) => updateProfile('preferences', 'notifications', {
                    ...profile.preferences.notifications,
                    progress: checked
                  })}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Label className="text-sm font-medium block">Lembretes Gerais</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber lembretes diários</p>
                </div>
                <Switch
                  checked={profile.preferences.notifications.reminders}
                  onCheckedChange={(checked) => updateProfile('preferences', 'notifications', {
                    ...profile.preferences.notifications,
                    reminders: checked
                  })}
                  disabled={!isEditing}
                />
              </div>

              {!notificationsEnabled && (
                <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="w-4 h-4 text-warning" />
                    <span className="text-sm font-medium text-warning-foreground">
                      Notificações Desabilitadas
                    </span>
                  </div>
                  <p className="text-xs text-warning-foreground mb-2">
                    Para receber notificações, você precisa permitir o acesso no navegador.
                  </p>
                  <CustomButton size="sm" onClick={handleNotificationPermission} className="w-full sm:w-auto">
                    Permitir Notificações
                  </CustomButton>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Restrictions */}
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5 text-primary" />
                Restrições e Limitações
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium mb-2 block">Alergias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.restrictions.allergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs px-2 py-1">
                      {allergy}
                    </Badge>
                  ))}
                  {isEditing && (
                    <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </CustomButton>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Intolerâncias</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.restrictions.intolerances.map((intolerance, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                      {intolerance}
                    </Badge>
                  ))}
                  {isEditing && (
                    <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </CustomButton>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Medicamentos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.restrictions.medications.length > 0 ? (
                    profile.restrictions.medications.map((medication, index) => (
                      <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                        {medication}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Nenhum medicamento registrado</span>
                  )}
                  {isEditing && (
                    <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </CustomButton>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Lesões/Problemas Físicos</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {profile.restrictions.injuries.map((injury, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                      {injury}
                    </Badge>
                  ))}
                  {isEditing && (
                    <CustomButton variant="outline" size="sm" className="h-8 w-8 p-0">
                      <Plus className="w-4 h-4" />
                    </CustomButton>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Settings */}
        <div className="mt-6 sm:mt-8">
          <Card className="glass-card">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Brain className="w-5 h-5 text-primary" />
                Configurações da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-primary" />
                    <h4 className="font-medium text-primary-foreground text-sm sm:text-base">Ajustes Automáticos</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-primary-foreground mb-3">
                    A IA ajusta automaticamente seus planos baseado no progresso
                  </p>
                  <Switch defaultChecked disabled />
                </div>

                <div className="p-4 bg-success/10 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-success" />
                    <h4 className="font-medium text-success-foreground text-sm sm:text-base">Aprendizado Contínuo</h4>
                  </div>
                  <p className="text-xs sm:text-sm text-success-foreground mb-3">
                    A IA aprende com seus hábitos para melhorar os planos
                  </p>
                  <Switch defaultChecked disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
