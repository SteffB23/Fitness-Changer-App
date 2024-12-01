import React from 'react';
import { useStore } from '../../store/useStore';
import { UserProfile } from '../../types';

export function Profile() {
  const userProfile = useStore((state) => state.userProfile);
  const updateUserProfile = useStore((state) => state.updateUserProfile);
  const theme = useStore((state) => state.theme);
  const setTheme = useStore((state) => state.setTheme);

  const [formData, setFormData] = React.useState<UserProfile>({
    name: userProfile?.name || '',
    age: userProfile?.age || 0,
    height: userProfile?.height || 0,
    weight: userProfile?.weight || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(formData);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Profile Settings</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Age</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            Save Profile
          </button>
        </form>

        {userProfile?.bmi && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <p className="text-sm font-medium text-gray-700">
              Your BMI: {userProfile.bmi.toFixed(1)}
            </p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Theme Settings</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setTheme('default')}
            className={`p-4 rounded-lg border-2 ${
              theme === 'default' ? 'border-blue-500' : 'border-gray-200'
            }`}
          >
            Default
          </button>
          <button
            onClick={() => setTheme('all-blue')}
            className={`p-4 rounded-lg border-2 ${
              theme === 'all-blue' ? 'border-blue-500' : 'border-gray-200'
            } bg-blue-50`}
          >
            All Blue
          </button>
          <button
            onClick={() => setTheme('colorful')}
            className={`p-4 rounded-lg border-2 ${
              theme === 'colorful' ? 'border-blue-500' : 'border-gray-200'
            } bg-gradient-to-r from-pink-50 to-blue-50`}
          >
            Colorful
          </button>
          <button
            onClick={() => setTheme('dark')}
            className={`p-4 rounded-lg border-2 ${
              theme === 'dark' ? 'border-blue-500' : 'border-gray-200'
            } bg-gray-900 text-white`}
          >
            Dark
          </button>
        </div>
      </div>
    </div>
  );
}