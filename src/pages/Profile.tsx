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
    primary: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
    secondary: string[];
    targetWeight?: number;
    targetDate?: string;
  };
  preferences: {
    dietType: 'balanced' | 'low_carb' | 'high_protein' | 'vegetarian' | 'vegan' | 'keto';
    workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed';
    workoutDuration: '30min' | '45min' | '60min' | '90min';
    workoutDays: number;
    notifications: {
      meals: boolean;
      workouts: boolean;
      progress: boolean;
      reminders: boolean;
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

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = () => {
    // Mock data - in real app, this would come from API
    setProfile({
      personalInfo: {
        name: user?.user_metadata?.full_name || 'Usuário',
        email: user?.email || '',
        age: 28,
        gender: 'male',
        height: 175,
        weight: 78.5,
        activityLevel: 'moderate'
      },
      fitnessGoals: {
        primary: 'weight_loss',
        secondary: ['muscle_gain', 'endurance'],
        targetWeight: 75,
        targetDate: '2024-05-01'
      },
      preferences: {
        dietType: 'balanced',
        workoutType: 'mixed',
        workoutDuration: '60min',
        workoutDays: 4,
        notifications: {
          meals: true,
          workouts: true,
          progress: true,
          reminders: false
        }
      },
      restrictions: {
        allergies: ['Amendoim'],
        intolerances: ['Lactose'],
        medications: [],
        injuries: ['Lesão no joelho direito (2022)']
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save profile to API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      // Show success message
    } catch (error) {
      console.error('Error saving profile:', error);
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
      endurance: 'Resistência'
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
                    value={profile.personalInfo.age}
                    onChange={(e) => updateProfile('personalInfo', 'age', parseInt(e.target.value))}
                    disabled={!isEditing}
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
                    value={profile.personalInfo.height}
                    onChange={(e) => updateProfile('personalInfo', 'height', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="bg-input/50 border-border/50 h-10 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm font-medium mb-2 block">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={profile.personalInfo.weight}
                    onChange={(e) => updateProfile('personalInfo', 'weight', parseFloat(e.target.value))}
                    disabled={!isEditing}
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
                  onChange={(e) => updateProfile('fitnessGoals', 'targetWeight', parseFloat(e.target.value))}
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
                  {['muscle_gain', 'endurance', 'flexibility', 'strength'].map((goal) => (
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
                      <SelectItem value="30min">30 minutos</SelectItem>
                      <SelectItem value="45min">45 minutos</SelectItem>
                      <SelectItem value="60min">1 hora</SelectItem>
                      <SelectItem value="90min">1.5 horas</SelectItem>
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
