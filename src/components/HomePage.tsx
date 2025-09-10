import React from 'react';
import { Star, Users, Camera, Award, ArrowRight, Facebook, Twitter, Instagram, Linkedin, MapPin, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../HomePage.css';
interface HomePageProps {
  onPageChange: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const features = [
    {
      icon: Users,
      title: 'Connect with Industry Professionals',
      description: 'Find the perfect cast and crew for your next project from our diverse community.'
    },
    {
      icon: Camera,
      title: 'Showcase Your Portfolio',
      description: 'Upload your best work with high-quality media support and professional presentation.'
    },
    {
      icon: Star,
      title: 'Get Discovered',
      description: 'Increase your visibility with our advanced search and recommendation system.'
    },
    {
      icon: Award,
      title: 'Build Your Reputation',
      description: 'Collect reviews and build your professional reputation in the industry.'
    }
  ];

  const roles = [
    'Producers', 'Directors', 'Musicians', 'Actors', 'VFX Artists', 'Cameramen',
    'Costume Designers', 'Makeup Artists', 'Lighting Technicians', 'Acting Trainers', 'Script Writers'
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      
<div className="mx-auto my-8 max-w-4xl">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
    What's New in Film World
  </h2>
  <p className="text-gray-400 text-center mb-8 text-lg">
    Fresh Updates, Hot Teasers & Breaking News
  </p>
  
  <div className="relative bg-gray-800 rounded-2xl overflow-hidden shadow-2xl">
    <div className="aspect-video">
      <iframe 
        width="100%" 
        height="100%" 
        src="https://www.youtube.com/embed/-yXCPQGrMIc?si=BHFCMoMX0qkAryGN&autoplay=1&mute=1" 
        title="YouTube video player" 
        frameBorder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        referrerPolicy="strict-origin-when-cross-origin" 
        allowFullScreen
        className="w-full h-full"
      />
    </div>
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
      <h5 className="text-xl font-bold text-white mb-2">New Teaser</h5>
      <p className="text-gray-200">Watch the latest official trailers and sneak peeks of upcoming blockbusters.</p>
    </div>
  </div>
</div>


      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url("https://images.pexels.com/photos/274937/pexels-photo-274937.jpeg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>

        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Your Film Career
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              Starts Here
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Connect with industry professionals, showcase your portfolio, and discover opportunities 
            in the world of filmmaking.
          </p>
          {!user ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => onPageChange('register')}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
              <button 
                onClick={() => onPageChange('browse')}
                className="border-2 border-yellow-400 text-yellow-400 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-400 hover:text-gray-900 transition-all"
              >
                Browse Talent
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <button 
                onClick={() => onPageChange('browse')}
                className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-yellow-300 transition-all transform hover:scale-105"
              >
                Browse Talent
              </button>
            </div>
          )}
        </div>
      </section>
      {/* Role Categories */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            For Every Film Professional
          </h2>
          <p className="text-gray-400 text-center mb-12 text-lg">
            Whether you're in front of or behind the camera, we have a place for you
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {roles.map((role, index) => (
              <div 
                key={index}
                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center transition-all cursor-pointer transform hover:scale-105"
                onClick={() => onPageChange('register')}
              >
                <span className="text-white font-medium">{role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Why Choose FilmCast Pro?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">10K+</div>
              <div className="text-gray-300 text-lg">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-gray-300 text-lg">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-300 text-lg">Countries Represented</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / CTA Section */}
      {!user ? (
        <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-400">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Ready to Take Your Career to the Next Level?
            </h2>
            <p className="text-gray-800 text-lg mb-8">
              Join thousands of film professionals who are already building their careers with FilmCast Pro.
            </p>
            <button 
              onClick={() => onPageChange('register')}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
            >
              Create Your Profile Today
            </button>
          </div>
        </section>
      ) : (
        <footer className="py-12 bg-gray-900 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center gap-6">
              <div className="flex items-center gap-4">
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              <div className="text-gray-300 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-yellow-400" />
                  <span>Vizag, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-yellow-400" />
                  <a href="tel:+917671801206" className="hover:text-white transition-colors">+91 76718 01206</a>
                </div>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};