import React from 'react';
import { X } from 'lucide-react';
import type { Exercise } from '../../types';

interface ExerciseDetailsModalProps {
  exercise: Exercise;
  onClose: () => void;
}

export function ExerciseDetailsModal({ exercise, onClose }: ExerciseDetailsModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            Exercise Details
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Type</p>
                <p className="mt-1 capitalize">{exercise.type}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Duration</p>
                <p className="mt-1">{exercise.duration} minutes</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Intensity</p>
                <p className="mt-1 capitalize">{exercise.intensity}</p>
              </div>
              {exercise.recurring && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Recurring</p>
                  <p className="mt-1 capitalize">{exercise.recurring.frequency}</p>
                </div>
              )}
            </div>

            {exercise.notes && (
              <div>
                <p className="text-sm font-medium text-gray-500">Notes</p>
                <p className="mt-1 text-gray-600">{exercise.notes}</p>
              </div>
            )}
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