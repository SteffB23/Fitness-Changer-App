import React from 'react';
import { X } from 'lucide-react';
import type { Meal, MealType } from '../../types';

interface MealDetailsModalProps {
  meals: Meal[];
  type: MealType;
  onClose: () => void;
}

export function MealDetailsModal({ meals, type, onClose }: MealDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold capitalize">
            {type} Details
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="bg-gray-50 p-4 rounded-lg"
              >
                <h4 className="font-medium">{meal.name}</h4>
                <div className="mt-2 text-sm text-gray-600 space-y-1">
                  {meal.calories && (
                    <p>Calories: {meal.calories}</p>
                  )}
                  {meal.portions && (
                    <p>Portions: {meal.portions}</p>
                  )}
                  {meal.notes && (
                    <p className="text-gray-500">{meal.notes}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}