import { CustomButton } from "@/components/ui/custom-button";
import { Logo } from "@/components/Logo";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  ArrowRight, 
  ArrowLeftCircle,
  Target,
  Activity,
  Apple,
  Dumbbell,
  Shield,
  Bell,
  Palette,
  Plus,
  X,
  CheckCircle,
  Circle
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface SignUpData {
  // Step 1: Basic Info
  name: string;
  email: string;
  password: string;
  
  // Step 2: Personal Info
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  
  // Step 3: Fitness Goals
  primaryGoal: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
  secondaryGoals: string[];
  targetWeight?: number;
  targetDate?: string;
  
  // Step 4: Preferences
  dietType: 'balanced' | 'low_carb' | 'high_protein' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'dash' | 'custom';
  workoutType: 'strength' | 'cardio' | 'flexibility' | 'mixed' | 'yoga' | 'pilates' | 'crossfit' | 'running' | 'cycling' | 'swimming';
  workoutDuration: '15min' | '30min' | '45min' | '60min' | '75min' | '90min' | '120min';
  workoutDays: number;
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  
  // Step 5: Restrictions & Health
  allergies: string[];
  intolerances: string[];
  medications: string[];
  injuries: string[];
  medicalConditions: string[];
  
  // Step 6: Notifications
  notifications: {
    meals: boolean;
    workouts: boolean;
    progress: boolean;
    reminders: boolean;
    achievements: boolean;
    weeklyReports: boolean;
  };
}

