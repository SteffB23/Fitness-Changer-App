import React from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useStore } from '../store/useStore';

interface LayoutProps {
  children: React.ReactNode;
  onViewChange: (view: 'calendar' | 'profile') => void;
  activeView: 'calendar' | 'profile';
}

export function Layout({ children, onViewChange, activeView }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const theme = useStore((state) => state.theme);

  const getHeaderClasses = () => {
    switch (theme) {
      case 'all-blue':
        return 'bg-blue-600 text-white';
      case 'colorful':
        return 'bg-gradient-to-r from-pink-500 to-blue-500 text-white';
      case 'dark':
        return 'bg-gray-800 text-white';
      default:
        return 'bg-white';
    }
  };

  return (
    <div className="min-h-screen">
      <header className={`shadow-sm ${getHeaderClasses()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 sm:p-2 rounded-md hover:bg-white hover:bg-opacity-10"
          >
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <h1 className="text-lg sm:text-xl font-semibold">Fitness Changer</h1>
          <div className="w-8 sm:w-12" />
        </div>
      </header>

      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        onViewChange={onViewChange}
        activeView={activeView}
      />

      <main className="px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">{children}</main>
    </div>
  );
}