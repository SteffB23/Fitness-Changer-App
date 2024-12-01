import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Meal, MealType } from '../../types';

interface MealModalProps {
  date: Date;
  onClose: () => void;
}

const initialMeals = {
  breakfast: [],
  lunch: [],
  dinner: [],
  snacks: [],
};

export function MealModal({ date, onClose }: MealModalProps) {
  const [selectedType, setSelectedType] = React.useState<MealType>('breakfast');
  const [customMeal, setCustomMeal] = React.useState<Partial<Meal>>({
    name: '',
    calories: undefined,
    portions: 1,
  });

  const addDayPlan = useStore((state) => state.addDayPlan);
  const updateDayPlan = useStore((state) => state.updateDayPlan);
  const mealTemplates = useStore((state) => state.mealTemplates);
  const dayPlans = useStore((state) => state.dayPlans);

  const dateStr = format(date, 'yyyy-MM-dd');
  const existingPlan = dayPlans.find((p) => p.date === dateStr);

  const handleSave = () => {
    const meal: Meal = {
      id: crypto.randomUUID(),
      name: customMeal.name!,
      type: selectedType,
      calories: customMeal.calories,
      portions: customMeal.portions,
    };

    if (existingPlan) {
      const updatedMeals = {
        ...existingPlan.meals,
        [selectedType]: [...(existingPlan.meals[selectedType] || []), meal],
      };

      updateDayPlan({
        ...existingPlan,
        meals: updatedMeals,
      });
    } else {
      const newPlan = {
        id: crypto.randomUUID(),
        date: dateStr,
        meals: {
          ...initialMeals,
          [selectedType]: [meal],
        },
        exercises: [],
      };
      
      addDayPlan(newPlan);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Add Meal - {format(date, 'MMM d, yyyy')}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meal Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as MealType)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="breakfast">Breakfast (6AM-11AM)</option>
              <option value="lunch">Lunch (11AM-3PM)</option>
              <option value="dinner">Dinner (3PM-9PM)</option>
              <option value="snack">Snack (Any time)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Meal Name
            </label>
            <input
              type="text"
              value={customMeal.name}
              onChange={(e) => setCustomMeal({ ...customMeal, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter meal name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Calories (optional)
              </label>
              <input
                type="number"
                value={customMeal.calories || ''}
                onChange={(e) => setCustomMeal({ ...customMeal, calories: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter calories"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Portions
              </label>
              <input
                type="number"
                value={customMeal.portions}
                onChange={(e) => setCustomMeal({ ...customMeal, portions: Number(e.target.value) })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
              />
            </div>
          </div>

          {mealTemplates.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Or choose from templates
              </label>
              <div className="mt-2 space-y-2">
                {mealTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setCustomMeal(template)}
                    className="block w-full text-left px-4 py-2 rounded-md hover:bg-gray-100"
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!customMeal.name}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}