import React from 'react';
import { format, isToday } from 'date-fns';
import { Plus, Dumbbell, Egg, Sandwich, ChefHat, Cookie } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { DayPlan, Exercise, Meal, MealType } from '../../types';
import { MealDetailsModal } from '../Modals/MealDetailsModal';
import { ExerciseDetailsModal } from '../Modals/ExerciseDetailsModal';

interface DayCellProps {
  date: Date;
  onAddMeal: (date: Date) => void;
  onAddExercise: (date: Date) => void;
  isCurrentMonth: boolean;
}

const mealIcons: Record<MealType, typeof Egg> = {
  breakfast: Egg,
  lunch: Sandwich,
  dinner: ChefHat,
  snack: Cookie,
};

export function DayCell({ date, onAddMeal, onAddExercise, isCurrentMonth }: DayCellProps) {
  const [selectedMeal, setSelectedMeal] = React.useState<{ type: MealType; meals: Meal[] } | null>(null);
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null);
  const theme = useStore((state) => state.theme);
  
  const dayPlan = useStore((state) => 
    state.dayPlans.find((p) => p.date === format(date, 'yyyy-MM-dd'))
  );

  const getCurrentDayClasses = () => {
    if (!isToday(date)) return '';
    
    switch (theme) {
      case 'all-blue':
        return 'bg-blue-50 ring-2 ring-blue-500';
      case 'colorful':
        return 'bg-gradient-to-br from-pink-50 to-blue-50 ring-2 ring-purple-500';
      case 'dark':
        return 'bg-gray-800 ring-2 ring-white';
      default:
        return 'bg-gray-50 ring-2 ring-gray-500';
    }
  };

  const renderMealIcons = () => {
    if (!dayPlan) return null;

    return Object.entries(dayPlan.meals).map(([type, meals]) => {
      if (meals.length === 0) return null;
      const Icon = mealIcons[type as MealType];
      
      return (
        <button
          key={type}
          onClick={() => setSelectedMeal({ type: type as MealType, meals })}
          className="p-0.5 sm:p-1 rounded-full hover:bg-gray-100 transition-colors"
          title={`View ${type} details`}
        >
          <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="ml-0.5 text-xs">{meals.length}</span>
        </button>
      );
    });
  };

  const renderExerciseIcons = () => {
    if (!dayPlan?.exercises.length) return null;

    return (
      <div className="flex flex-wrap gap-0.5 sm:gap-1">
        {dayPlan.exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="p-0.5 sm:p-1 rounded-full hover:bg-gray-100 transition-colors"
            title={`View exercise details`}
          >
            <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div 
      className={`bg-white p-1 sm:p-2 min-h-[80px] sm:min-h-[120px] relative group transition-all 
        ${getCurrentDayClasses()}
        ${!isCurrentMonth ? 'opacity-50' : ''}
      `}
    >
      <div className="flex justify-between items-start">
        <span className={`text-xs sm:text-sm font-medium ${isToday(date) && theme === 'dark' ? 'text-white' : ''}`}>
          {format(date, 'd')}
        </span>
        <div className="flex gap-0.5 sm:gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddMeal(date)}
            className="p-0.5 sm:p-1 rounded-full hover:bg-gray-100"
            title="Add meal"
          >
            <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
          <button
            onClick={() => onAddExercise(date)}
            className="p-0.5 sm:p-1 rounded-full hover:bg-gray-100"
            title="Add exercise"
          >
            <Dumbbell className="h-3 w-3 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>

      <div className="mt-1 sm:mt-2 flex flex-wrap gap-1 sm:gap-2">
        {renderMealIcons()}
      </div>

      <div className="mt-1 sm:mt-2">
        {renderExerciseIcons()}
      </div>

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