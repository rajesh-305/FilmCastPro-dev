import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface DashboardPageProps {
  onPageChange: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onPageChange }) => {
  const { user, signOut } = useAuth();

  useEffect(() => {
    if (!user) {
      onPageChange('login');
    }
  }, [user, onPageChange]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-4">Welcome, {user.email}</h1>
          <p className="text-gray-400 mb-8">You're signed in. From here you can browse talent, update your profile, or explore plans.</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => onPageChange('browse')}
              className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
            >
              Browse Talent
            </button>
            <button
              onClick={() => onPageChange('pricing')}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              View Plans
            </button>
            <button
              onClick={async () => {
                await signOut();
                onPageChange('home');
              }}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Sign Out
            </button>
            <button
              onClick={() => onPageChange('home')}
              className="bg-gray-700 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


