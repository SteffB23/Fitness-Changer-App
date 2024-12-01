import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DayPlan, Meal, Exercise, UserProfile, ThemeType } from '../types';

interface Store {
  dayPlans: DayPlan[];
  mealTemplates: Meal[];
  userProfile: UserProfile | null;
  theme: ThemeType;
  history: {
    past: DayPlan[][];
    future: DayPlan[][];
  };
  addDayPlan: (plan: DayPlan) => void;
  updateDayPlan: (plan: DayPlan) => void;
  addMealTemplate: (meal: Meal) => void;
  addExerciseToPlan: (date: string, exercise: Exercise) => void;
  updateUserProfile: (profile: UserProfile) => void;
  setTheme: (theme: ThemeType) => void;
  undo: () => void;
  redo: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      dayPlans: [],
      mealTemplates: [],
      userProfile: null,
      theme: 'default',
      history: {
        past: [],
        future: [],
      },

      addDayPlan: (plan) => {
        const { dayPlans, history } = get();
        set({
          dayPlans: [...dayPlans, plan],
          history: {
            past: [...history.past, dayPlans],
            future: [],
          },
        });
      },

      updateDayPlan: (plan) => {
        const { dayPlans, history } = get();
        set({
          dayPlans: dayPlans.map((p) => (p.id === plan.id ? plan : p)),
          history: {
            past: [...history.past, dayPlans],
            future: [],
          },
        });
      },

      addMealTemplate: (meal) =>
        set((state) => ({
          mealTemplates: [...state.mealTemplates, meal],
        })),

      addExerciseToPlan: (date, exercise) => {
        const { dayPlans } = get();
        const planIndex = dayPlans.findIndex((p) => p.date === date);
        
        if (planIndex === -1) {
          get().addDayPlan({
            id: crypto.randomUUID(),
            date,
            meals: { breakfast: [], lunch: [], dinner: [], snacks: [] },
            exercises: [exercise],
          });
        } else {
          const updatedPlan = {
            ...dayPlans[planIndex],
            exercises: [...dayPlans[planIndex].exercises, exercise],
          };
          get().updateDayPlan(updatedPlan);
        }
      },

      updateUserProfile: (profile) => {
        const bmi = profile.weight / Math.pow(profile.height / 100, 2);
        set({ userProfile: { ...profile, bmi } });
      },

      setTheme: (theme) => set({ theme }),

      undo: () => {
        const { history } = get();
        if (history.past.length === 0) return;

        const previous = history.past[history.past.length - 1];
        const newPast = history.past.slice(0, -1);

        set({
          dayPlans: previous,
          history: {
            past: newPast,
            future: [get().dayPlans, ...history.future],
          },
        });
      },

      redo: () => {
        const { history } = get();
        if (history.future.length === 0) return;

        const next = history.future[0];
        const newFuture = history.future.slice(1);

        set({
          dayPlans: next,
          history: {
            past: [...history.past, get().dayPlans],
            future: newFuture,
          },
        });
      },
    }),
    {
      name: 'meal-planner-storage',
    }
  )
);