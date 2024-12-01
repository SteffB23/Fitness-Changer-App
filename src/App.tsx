import React from 'react';
import { Layout } from './components/Layout';
import { Calendar } from './components/Calendar';
import { Profile } from './components/Profile';
import { useStore } from './store/useStore';

function App() {
  const [activeView, setActiveView] = React.useState<'calendar' | 'profile'>('calendar');
  const theme = useStore((state) => state.theme);

  const getThemeClasses = () => {
    switch (theme) {
      case 'all-blue':
        return 'bg-blue-50';
      case 'colorful':
        return 'bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50';
      case 'dark':
        return 'bg-gray-900 text-white';
      default:
        return 'bg-gray-50';
    }
  };

  return (
    <Layout onViewChange={setActiveView} activeView={activeView}>
      <div className={`min-h-screen ${getThemeClasses()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeView === 'calendar' ? <Calendar /> : <Profile />}
        </div>
      </div>
    </Layout>
  );
}

export default App;