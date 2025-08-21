export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  personalInfo: PersonalInfo;
  fitnessGoals: FitnessGoals;
  preferences: UserPreferences;
  restrictions: UserRestrictions;
  subscription: SubscriptionInfo;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  name: string;
  email: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: ActivityLevel;
  phone?: string;
  emergencyContact?: {
    name: string;
    phone: string;
    relationship: string;
  };
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export interface FitnessGoals {
  primary: PrimaryGoal;
  secondary: SecondaryGoal[];
  targetWeight?: number;
  targetDate?: string;
  currentWeight: number;
  startWeight: number;
  targetBodyFat?: number;
  targetMuscleMass?: number;
}

export type PrimaryGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance' | 'flexibility' | 'general_fitness';
export type SecondaryGoal = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance' | 'flexibility' | 'cardio' | 'balance' | 'agility';

export interface UserPreferences {
  dietType: DietType;
  workoutType: WorkoutType;
  workoutDuration: WorkoutDuration;
  workoutDays: number;
  preferredWorkoutTime: 'morning' | 'afternoon' | 'evening' | 'flexible';
  notifications: NotificationPreferences;
  language: 'pt-BR' | 'en-US';
  theme: 'dark' | 'light' | 'auto';
  units: 'metric' | 'imperial';
}

export type DietType = 'balanced' | 'low_carb' | 'high_protein' | 'vegetarian' | 'vegan' | 'keto' | 'paleo' | 'mediterranean' | 'dash' | 'custom';
export type WorkoutType = 'strength' | 'cardio' | 'flexibility' | 'mixed' | 'yoga' | 'pilates' | 'crossfit' | 'running' | 'cycling' | 'swimming';
export type WorkoutDuration = '15min' | '30min' | '45min' | '60min' | '75min' | '90min' | '120min';

export interface NotificationPreferences {
  meals: boolean;
  workouts: boolean;
  progress: boolean;
  reminders: boolean;
  achievements: boolean;
  weeklyReports: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

export interface UserRestrictions {
  allergies: string[];
  intolerances: string[];
  medications: string[];
  injuries: Injury[];
  dietaryRestrictions: string[];
  physicalLimitations: string[];
  medicalConditions: string[];
}

export interface Injury {
  id: string;
  type: string;
  location: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
  description: string;
  isRecovered: boolean;
  recoveryDate?: string;
  restrictions: string[];
}

export interface SubscriptionInfo {
  id: string;
  status: 'trial' | 'active' | 'cancelled' | 'expired' | 'past_due';
  plan: 'free' | 'basic' | 'premium' | 'pro';
  startDate: string;
  endDate?: string;
  trialEndDate?: string;
  autoRenew: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
}

export interface ProgressEntry {
  id: string;
  userId: string;
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  measurements: BodyMeasurements;
  workouts: number;
  calories: number;
  water: number;
  sleep: number;
  mood: 'excellent' | 'good' | 'neutral' | 'bad' | 'terrible';
  energy: 'high' | 'medium' | 'low';
  notes?: string;
  photos?: string[];
}

export interface BodyMeasurements {
  chest: number;
  waist: number;
  hips: number;
  arms: {
    left: number;
    right: number;
  };
  thighs: {
    left: number;
    right: number;
  };
  calves: {
    left: number;
    right: number;
  };
  neck: number;
  shoulders: number;
  forearms: {
    left: number;
    right: number;
  };
}

export interface MealPlan {
  id: string;
  userId: string;
  date: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalSugar: number;
  totalSodium: number;
  aiGenerated: boolean;
  userRating?: number;
  userFeedback?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  completed: boolean;
  foods: Food[];
  notes?: string;
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  barcode?: string;
  brand?: string;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  date: string;
  name: string;
  description?: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: WorkoutType;
  focus: string[];
  exercises: Exercise[];
  totalCalories: number;
  aiGenerated: boolean;
  userRating?: number;
  userFeedback?: string;
  completed: boolean;
  completionTime?: number;
}

export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: number; // in seconds
  completed: boolean;
  muscleGroup: string[];
  equipment: string[];
  instructions?: string;
  videoUrl?: string;
  notes?: string;
  actualSets?: {
    set: number;
    reps: number;
    weight?: number;
    rest?: number;
    completed: boolean;
  }[];
}

export interface AIInsight {
  id: string;
  userId: string;
  type: 'progress' | 'suggestion' | 'warning' | 'achievement' | 'motivation';
  title: string;
  message: string;
  category: 'diet' | 'workout' | 'lifestyle' | 'general';
  priority: 'low' | 'medium' | 'high';
  actionable: boolean;
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  readAt?: string;
  dismissedAt?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  type: 'streak' | 'milestone' | 'goal' | 'challenge';
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  progress?: number;
  target?: number;
  reward?: string;
}

export interface WeeklyReport {
  id: string;
  userId: string;
  weekStart: string;
  weekEnd: string;
  summary: {
    workoutsCompleted: number;
    totalWorkoutTime: number;
    averageCalories: number;
    weightChange: number;
    bodyFatChange: number;
    muscleMassChange: number;
    goalProgress: number;
  };
  insights: AIInsight[];
  recommendations: string[];
  nextWeekGoals: string[];
  createdAt: string;
}
