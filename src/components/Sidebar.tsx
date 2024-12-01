import React from 'react';
import { X, Calendar, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Clock } from './Clock';
import { Weather } from './Weather';
import { SunTimes } from './SunTimes';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  onViewChange: (view: 'calendar' | 'profile') => void;
  activeView: 'calendar' | 'profile';
}

export function Sidebar({ open, onClose, onViewChange, activeView }: SidebarProps) {
  const theme = useStore((state) => state.theme);
  const userProfile = useStore((state) => state.userProfile);

  const getSidebarClasses = () => {
    switch (theme) {
      case 'all-blue':
        return 'bg-blue-50';
      case 'colorful':
        return 'bg-gradient-to-b from-pink-50 to-blue-50';
      case 'dark':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-white';
    }
  };

  const getButtonClasses = (isActive: boolean) => {
    const baseClasses = 'w-full px-4 py-3 flex items-center space-x-3';
    if (theme === 'dark') {
      return `${baseClasses} ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`;
    }
    return `${baseClasses} ${isActive ? 'bg-blue-50' : 'hover:bg-gray-100'}`;
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 w-64 shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } ${getSidebarClasses()} flex flex-col`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <h2 className="text-lg font-semibold">Menu</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {userProfile && (
          <div className="px-4 py-4 border-b">
            <p className="font-medium">{userProfile.name}</p>
            <p className="text-sm text-gray-500">BMI: {userProfile.bmi?.toFixed(1)}</p>
          </div>
        )}

        <nav className="mt-4 flex-1">
          <button
            onClick={() => {
              onViewChange('calendar');
              onClose();
            }}
            className={getButtonClasses(activeView === 'calendar')}
          >
            <Calendar className="h-5 w-5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => {
              onViewChange('profile');
              onClose();
            }}
            className={getButtonClasses(activeView === 'profile')}
          >
            <User className="h-5 w-5" />
            <span>Profile</span>
          </button>
        </nav>

        <SunTimes />
        <Weather />
        
        <div className="border-t p-4">
          <Clock />
        </div>
      </div>
    </>
  );
}