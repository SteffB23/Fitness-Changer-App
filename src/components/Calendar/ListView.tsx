import React from 'react';
import { format, isToday } from 'date-fns';
import { Plus, Dumbbell, Egg, Sandwich, ChefHat, Cookie } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { MealType } from '../../types';
import { MealDetailsModal } from '../Modals/MealDetailsModal';
import { ExerciseDetailsModal } from '../Modals/ExerciseDetailsModal';

interface ListViewProps {
  days: Date[];
  onAddMeal: (date: Date) => void;
  onAddExercise: (date: Date) => void;
}

const mealIcons: Record<MealType, typeof Egg> = {
  breakfast: Egg,
  lunch: Sandwich,
  dinner: ChefHat,
  snack: Cookie,
};

export function ListView({ days, onAddMeal, onAddExercise }: ListViewProps) {
  const [selectedMeal, setSelectedMeal] = React.useState<{ type: MealType; meals: any[] } | null>(null);
  const [selectedExercise, setSelectedExercise] = React.useState<any | null>(null);
  const theme = useStore((state) => state.theme);
  const dayPlans = useStore((state) => state.dayPlans);

  const getDayClasses = (date: Date) => {
    if (!isToday(date)) return '';
    
    switch (theme) {
      case 'all-blue':
        return 'bg-blue-50';
      case 'colorful':
        return 'bg-gradient-to-r from-pink-50 to-blue-50';
      case 'dark':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <div className="divide-y">
      {days.map((day) => {
        const dateStr = format(day, 'yyyy-MM-dd');
        const dayPlan = dayPlans.find((p) => p.date === dateStr);
        
        return (
          <div
            key={dateStr}
            className={`p-4 ${getDayClasses(day)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-medium">{format(day, 'EEE')}</span>
                <span className="text-gray-500">{format(day, 'MMM d')}</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onAddMeal(day)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title="Add meal"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onAddExercise(day)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                  title="Add exercise"
                >
                  <Dumbbell className="h-5 w-5" />
                </button>
              </div>
            </div>

            {dayPlan && (
              <div className="space-y-2">
                {Object.entries(dayPlan.meals).map(([type, meals]) => {
                  if (meals.length === 0) return null;
                  const Icon = mealIcons[type as MealType];
                  
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedMeal({ type: type as MealType, meals })}
                      className="flex items-center space-x-2 w-full p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <Icon className="h-4 w-4" />
                      <span className="capitalize">{type}</span>
                      <span className="text-gray-500">({meals.length})</span>
                    </button>
                  );
                })}

                {dayPlan.exercises.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {dayPlan.exercises.map((exercise) => (
                      <button
                        key={exercise.id}
                        onClick={() => setSelectedExercise(exercise)}
                        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Dumbbell className="h-4 w-4" />
                        <span>{exercise.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {selectedMeal && (
        <MealDetailsModal
          meals={selectedMeal.meals}
          type={selectedMeal.type}
          onClose={() => setSelectedMeal(null)}
        />
      )}

      {selectedExercise && (
        <ExerciseDetailsModal
          exercise={selectedExercise}
          onClose={() => setSelectedExercise(null)}
        />
      )}
    </div>
  );
}