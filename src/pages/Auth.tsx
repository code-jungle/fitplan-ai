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
  confirmPassword: string;
  
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
    confirmPassword: '',
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
  const [passwordError, setPasswordError] = useState('');
  const [tempAllergies, setTempAllergies] = useState('');
  const [tempIntolerances, setTempIntolerances] = useState('');
  const [tempMedications, setTempMedications] = useState('');
  const [tempInjuries, setTempInjuries] = useState('');
  
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

  const validatePasswords = () => {
    if (formData.password !== formData.confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    if (formData.password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin && currentStep === 1) {
      // Validate passwords before proceeding to next step
      if (!validatePasswords()) {
        return;
      }
      setCurrentStep(2);
      return;
    }
    
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground text-sm sm:text-base">Nome completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input 
                  id="name"
                  type="text"
                  placeholder="Seu nome completo"
                  className="pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground text-sm sm:text-base">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input 
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground text-sm sm:text-base">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input 
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base ${
                    passwordError && formData.password !== formData.confirmPassword 
                      ? 'border-destructive' 
                      : ''
                  }`}
                  value={formData.password}
                  onChange={(e) => {
                    handleInputChange('password', e.target.value);
                    // Clear error when user starts typing
                    if (passwordError) {
                      setPasswordError('');
                    }
                  }}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground text-sm sm:text-base">Confirmar Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                <Input 
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base ${
                    passwordError && formData.password !== formData.confirmPassword 
                      ? 'border-destructive' 
                      : ''
                  }`}
                  value={formData.confirmPassword}
                  onChange={(e) => {
                    handleInputChange('confirmPassword', e.target.value);
                    // Clear error when user starts typing
                    if (passwordError) {
                      setPasswordError('');
                    }
                  }}
                  required
                />
              </div>
              {passwordError && (
                <p className="text-sm text-destructive mt-1 flex items-center gap-2">
                  <span className="w-1 h-1 bg-destructive rounded-full"></span>
                  {passwordError}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age" className="text-foreground text-sm sm:text-base">Idade</Label>
                <Input 
                  id="age"
                  type="number"
                  placeholder="25"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-foreground text-sm sm:text-base">Gênero</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
                <Label htmlFor="height" className="text-foreground text-sm sm:text-base">Altura (cm)</Label>
                <Input 
                  id="height"
                  type="number"
                  placeholder="170"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.height}
                  onChange={(e) => handleInputChange('height', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-foreground text-sm sm:text-base">Peso (kg)</Label>
                <Input 
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder="70.0"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.weight}
                  onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="activityLevel" className="text-foreground text-sm sm:text-base">Nível de Atividade</Label>
              <Select
                value={formData.activityLevel}
                onValueChange={(value) => handleInputChange('activityLevel', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="primaryGoal" className="text-foreground text-sm sm:text-base">Meta Principal</Label>
              <Select
                value={formData.primaryGoal}
                onValueChange={(value) => handleInputChange('primaryGoal', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
                <Label htmlFor="targetWeight" className="text-foreground text-sm sm:text-base">Peso Alvo (kg)</Label>
                <Input 
                  id="targetWeight"
                  type="number"
                  step="0.1"
                  placeholder="65.0"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.targetWeight || ''}
                  onChange={(e) => handleInputChange('targetWeight', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-foreground text-sm sm:text-base">Data Alvo</Label>
                <Input 
                  id="targetDate"
                  type="date"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.targetDate || ''}
                  onChange={(e) => handleInputChange('targetDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm sm:text-base">Metas Secundárias</Label>
              <div className="flex flex-wrap gap-2">
                {['muscle_gain', 'endurance', 'flexibility', 'strength', 'cardio', 'balance'].map((goal) => (
                  <Badge
                    key={goal}
                    variant={formData.secondaryGoals.includes(goal) ? 'default' : 'outline'}
                    className="cursor-pointer text-xs px-2 py-1"
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="dietType" className="text-foreground text-sm sm:text-base">Tipo de Dieta</Label>
              <Select
                value={formData.dietType}
                onValueChange={(value) => handleInputChange('dietType', value)}
              >
                <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
                <Label htmlFor="workoutType" className="text-foreground text-sm sm:text-base">Tipo de Treino</Label>
                <Select
                  value={formData.workoutType}
                  onValueChange={(value) => handleInputChange('workoutType', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
                <Label htmlFor="workoutDuration" className="text-foreground text-sm sm:text-base">Duração do Treino</Label>
                <Select
                  value={formData.workoutDuration}
                  onValueChange={(value) => handleInputChange('workoutDuration', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
                <Label htmlFor="workoutDays" className="text-foreground text-sm sm:text-base">Dias de Treino por Semana</Label>
                <Input 
                  id="workoutDays"
                  type="number"
                  min="1"
                  max="7"
                  placeholder="3"
                  className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={formData.workoutDays}
                  onChange={(e) => handleInputChange('workoutDays', parseInt(e.target.value))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="preferredWorkoutTime" className="text-foreground text-sm sm:text-base">Horário Preferido</Label>
                <Select
                  value={formData.preferredWorkoutTime}
                  onValueChange={(value) => handleInputChange('preferredWorkoutTime', value)}
                >
                  <SelectTrigger className="bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base">
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label className="text-foreground text-sm sm:text-base">Alergias Alimentares</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Amendoim, Glúten..."
                  className="flex-1 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={tempAllergies}
                  onChange={(e) => setTempAllergies(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tempAllergies.trim()) {
                      handleArrayInput('allergies', tempAllergies);
                      setTempAllergies('');
                    }
                  }}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                  onClick={() => {
                    if (tempAllergies.trim()) {
                      handleArrayInput('allergies', tempAllergies);
                      setTempAllergies('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.allergies.map((allergy, index) => (
                  <Badge key={index} variant="destructive" className="flex items-center gap-1 text-xs px-2 py-1">
                    {allergy}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('allergies', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm sm:text-base">Intolerâncias</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Lactose, Fructose..."
                  className="flex-1 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={tempIntolerances}
                  onChange={(e) => setTempIntolerances(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tempIntolerances.trim()) {
                      handleArrayInput('intolerances', tempIntolerances);
                      setTempIntolerances('');
                    }
                  }}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                  onClick={() => {
                    if (tempIntolerances.trim()) {
                      handleArrayInput('intolerances', tempIntolerances);
                      setTempIntolerances('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.intolerances.map((intolerance, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 text-xs px-2 py-1">
                    {intolerance}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('intolerances', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm sm:text-base">Medicamentos em Uso</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Antidepressivo, Betabloqueador..."
                  className="flex-1 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={tempMedications}
                  onChange={(e) => setTempMedications(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tempMedications.trim()) {
                      handleArrayInput('medications', tempMedications);
                      setTempMedications('');
                    }
                  }}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                  onClick={() => {
                    if (tempMedications.trim()) {
                      handleArrayInput('medications', tempMedications);
                      setTempMedications('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.medications.map((medication, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
                    {medication}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => removeArrayItem('medications', index)} />
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground text-sm sm:text-base">Lesões/Problemas Físicos</Label>
              <div className="flex gap-2">
                <Input 
                  placeholder="Ex: Lesão no joelho, Hérnia..."
                  className="flex-1 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                  value={tempInjuries}
                  onChange={(e) => setTempInjuries(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tempInjuries.trim()) {
                      handleArrayInput('injuries', tempInjuries);
                      setTempInjuries('');
                    }
                  }}
                />
                <CustomButton 
                  type="button"
                  size="sm"
                  className="h-10 sm:h-11 px-3 sm:px-4"
                  onClick={() => {
                    if (tempInjuries.trim()) {
                      handleArrayInput('injuries', tempInjuries);
                      setTempInjuries('');
                    }
                  }}
                >
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                </CustomButton>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.injuries.map((injury, index) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 text-xs px-2 py-1">
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
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Lembretes de Refeições</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber notificações para refeições</p>
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
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Lembretes de Treino</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber notificações para treinos</p>
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
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Atualizações de Progresso</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber insights da IA</p>
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
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Lembretes Gerais</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber lembretes diários</p>
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
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Conquistas</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber notificações de conquistas</p>
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
                <div className="flex-1 min-w-0">
                  <Label className="text-foreground font-medium text-sm sm:text-base">Relatórios Semanais</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Receber resumos semanais</p>
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
    <div className="min-h-screen flex items-center justify-center p-2 sm:p-4">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-secondary" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%)]" />
      
      <div className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-2xl">
        {/* Back to home */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-4 sm:mb-8 text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          Voltar ao início
        </Link>

        <Card className="glass-card p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl">
          {/* Logo */}
          <div className="text-center mb-6 sm:mb-8">
            <Logo className="justify-center mb-3 sm:mb-4" size="sm" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-orbitron font-bold text-foreground">
              {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              {isLogin 
                ? "Entre para continuar sua jornada fitness" 
                : "Comece sua transformação hoje mesmo"
              }
            </p>
          </div>

          {/* Progress Steps */}
          {!isLogin && (
            <div className="mb-6 sm:mb-8">
              {/* Mobile Progress Steps */}
              <div className="block sm:hidden mb-4">
                <div className="flex items-center justify-center gap-1 mb-3">
                  {STEPS.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div 
                        className={`flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors cursor-pointer text-xs ${
                          step.id < currentStep 
                            ? 'bg-primary border-primary text-primary-foreground' 
                            : step.id === currentStep
                            ? 'border-primary text-primary'
                            : 'border-border text-muted-foreground'
                        }`}
                        onClick={() => goToStep(step.id)}
                      >
                        {step.id < currentStep ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <span className="text-xs font-medium">{step.id}</span>
                        )}
                      </div>
                      {index < STEPS.length - 1 && (
                        <div className={`w-6 h-0.5 mx-0.5 ${
                          step.id < currentStep ? 'bg-primary' : 'bg-border'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">
                    {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].title}
                  </p>
                </div>
              </div>

              {/* Desktop Progress Steps */}
              <div className="hidden sm:block">
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
                        <div className={`w-12 h-0.5 mx-1 ${
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
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {!isLogin ? renderStepContent() : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground text-sm sm:text-base">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground text-sm sm:text-base">Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    <Input 
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-input/50 border-border/50 h-10 sm:h-11 text-sm sm:text-base"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <CustomButton type="submit" size="lg" className="w-full h-12 sm:h-14 text-base sm:text-lg" disabled={loading}>
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
                className="w-full h-12 sm:h-14 text-base sm:text-lg"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                <ArrowLeftCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
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
            <p className="text-muted-foreground text-sm sm:text-base">
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
                  confirmPassword: '',
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
              className="mt-2 h-10 sm:h-11 text-sm sm:text-base"
            >
              {isLogin ? "Criar conta gratuita" : "Fazer login"}
            </CustomButton>
          </div>
        </Card>

        {!isLogin && (
          <div className="text-center mt-4 sm:mt-6 p-3 sm:p-4 glass-card rounded-lg">
            <p className="text-sm sm:text-base text-muted-foreground">
              ✨ <span className="text-success font-semibold">7 dias grátis</span> para testar todos os recursos
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              A IA criará planos personalizados baseados nas suas informações
            </p>
          </div>
        )}
      </div>
    </div>
  );
}