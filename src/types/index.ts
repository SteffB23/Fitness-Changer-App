export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type ExerciseType = 'cardio' | 'strength' | 'flexibility' | 'sports' | 'other';
export type IntensityLevel = 'low' | 'medium' | 'high';
export type ThemeType = 'default' | 'all-blue' | 'colorful' | 'dark';

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  bmi?: number;
}

export interface Meal {
  id: string;
  name: string;
  type: MealType;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  portions?: number;
  notes?: string;
}

export interface Exercise {
  id: string;
  type: ExerciseType;
  duration: number;
  intensity: IntensityLevel;
  notes?: string;
  recurring?: {
    frequency: 'daily' | 'weekly';
    days?: number[];
  };
}

export interface DayPlan {
  id: string;
  date: string;
  meals: {
    breakfast: Meal[];
    lunch: Meal[];
    dinner: Meal[];
    snacks: Meal[];
  };
  exercises: Exercise[];
}