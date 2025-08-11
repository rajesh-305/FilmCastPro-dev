import React from 'react';
import { Users, Target, Award, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AboutPageProps {
  onPageChange: (page: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onPageChange }) => {
  const { user } = useAuth();
  const values = [
    {
      icon: Users,
      title: 'Community First',
      description: 'We believe in building a supportive community where film professionals can connect, collaborate, and grow together.'
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in everything we do, providing the best platform for showcasing and discovering talent.'
    },
    {
      icon: Award,
      title: 'Recognition',
      description: 'Every professional deserves recognition for their craft. We help talented individuals get the visibility they deserve.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about film and the incredible people who bring stories to life behind and in front of the camera.'
    }
  ];

  const team = [
    {
      name: 'Alex Rivera',
      role: 'CEO & Founder',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?w=300&h=300&fit=crop',
      bio: 'Former film producer with 15 years in the industry'
    },
    {
      name: 'Maya Patel',
      role: 'CTO',
      image: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?w=300&h=300&fit=crop',
      bio: 'Tech leader passionate about connecting creative professionals'
    },
    {
      name: 'Jordan Kim',
      role: 'Head of Community',
      image: 'https://images.pexels.com/photos/3779432/pexels-photo-3779432.jpeg?w=300&h=300&fit=crop',
      bio: 'Industry veteran focused on building meaningful connections'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
              {' '}FilmCast Pro
            </span>
          </h1>
          <p className="text-xl text-gray-300 leading-relaxed">
            We're on a mission to connect the global film community, making it easier for 
            talented professionals to showcase their work and find meaningful opportunities 
            in the industry they love.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our Mission
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                The film industry is built on relationships, creativity, and collaboration. 
                Yet, many talented professionals struggle to connect with the right opportunities 
                and showcase their work to the right audience.
              </p>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                FilmCast Pro bridges this gap by providing a professional platform where 
                every role in filmmaking - from producers to costume designers, from directors 
                to catering services - can build their presence and connect with projects that 
                match their skills and passion.
              </p>
              {!user && (
                <button
                  onClick={() => onPageChange('register')}
                  className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors"
                >
                  Join Our Community
                </button>
              )}
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?w=600&h=400&fit=crop"
                alt="Film crew working"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <value.icon className="h-8 w-8 text-gray-900" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our team combines deep industry experience with cutting-edge technology 
              to create the best platform for film professionals.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                <p className="text-yellow-400 font-medium mb-3">{member.role}</p>
                <p className="text-gray-400">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Growing Every Day
            </h2>
            <p className="text-gray-400 text-lg">
              Join thousands of professionals who trust FilmCast Pro
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">10,000+</div>
              <div className="text-gray-300">Active Professionals</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">500+</div>
              <div className="text-gray-300">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">50+</div>
              <div className="text-gray-300">Countries</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-yellow-400 mb-2">95%</div>
              <div className="text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400 to-orange-400">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-gray-800 text-lg mb-8">
            Start building your professional profile today and connect with opportunities 
            that match your passion and skills.
          </p>
          {!user && (
            <button
              onClick={() => onPageChange('register')}
              className="bg-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105"
            >
              Get Started Now
            </button>
          )}
        </div>
      </section>
    </div>
  );
};