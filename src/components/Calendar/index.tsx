import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List } from 'lucide-react';
import { DayCell } from './DayCell';
import { MealModal } from '../Modals/MealModal';
import { ExerciseModal } from '../Modals/ExerciseModal';
import { ListView } from './ListView';

export function Calendar() {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [modalType, setModalType] = React.useState<'meal' | 'exercise' | null>(null);
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate)),
    end: endOfWeek(endOfMonth(currentDate)),
  });

  const handleAddMeal = (date: Date) => {
    setSelectedDate(date);
    setModalType('meal');
  };

  const handleAddExercise = (date: Date) => {
    setSelectedDate(date);
    setModalType('exercise');
  };

  const closeModal = () => {
    setSelectedDate(null);
    setModalType(null);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg sm:text-xl font-semibold">
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex items-center space-x-2">
              <div className="md:hidden">
                <button
                  onClick={() => setView(view === 'grid' ? 'list' : 'grid')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title={view === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
                >
                  {view === 'grid' ? <List className="h-5 w-5" /> : <CalendarIcon className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full"
                >
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:block">
          {view === 'grid' ? (
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="bg-gray-50 py-2 text-center text-xs sm:text-sm font-medium text-gray-500"
                >
                  <span className="hidden xs:block">{day}</span>
                  <span className="xs:hidden">{day[0]}</span>
                </div>
              ))}
              
              {days.map((day) => (
                <DayCell
                  key={day.toString()}
                  date={day}
                  onAddMeal={handleAddMeal}
                  onAddExercise={handleAddExercise}
                  isCurrentMonth={isSameMonth(day, currentDate)}
                />
              ))}
            </div>
          ) : (
            <ListView
              days={days.filter(day => isSameMonth(day, currentDate))}
              onAddMeal={handleAddMeal}
              onAddExercise={handleAddExercise}
            />
          )}
        </div>
      </div>

      {selectedDate && modalType === 'meal' && (
        <MealModal date={selectedDate} onClose={closeModal} />
      )}

      {selectedDate && modalType === 'exercise' && (
        <ExerciseModal date={selectedDate} onClose={closeModal} />
      )}
    </>
  );
}