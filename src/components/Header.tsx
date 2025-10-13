import React, { useEffect, useState } from 'react';
import { Film, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import {getSignedURL,Profile} from './BrowsePage';



export const Header: React.FC = () => {
  const nagivate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);

 const getData = async () => {
  if (!user) return; 

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id).single();
    console.log(data);

  if (error) {
    console.error('Error fetching user data:', error);
    return;
  } else {
    if(data && (data.profilePhoto || data.coverPhoto)){
      const signedProfilePhotoURL = await getSignedURL(data.profilePhoto);
      const signedCoverPhotoURL = await getSignedURL(data.coverPhoto);
      const finalProfileData = {
        ...data,
        signedProfilePhoto:signedProfilePhotoURL,
        signedCoverPhoto:signedCoverPhotoURL
      }
      console.log('User data:', data);
      setProfile(finalProfileData);

    }
  }
};
 

  const navItems = [
    { id: '/', label: 'Home' },
    { id: 'browse', label: 'Browse Talent' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'about', label: 'About' },
  ];
useEffect(() => {
  if (user) {
    getData();
  }
}, [user]);

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => nagivate('/')}
          >
            <Film className="h-8 w-8 text-yellow-400" />
            <span className="text-xl font-bold text-white">FilmCast Pro</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => nagivate(item.id)}
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.id
                    ? 'text-yellow-400 border-b-2 border-yellow-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => nagivate('search')}
              className="p-2 text-gray-300 hover:text-white transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            {user ? (
              <>
                <button
                  onClick={() => nagivate('dashboard')}
                  className={`px-3 py-2 text-sm font-medium transition-colors ${
                    location.pathname === 'dashboard'
                      ? 'text-yellow-400 border-b-2 border-yellow-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    nagivate('/');
                  }}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign Out
                </button>
                <button
                  onClick={() => {
                    nagivate('userprofile');
                  }}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  <i className="fa-regular fa-user"></i>
                </button>
                {profile && profile.plan !== 'gold' && (
                <button
                  onClick={() => {
                    nagivate('pricing');
                  }}
                  className="px-4 py-2 rounded-lg font-semibold text-gray-900 transition-all
                    bg-yellow-400 hover:bg-yellow-300 shadow-lg animate-pulse border-2 border-yellow-600">
                  Upgrade
                </button>
                )}
              </>
            ) : (
              <>
                <button 
                  onClick={() => nagivate('login')}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => nagivate('register')}
                  className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-300 transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    nagivate(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`px-3 py-2 text-sm font-medium text-left transition-colors ${
                    location.pathname === item.id
                      ? 'text-yellow-400 bg-gray-800'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <div className="border-t border-gray-800 pt-2 mt-2">
                {user ? (
                  <>
                    <button
                      onClick={() => {
                        nagivate('dashboard');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      Dashboard
                    </button>
                    <button
                      onClick={async () => {
                        await signOut();
                        setIsMenuOpen(false);
                        nagivate('/');
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors mt-2"
                    >
                      Sign Out
                    </button>
                    
                  <button
                  onClick={() => {
                    nagivate('userprofile');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300                 hover:text-white hover:bg-gray-800 transition-colors mt -2 flex items-center justify-start"
                  >
                      Profile
                  </button>
                  <button
                    onClick={() => {
                      nagivate('pricing');
                    }}
                    className="px-4 py-2 rounded-lg font-semibold text-gray-900 transition-all
                      bg-yellow-400 hover:bg-yellow-300 shadow-lg mt-2">
                    Upgrade
                  </button>
                  </>

                ) : (
                  <>
                    <button 
                      onClick={() => {
                        nagivate('login');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                      Sign In
                    </button>
                    <button 
                      onClick={() => {
                        nagivate('register');
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-sm font-medium bg-yellow-400 text-gray-900 hover:bg-yellow-300 transition-colors rounded-lg mt-2"
                    >
                      Get Started
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};