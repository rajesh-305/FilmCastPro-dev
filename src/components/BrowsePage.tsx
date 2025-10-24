import React, { useEffect, useState } from 'react';
import { Search, Filter, MapPin, Star, Eye } from 'lucide-react';
import { filmRoles,getSignedUrl,Profile } from '../data/pricing';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';




export const BrowsePage: React.FC = () => {
  const navigate = useNavigate();
  const [mockProfiles,setmockProfiles] = useState<Profile[] | null>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  type plan = 'free' | 'silver' | 'gold';

const order: Record<plan, number> = {
  free: 1,
  silver: 2,
  gold: 3
};



  const filteredProfiles = mockProfiles?.filter(profile => {
    const matchesSearch = profile.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.bio?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || profile.role === selectedRole;
    const matchesLocation = !selectedLocation || profile.location?.toLowerCase().includes(selectedLocation.toLowerCase());
    
    return matchesSearch && matchesRole && matchesLocation;
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'gold': return 'bg-yellow-400 text-gray-900';
      case 'silver': return 'bg-gray-400 text-gray-900';
      default: return 'bg-gray-600 text-white';
    }
  };
  const getUserData = async()=>{
  const {data,error} = await supabase.from('profiles').select("*");
  if(error){
    console.log(error);
  };
  const profilesArray: Profile[] = data ?? [];
  if(profilesArray){
    profilesArray.sort((a, b) => order[b.plan as plan] - order[a.plan as plan]);
  }
  const profileswithSignedUrls: Profile[] = await Promise.all(
    profilesArray.map(async(profile:Profile)=>{
      const signedPhotoURL = profile.profilePhoto? await getSignedUrl("profile-photos",profile.profilePhoto): null;
      const signedCoverURL =profile.coverPhoto? await getSignedUrl("cover-photos",profile.coverPhoto):null;
      return {...profile, signedProfilePhoto:signedPhotoURL,
        signedCoverPhoto : signedCoverURL
      }
    })
  );
  setmockProfiles(profileswithSignedUrls);

  
}
  useEffect(()=>{
    getUserData();
  },[])

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Discover Film Professionals
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Connect with talented individuals across all aspects of filmmaking
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-gray-800 rounded-2xl p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search professionals by name, skills, or experience..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="text-gray-400 text-sm">
              {filteredProfiles?.length} professionals found
            </span>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Role
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-400"
                >
                  <option value="">All Roles</option>
                  {filmRoles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="Enter city or region"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles?.map((profile) => (
            <div
              key={profile.id}
              className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all transform hover:scale-105 cursor-pointer"
            >
            <div className="relative w-full aspect-[16/9] bg-gray-200 rounded-t-lg overflow-hidden">
              <img
                src={profile.signedProfilePhoto || profile.profilePhoto || ""}
                alt={profile.name ?? ""}
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute top-4 right-4 px-2 py-1 rounded-full text-xs font-semibold ${getPlanBadgeColor(
                  profile.plan ?? ""
                )}`}
              >
                {profile.plan?.toUpperCase()}
              </div>
            </div>

              
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {profile.name}
                    </h3>
                    <p className="text-yellow-400 font-medium">{profile.role}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-yellow-400">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{profile.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-400 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{profile.location}</span>
                </div>

                <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                  {profile.bio}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-gray-400">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">{profile.experience?.length} projects</span>
                  </div>
                  <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-300 transition-colors" onClick={()=>{
                    navigate(`/profile/${profile.id}/${profile.name}`,{
                      state: { ProfileData: profile }
                    });
                  }} >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProfiles?.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">No professionals found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};