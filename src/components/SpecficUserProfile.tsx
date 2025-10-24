
import './SpecficUserProfile.css';
import { useLocation } from "react-router-dom";
import { Profile } from "../data/pricing";
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Mail,
  Calendar,
  Phone,
  User,
  MessageSquare,
  UserPlus,
} from "lucide-react";

interface LocationState {
    ProfileData: Profile;
}

const SpecficUserProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const receivedData = (location.state as LocationState)?.ProfileData;
  console.log("Received Data:", receivedData);

  return (
<div className="min-h-screen bg-gray-900 w-full">
  <div className="max-w-6xl mx-auto">
    <div className="bg-gray-800 rounded-xl p-4 shadow-md">
      {/* Cover Photo */}
      <div className="relative h-56 rounded-lg overflow-hidden">
        {receivedData?.signedCoverPhoto || receivedData.coverPhoto ? (
          <img
            src={receivedData.signedCoverPhoto || receivedData.coverPhoto || ""}
            alt={`${receivedData?.name || "User"} cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-700" />
        )}
        <div className="absolute inset-0 bg-black/40" />
      </div>
      {/* Profile Data */}
        <div className="flex flex-col md:flex-row md:justify-start md:items-end gap-4 px-4 sm:px-6">
          {/* Everything on the RIGHT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-right space-y-4">
            
            {/* Profile Photo */}
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-900 bg-gray-700 -mt-12 z-2">
              {receivedData?.signedProfilePhoto || receivedData.profilePhoto ? (
                <img
                  src={receivedData.signedProfilePhoto|| receivedData.profilePhoto || ""}
                  alt={receivedData?.name || "Profile"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  {/* Default placeholder icon here */}
                </div>
              )}
            </div>

            {/* Name and Role */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {receivedData?.name || ""}
              </h1>
               {receivedData?.role && (
                <div className="w-full text-center lg:text-start">
                  <p className="text-gray-300 text-sm mt-2">
                    {receivedData.role}
                  </p>
                </div>
              )}
            </div>

            {/* Other Details */}
            <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm text-gray-300">
              {receivedData?.location && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                  {receivedData.location}
                </span>
              )}
              {receivedData?.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-4 h-4 text-yellow-400" />
                  {receivedData.email}
                </span>
              )}
              {receivedData?.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-4 h-4 text-yellow-400" />
                  {receivedData.phone}
                </span>
              )}
              {receivedData?.dob && (
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-yellow-400" />
                  {receivedData.dob}
                </span>
              )}
              {receivedData?.gender && (
                <span className="inline-flex items-center gap-1">
                  <User className="w-4 h-4 text-yellow-400" />
                  {receivedData.gender}
                </span>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-2 mt-3 justify-center md:justify-end">
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400 text-gray-900 text-sm font-semibold hover:bg-yellow-300 transition">
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
                onClick={() => {
                  navigate(`/userprofile/${receivedData?.id}/${receivedData?.name}/filmreels`, {
                    state: { ProfileData: receivedData }
                  });
                }}
              >
                View Film Reel
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 text-gray-100 text-sm hover:bg-gray-700 transition">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            </div>
          </div>
        </div>
    </div>
             {/* ======================= About Me Section ======================= */}
          <div className="mt-4 bg-gray-800 p-8 rounded-2xl shadow-xl">
            <h3 className="text-white text-xl font-bold mb-3">About</h3>
            <p className="text-gray-300 text-base">
              {receivedData.bio || "No bio available."}
            </p>
          </div>
      
    {/* Skills */}
    {receivedData?.skills?.length && (
   <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-white mt-4">
      <h2 className="text-2xl font-bold text-center">Specializations</h2>
      <hr className="my-6 border-gray-600" />
      
      <div className="flex flex-wrap justify-center gap-3">
        {receivedData?.skills.map((skill, index) => (
          <span 
            key={index} 
            className="px-4 py-2 bg-gray-700 text-gray-200 rounded-full text-base font-medium hover:bg-gray-600 transition"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  )}
            {/* ======================= Experience & Filmography Section ======================= */}
          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-white text-xl font-bold mb-4">Experience & Filmography</h3>
            <hr className="my-4 border-2 border-gray-300" />
            <div className="space-y-6">
              {receivedData.experience && receivedData.experience.length > 0 ? (
                receivedData.experience.map((exp, i) => (
                  <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <div>
                      <h4 className="text-yellow-400 font-medium">{exp.role || "Director of Photography"}</h4>
                      <p className="text-gray-400 font-medium">{exp.company || "Echoes of the Forgotten"}</p>
                      <p className="text-gray-300 mt-2">{exp.description || "Feature film, a poignant drama exploring themes of memory and loss..."}</p>
                    </div>
                    <span className="bg-gray-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mt-2 sm:mt-0 whitespace-nowrap">{exp.startDate ? `${exp.startDate}${exp.currentlyWorking ? ' - Present' : exp.endDate ? ' - ' + exp.endDate : ''}` : (exp.duration || "2023")}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No experience added yet.</p>
              )}
            </div>
          </div>

              {/* ======================= Education Section (Your New Code) ======================= */}
          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-white text-xl font-bold mb-4">Education</h3>
              <hr className="my-4 border-2 border-gray-300" />

            <div className="space-y-6">
              {receivedData?.education?.length > 0 ? (
                receivedData.education.map((edu, i) => (
                  <div key={i} className="pt-4 first:pt-0 flex flex-col sm:flex-row justify-between sm:items-start">
                    <div>
                      <h4 className="text-yellow-400 font-medium">{edu.course || "Film School Name"}</h4>
                      <p className="text-gray-400 font-medium">{edu.institute || "Bachelor of Fine Arts"}</p>
                      <p className="text-gray-400 mt-2">{edu.description || "Studied cinematography, film direction, and production techniques."}</p>
                    </div>
                    <span className="bg-gray-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mt-2 sm:mt-0 whitespace-nowrap">
                      {edu.duration || "2010 - 2014"}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No education added yet.</p>
              )}
            </div>
          </div>

             {/* ======================= Portfolio & Social Section ======================= */}
          <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-white text-xl font-bold mb-4">Portfolio & Social</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M22 17H2v-2h20v2zm0-4H2v-2h20v2zm0-4H2V7h20v2z"/></svg>
                  <span>IMDb Profile</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M10.749 6.22c-2.31 0-3.905 1.547-4.786 4.093l-1.571 5.093h2.934l.75-2.613c.783-2.52 1.393-3.153 2.15-3.153.942 0 1.637.753 1.637 1.838 0 1.25-.972 2.375-3.036 3.256l-1.396.643 2.506 3.125h2.89c.758-2.66 2.31-6.195 4.757-6.195 1.956 0 2.923 1.365 2.923 2.723 0 2.22-.926 3.704-2.835 3.704-1.282 0-1.892-.768-2.597-2.61l-1.427.65c.987 2.457 2.31 3.79 4.318 3.79 3.036 0 4.88-2.062 4.88-5.182 0-2.843-1.822-5.167-5.06-5.167zm-7.653 0c-2.31 0-3.905 1.547-4.786 4.093l-1.571 5.093h2.934l.75-2.613c.783-2.52 1.393-3.153 2.15-3.153.942 0 1.637.753 1.637 1.838 0 1.25-.972 2.375-3.036 3.256l-1.396.643 2.506 3.125h2.89c.758-2.66 2.31-6.195 4.757-6.195 1.956 0 2.923 1.365 2.923 2.723 0 2.22-.926 3.704-2.835 3.704-1.282 0-1.892-.768-2.597-2.61l-1.427.65c.987 2.457 2.31 3.79 4.318 3.79 3.036 0 4.88-2.062 4.88-5.182 0-2.843-1.822-5.167-5.06-5.167z"/></svg>
                  <span>Vimeo Portfolio</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.41-7-7.93s3.05-7.44 7-7.93v15.86zm2 0V4.07c3.95.49 7 3.41 7 7.93s-3.05 7.44-7 7.93z"/></svg>
                  <span>Personal Website</span>
                </a>
                <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-yellow-400 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                  <span>LinkedIn</span>
                </a>
            </div>
          </div>


    {/* Contact */}
    {receivedData?.email || receivedData?.phone && (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-white mt-4">
      <h2 className="text-2xl font-bold text-center">Contact for Collaborations</h2>
      <hr className="my-6 border-gray-600" />

      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-400">Email</p>
            <div className="flex items-center gap-2 mt-1">
              <Mail className="w-4 h-4 text-gray-300" />
              <span className="text-gray-200">{receivedData.email}</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-400">Phone</p>
            <div className="flex items-center gap-2 mt-1">
              <Phone className="w-4 h-4 text-gray-300" />
              <span className="text-gray-200">{receivedData.phone}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

  </div>
</div>

  );


};

export default SpecficUserProfile;