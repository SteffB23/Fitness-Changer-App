import React from 'react';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Exercise, ExerciseType, IntensityLevel } from '../../types';

interface ExerciseModalProps {
  date: Date;
  onClose: () => void;
}

export function ExerciseModal({ date, onClose }: ExerciseModalProps) {
  const [exercise, setExercise] = React.useState<Partial<Exercise>>({
    type: 'cardio',
    duration: 30,
    intensity: 'medium',
    notes: '',
  });

  const addExerciseToPlan = useStore((state) => state.addExerciseToPlan);

  const handleSave = () => {
    addExerciseToPlan(format(date, 'yyyy-MM-dd'), {
      id: crypto.randomUUID(),
      type: exercise.type as ExerciseType,
      duration: exercise.duration!,
      intensity: exercise.intensity as IntensityLevel,
      notes: exercise.notes,
      recurring: exercise.recurring,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Add Exercise - {format(date, 'MMM d, yyyy')}
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
              Exercise Type
            </label>
            <select
              value={exercise.type}
              onChange={(e) => setExercise({ ...exercise, type: e.target.value as ExerciseType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="flexibility">Flexibility</option>
              <option value="sports">Sports</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Duration (minutes)
            </label>
            <input
              type="number"
              value={exercise.duration}
              onChange={(e) => setExercise({ ...exercise, duration: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Intensity
            </label>
            <select
              value={exercise.intensity}
              onChange={(e) => setExercise({ ...exercise, intensity: e.target.value as IntensityLevel })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              value={exercise.notes}
              onChange={(e) => setExercise({ ...exercise, notes: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              rows={3}
              placeholder="Add any notes about your exercise..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={!!exercise.recurring}
                onChange={(e) => setExercise({
                  ...exercise,
                  recurring: e.target.checked ? { frequency: 'weekly', days: [] } : undefined,
                })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">Make this a recurring exercise</span>
            </label>

            {exercise.recurring && (
              <div className="mt-2">
                <select
                  value={exercise.recurring.frequency}
                  onChange={(e) => setExercise({
                    ...exercise,
                    recurring: { ...exercise.recurring!, frequency: e.target.value as 'daily' | 'weekly' },
                  })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>
            )}
          </div>
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
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}