const STEPS = [
  { id: 1, title: "Informações Básicas", icon: User },
  { id: 2, title: "Dados Pessoais", icon: User },
  { id: 3, title: "Metas de Fitness", icon: Target },
  { id: 4, title: "Preferências", icon: Palette },
  { id: 5, title: "Restrições & Saúde", icon: Shield },
  { id: 6, title: "Notificações", icon: Bell }
];

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    age: 25,
    gender: 'male',
    height: 170,
    weight: 70,
    activityLevel: 'moderate',
    primaryGoal: 'general_fitness',
    secondaryGoals: [],
    dietType: 'balanced',
    workoutType: 'mixed',
    workoutDuration: '60min',
    workoutDays: 3,
    preferredWorkoutTime: 'flexible',
    allergies: [],
    intolerances: [],
    medications: [],
    injuries: [],
    medicalConditions: [],
    notifications: {
      meals: true,
      workouts: true,
      progress: true,
      reminders: false,
      achievements: true,
      weeklyReports: true
    }
  });
  const [loading, setLoading] = useState(false);
  const [tempInput, setTempInput] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, signIn, signUp } = useAuth();

  // Check URL parameters to determine initial mode
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setIsLogin(false);
    }
  }, [searchParams]);

  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      return;
    }
    
    if (isLogin) {
      // Handle login
      setLoading(true);
      try {
        const { error } = await signIn(formData.email, formData.password);
        if (!error) {
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Authentication error:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Handle signup completion
      setLoading(true);
      try {
        const { error } = await signUp(formData.email, formData.password, formData.name);
        if (!error) {
          // Here you would typically save the additional profile data
          navigate('/dashboard');
        }
      } catch (error: any) {
        console.error('Signup error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayInput = (field: string, value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof SignUpData] as string[], value.trim()]
      }));
      setTempInput('');
    }
  };

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof SignUpData] as string[]).filter((_, i) => i !== index)
    }));
  };

  const goToStep = (step: number) => {
    if (step <= currentStep) {
      setCurrentStep(step);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 bg-input/50 border-border/50"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 bg-input/50 border-border/50"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 bg-input/50 border-border/50"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground">Idade</Label>
                <Input 
                  id="age"
                  type="number"
                  placeholder="25"
                  className="bg-input/50 border-border/50"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground">Gênero</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Feminino</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="height" className="text-foreground">Altura (cm)</Label>
                <Input 
                  id="height"
                  type="number"
                  placeholder="170"
                  className="bg-input/50 border-border/50"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-foreground">Peso (kg)</Label>
                <Input 
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  className="bg-input/50 border-border/50"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel" className="text-foreground">Nível de Atividade</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => handleInputChange('activityLevel', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentário (pouco exercício)</SelectItem>
                  <SelectItem value="light">Leve (1-3x por semana)</SelectItem>
                  <SelectItem value="moderate">Moderado (3-5x por semana)</SelectItem>
                  <SelectItem value="active">Ativo (6-7x por semana)</SelectItem>
                  <SelectItem value="very_active">Muito Ativo (atleta, trabalho físico)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryGoal" className="text-foreground">Meta Principal</Label>
              <Select
                value={formData.primaryGoal}
                onValueChange={(value) => handleInputChange('primaryGoal', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50">
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
              <div className="space-y-2">
                <Label htmlFor="targetWeight" className="text-foreground">Peso Alvo (kg)</Label>
                <Input 
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                  className="bg-input/50 border-border/50"
                  value={formData.targetWeight || ''}
                  onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-foreground">Data Alvo</Label>
                <Input 
                  id="targetDate"
                  type="date"
                  className="bg-input/50 border-border/50"
                  value={formData.targetDate || ''}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Metas Secundárias</Label>
              <div className="flex flex-wrap gap-2">
                {['muscle_gain', 'endurance', 'flexibility', 'strength', 'cardio', 'balance'].map((goal) => (
                  <Badge
                    key={goal}
                    variant={formData.secondaryGoals.includes(goal) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newGoals = formData.secondaryGoals.includes(goal)
                        ? formData.secondaryGoals.filter(g => g !== goal)
                        : [...formData.secondaryGoals, goal];
                      handleInputChange('secondaryGoals', newGoals);
                    }}
                  >
                    {goal === 'weight_loss' ? 'Perda de Peso' :
                     goal === 'muscle_gain' ? 'Ganho de Massa' :
                     goal === 'endurance' ? 'Resistência' :
                     goal === 'flexibility' ? 'Flexibilidade' :
                     goal === 'strength' ? 'Força' :
                     goal === 'cardio' ? 'Cardio' :
                     goal === 'balance' ? 'Equilíbrio' : goal}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dietType" className="text-foreground">Tipo de Dieta</Label>
              <Select
                value={formData.dietType}
                onValueChange={(value) => handleInputChange('dietType', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutType" className="text-foreground">Tipo de Treino</Label>
                <Select
                  value={formData.workoutType}
                  onValueChange={(value) => handleInputChange('workoutType', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50">
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
              <div className="space-y-2">
                <Label htmlFor="workoutDuration" className="text-foreground">Duração do Treino</Label>
                <Select
                  value={formData.workoutDuration}
                  onValueChange={(value) => handleInputChange('workoutDuration', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workoutDays" className="text-foreground">Dias de Treino por Semana</Label>
                <Input 
                  id="workoutDays"
                  type="number"
                  min="1"
                  max="7"
                  placeholder="3"
                  className="bg-input/50 border-border/50"
                  value={formData.workoutDays}
                  onChange={(e) => handleInputChange('workoutDays', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredWorkoutTime" className="text-foreground">Horário Preferido</Label>
                <Select
                  value={formData.preferredWorkoutTime}
                  onValueChange={(value) => handleInputChange('preferredWorkoutTime', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Manhã</SelectItem>
                    <SelectItem value="afternoon">Tarde</SelectItem>
                    <SelectItem value="evening">Noite</SelectItem>
                    <SelectItem value="flexible">Flexível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground">Alergias Alimentares</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Amendoim, Glúten..."
                  className="flex-1 bg-input/50 border-border/50"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleArrayInput('allergies', tempInput)}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  onClick={() => handleArrayInput('allergies', tempInput)}
                >
                  <Plus className="w-4 h-4" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1">
                    {allergy}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('allergies', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Intolerâncias</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Lactose, Fructose..."
                  className="flex-1 bg-input/50 border-border/50"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleArrayInput('intolerances', tempInput)}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  onClick={() => handleArrayInput('intolerances', tempInput)}
                >
                  <Plus className="w-4 h-4" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.intolerances.map((intolerance, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1">
                    {intolerance}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('intolerances', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Medicamentos em Uso</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Antidepressivo, Betabloqueador..."
                  className="flex-1 bg-input/50 border-border/50"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleArrayInput('medications', tempInput)}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  onClick={() => handleArrayInput('medications', tempInput)}
                >
                  <Plus className="w-4 h-4" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.medications.map((medication, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {medication}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('medications', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Lesões/Problemas Físicos</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Lesão no joelho, Hérnia..."
                  className="flex-1 bg-input/50 border-border/50"
                  value={tempInput}
                  onChange={(e) => setTempInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleArrayInput('injuries', tempInput)}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  onClick={() => handleArrayInput('injuries', tempInput)}
                >
                  <Plus className="w-4 h-4" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.injuries.map((injury, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1">
                    {injury}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('injuries', index)} />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Lembretes de Refeições</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações para refeições</p>
                </div>
                <Switch
                  checked={formData.notifications.meals}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    meals: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Lembretes de Treino</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações para treinos</p>
                </div>
                <Switch
                  checked={formData.notifications.workouts}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    workouts: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Atualizações de Progresso</Label>
                  <p className="text-sm text-muted-foreground">Receber insights da IA</p>
                </div>
                <Switch
                  checked={formData.notifications.progress}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    progress: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Lembretes Gerais</Label>
                  <p className="text-sm text-muted-foreground">Receber lembretes diários</p>
                </div>
                <Switch
                  checked={formData.notifications.reminders}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    reminders: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Conquistas</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações de conquistas</p>
                </div>
                <Switch
                  checked={formData.notifications.achievements}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    achievements: checked
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label className="text-foreground font-medium">Relatórios Semanais</Label>
                  <p className="text-sm text-muted-foreground">Receber resumos semanais</p>
                </div>
                <Switch
                  checked={formData.notifications.weeklyReports}
                  onCheckedChange={(checked) => handleInputChange('notifications', {
                    ...formData.notifications,
                    weeklyReports: checked
                  })}
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-2xl">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <Card className="glass-card p-8 rounded-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo className="justify-center mb-4" />
            <h2 className="text-2xl font-orbitron font-bold text-foreground">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isLogin 
                ? "Entre para continuar sua jornada fitness" 
                : "Comece sua transformação hoje mesmo"
              }
            </p>
          </div>

          {/* Progress Steps */}
          {!isLogin && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {STEPS.map((step, index) => (
                  <div key={step.id} className="flex items-center">
                    <div 
                      className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors cursor-pointer ${
                        step.id < currentStep 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : step.id === currentStep
                          ? 'border-primary text-primary'
                          : 'border-border text-muted-foreground'
                      }`}
                      onClick={() => goToStep(step.id)}
                    >
                      {step.id < currentStep ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <span className="text-sm font-medium">{step.id}</span>
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        step.id < currentStep ? 'bg-primary' : 'bg-border'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Passo {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].title}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin ? renderStepContent() : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 bg-input/50 border-border/50"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-input/50 border-border/50"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <CustomButton type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Processando..." : (
                isLogin ? "Entrar" : 
                currentStep < STEPS.length ? "Próximo" : "Criar conta"
              )}
            </CustomButton>

            {!isLogin && currentStep > 1 && (
              <CustomButton 
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeftCircle className="w-4 h-4 mr-2" />
                Voltar
              </CustomButton>
            )}

            {isLogin && (
              <div className="text-center">
                <a href="#" className="text-sm text-primary hover:underline">
                  Esqueceu sua senha?
                </a>
              </div>
            )}
          </form>

          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}
            </p>
            <CustomButton 
              variant="ghost" 
              onClick={() => {
                setIsLogin(!isLogin);
                setCurrentStep(1);
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  age: 25,
                  gender: 'male',
                  height: 170,
                  weight: 70,
                  activityLevel: 'moderate',
                  primaryGoal: 'general_fitness',
                  secondaryGoals: [],
                  dietType: 'balanced',
                  workoutType: 'mixed',
                  workoutDuration: '60min',
                  workoutDays: 3,
                  preferredWorkoutTime: 'flexible',
                  allergies: [],
                  intolerances: [],
                  medications: [],
                  injuries: [],
                  medicalConditions: [],
                  notifications: {
                    meals: true,
                    workouts: true,
                    progress: true,
                    reminders: false,
                    achievements: true,
                    weeklyReports: true
                  }
                });
              }}
              className="mt-2"
            >
              {isLogin ? "Criar conta gratuita" : "Fazer login"}
            </CustomButton>
          </div>
        </Card>

        {!isLogin && (
          <div className="text-center mt-6 p-4 glass-card rounded-lg">
            <p className="text-sm text-muted-foreground">
              ✨ <span className="text-success font-semibold">7 dias grátis</span> para testar todos os recursos
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A IA criará planos personalizados baseados nas suas informações
            </p>
          </div>
        )}
      </div>
    </div>
  );
}