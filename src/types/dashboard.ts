export interface DashboardData {
  profile: UserProfile | null;
  progress: ProgressRecord | null;
  mealPlan: MealPlan | null;
  workoutPlan: WorkoutPlan | null;
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  name?: string;
  age: number | null;
  weight: number | null;
  height: number | null;
  gender: string | null;
  activity_level: string | null;
  goals: string[] | null;
  dietary_restrictions: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface ProgressRecord {
  id: string;
  user_id: string;
  weight: number;
  record_date: string;
  created_at: string;
}

export interface MealPlanData {
  meals: {
    breakfast: { name: string; time: string; calories: number; foods: string[] };
    lunch: { name: string; time: string; calories: number; foods: string[] };
    dinner: { name: string; time: string; calories: number; foods: string[] };
    snack: { name: string; time: string; calories: number; foods: string[] };
  };
  nutritionTargets: {
    dailyCalories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface WorkoutPlanData {
  workouts: Array<{
    name: string;
    focus: string;
    duration: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest: string;
    }>;
  }>;
  schedule: Array<{
    day: string;
    time: string;
    focus: string;
  }>;
}

export interface MealPlan {
  id: string;
  user_id: string;
  plan_date: string;
  plan_data: MealPlanData;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  plan_date: string;
  plan_data: WorkoutPlanData;
  created_at: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResponse {
  error: AuthError | null;
  data?: {
    user: {
      id: string;
      email: string;
      user_metadata: {
        full_name?: string;
      };
    };
  };
}
