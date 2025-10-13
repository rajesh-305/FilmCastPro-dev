import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { supabase } from "../lib/supabaseClient";

export type Experience = {
  company: string;
  role: string;
  duration: string;
  description: string;
};

export type Education = {
  institute: string;
  course: string;
  duration: string;
  description: string;
};
export type skills = string[];



 export type ProfileData = {
  name: string;
  role: string;
  location: string;
  bio: string;
  coverPhoto: string |null;
  profilePhoto: string | null;
  experience: Experience[];
  skills: skills[];
  education: Education[];
  plan: string;
  email:string;
  gender:string;
  phone:string;
  dob:string;
};


export const UserProfile: React.FC = () => {
  const [ProfileData, setProfileData] = useState<ProfileData>({
    name: "",
    role: "",
    location: "",
    bio: "",
    coverPhoto: "",
    profilePhoto: "",
    experience: [],
    skills: [],
    education: [],
    plan: "",
    email:"",
  gender:"",
  phone:"",
  dob:"",
  });
  const [UpdateProfileData, setUpdateProfileData] = useState<ProfileData>({
    name: "",
    role: "",
    location: "",
    bio: "",
    coverPhoto: "",
    profilePhoto: "",
    experience: [],
    skills: [],
    education: [],
    plan: "",
    email:"",
  gender:"",
  phone:"",
  dob:""
  });

  const [modal, setModal] = useState(false);

  const checkSession = async ()=>{
    const {data} = await supabase.auth.getSession();
    if (data?.session) {
    const userId = data.session.user.id;
    const userName = data.session.user.identities?.[0]?.identity_data?.name || "";
    
    console.log("User ID:", userId);
    console.log("User Name:", userName);

    return [userId, userName];
    }
    else{
      console.log("No active session is there");
    }
  }


const fetchData = async () => {
  const loginId = await checkSession();
  const userId = loginId?.[0];

  if (!userId) {
    console.log("No active session");
    return;
  }

  console.log("Logged in user ID:", userId);

  const { data, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (profileError) {
        const { data, error } = await supabase.from("profiles").upsert(
        {
            user_id: userId,
            name: loginId?.[1],
        },
        { onConflict: "user_id" })
        .select()
        .single();
        if (error) {
          console.error("Upsert error:", error.message);
          return;
        }
        console.log("Final Profile Data:", data);
       setProfileData(data);
       return;
    }
    console.log("Final Profile Data (Fetched):", data);
    setProfileData(data);
};



  useEffect(() => {
    fetchData();
  }, []);

const [updaterole, setupdaterole] = useState({
  role: "",      
  otherRole: "", 
});


const updateData = async (e: React.FormEvent) => {
  e.preventDefault();

const loginId = await checkSession();
  if (!loginId) {
    console.log("User not logged in!");
    return;
  }

  const user_id = loginId[0];
  const userrole = updaterole.role === "Others" ? updaterole.otherRole : updaterole.role;

  const updatedData = {
    ...UpdateProfileData,
    role: userrole,
  };

  console.log("Updating user_id:", user_id);
  console.log("Final update data:", updatedData);
const { data, error } = await supabase
  .from("profiles")
  .update({...updatedData }) 
  .eq("user_id", user_id)
  .select();

console.log("Test update data:", data);
console.log("Test update error:", error);

  if (error) {
    console.error("Supabase error:", error);
    return;
  }
else{
  console.log("Updated profile:", data);
  setProfileData(data[0]);
  setModal(false);
}
};




const DeleteExpericence = (index: number) => {
  const updatedExperience = [...UpdateProfileData.experience];
  updatedExperience.splice(index, 1);
  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperience
  });
};

const DeleteEducation = (index:number)=>{
    const updateEducation = [...UpdateProfileData.education];
    updateEducation.splice(index,1);
    setUpdateProfileData({...UpdateProfileData,education:updateEducation})
}

const [editingEduIndex, setEditingEduIndex] = useState<number | null>(null);

const [editingIndex, setEditingIndex] = useState<number | null>(null);

const startEdit = (index: number) => {
  setEditingIndex(index);
};

const saveEdit = (index: number, updatedData: Experience) => {
  const updatedExperiences = [...UpdateProfileData.experience];
  updatedExperiences[index] = updatedData;

  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperiences,
  });

  setEditingIndex(null); 
};
const startEditEdu = (index: number) => {
  setEditingEduIndex(index);
};

const saveEditEdu = (index: number, updatedData: Education) => {
  const updatedEducation = [...UpdateProfileData.education];
  updatedEducation[index] = updatedData;

  setUpdateProfileData({
    ...UpdateProfileData,
    education: updatedEducation,
  });

  setEditingEduIndex(null); 
};
const [newExperience, setNewExperience] = useState<Experience>({
  company: "",
  role: "",
  duration: "",
  description: "",
});

const [newEducation, setNewEducation] = useState<Education>({
  institute: "",
  course: "",
  duration: "",
  description: "",
});
const [isAddingExperience, setIsAddingExperience] = useState(false);
const [isAddingEducation,setisAddingEducation] = useState(false);

const addnewExpEdu = (type: string) => {
  if (type === "Experience") {
    setIsAddingExperience(true);
  } else if (type === "Education") {
    setisAddingEducation(true);
  }
};
const saveNewExperience = () => {
  const updatedExperience = [...(UpdateProfileData.experience || []), newExperience];
  setUpdateProfileData({
    ...UpdateProfileData,
    experience: updatedExperience,
  });
  setIsAddingExperience(false);
  setNewExperience({ company: "", role: "", duration: "", description: "" });
};

const saveNewEducation = () => {
  const updatedEducation = [...(UpdateProfileData.education || []), newEducation];
  setUpdateProfileData({
    ...UpdateProfileData,
    education: updatedEducation,
  });
  setisAddingEducation(false);
  setNewEducation({ institute: "", course: "", duration: "", description: "" });
};

const handleProfilePhotoUpload = async (e:React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return;

  const fileName = `${Date.now()}-${file.name}`;

  const {error} = await supabase.storage
      .from('profile-photos')
      .upload(fileName,file,{cacheControl:'3600',upsert:true})
  
  if(error){
    console.log(error.message);
    return;
  }
  const {data} = await supabase.storage.from("profile-photos").getPublicUrl(fileName);
  if(!data){
    return null;
  }

  setUpdateProfileData({
    ...UpdateProfileData,
    profilePhoto : fileName
  })
};

const handleCoverPhotoUpload = async(e:React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const fileUrl = URL.createObjectURL(file);

  setUpdateProfileData({
    ...UpdateProfileData,
    coverPhoto: fileUrl,
  });

};
const handleDeleteProfilePhoto = () => {
  setUpdateProfileData((prevData) => ({
    ...prevData,
    profilePhoto: null
  }));
};

const handleDeleteCoverPhoto = () => {
  setUpdateProfileData((prevData) => ({
    ...prevData,
    coverPhoto: null, 
  }));
};









return (
    <>
<div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
  <div className="w-full max-w-5xl mx-auto">
    
    {/* ======================= Header Section ======================= */}
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
      <img
        src={ProfileData.coverPhoto || "https://images.unsplash.com/photo-1574717521945-40345513f556?q=80&w=2070&auto=format&fit=crop"}
        alt="Cover"
        className="w-full h-48 object-cover"
      />
      <div className="p-6 relative">
        <div className="absolute left-6 md:left-10 -top-16">
          <img
            src={ProfileData.profilePhoto || "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop"}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-800 shadow-md"
          />
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between">
          <div className="mt-16 sm:mt-0 sm:ml-40 flex-grow">
            <h1 className="text-3xl font-bold text-white">{ProfileData.name || ""}</h1>
            <p className="text-yellow-400 text-lg">{ProfileData.role || ""}</p>
            <p className="text-gray-400 text-sm">{ProfileData.location || ""}</p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center gap-4 text-sm whitespace-nowrap">
            <div className="text-center">
              <p className="font-bold text-white">0</p>
              <p className="text-gray-400">Connections</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-white">0</p>
              <p className="text-gray-400">Projects</p>
            </div>
           <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-400 transition duration-300 font-medium" onClick={() => { setUpdateProfileData({ ...ProfileData }); setModal(true); }} > Edit Profile </button>
          </div>
        </div>
      </div>
    </div>

    {/* ======================= About Me Section ======================= */}
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-white text-xl font-bold mb-3">About Me</h3>
      <p className="text-gray-300 text-base">
        {ProfileData.bio || "No bio available."}
      </p>
    </div>

    {/* ======================= Experience & Filmography Section ======================= */}
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-white text-xl font-bold mb-4">Experience & Filmography</h3>
       <hr className="my-4 border-2 border-gray-300" />
      <div className="space-y-6">
        {ProfileData.experience && ProfileData.experience.length > 0 ? (
          ProfileData.experience.map((exp, i) => (
            <div key={i} className="flex flex-col sm:flex-row justify-between sm:items-start border-b border-gray-700 pb-4 last:border-b-0 last:pb-0">
              <div>
                <h4 className="text-yellow-400 font-medium">{exp.role || "Director of Photography"}</h4>
                <p className="text-gray-400 font-medium">{exp.company || "Echoes of the Forgotten"}</p>
                <p className="text-gray-300 mt-2">{exp.description || "Feature film, a poignant drama exploring themes of memory and loss..."}</p>
              </div>
              <span className="bg-gray-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full mt-2 sm:mt-0 whitespace-nowrap">{exp.duration || "2023"}</span>
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
        {ProfileData?.education?.length > 0 ? (
          ProfileData.education.map((edu, i) => (
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

    {/* ======================= Skills & Expertise Section ======================= */}
    <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-white text-xl font-bold mb-4">Skills & Expertise</h3>
      {ProfileData.skills?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {ProfileData.skills.map((skill, index) => (
            <span key={index} className="bg-gray-700 text-gray-200 px-4 py-2 rounded-md text-sm font-medium">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No skills added yet.</p>
      )}
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

  </div>
</div>

      {modal && (
        <div
          className="modal d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Edit Profile</h5>
                <button
                  className="btn-close"
                  onClick={() => setModal(false)}
                ></button>
              </div>

<div className="modal-body">
<div className="position-relative mb-4">
  <div
    className="rounded overflow-hidden position-relative"
    style={{ height: "180px", backgroundColor: "#f0f0f0" }}
  >
    {/* Cover Image */}
    <img
      src={UpdateProfileData.coverPhoto || "https://tse1.mm.bing.net/th/id/OIP.Ap7CXl8VCxaeqDKo1uRYTAHaB2?pid=Api&P=0&h=180"}
      alt="Cover"
      className="w-100 h-100"
      style={{ objectFit: "cover" }}
    />

    {/* Upload Cover Photo Button */}
    <label
      className="position-absolute top-0 end-0 m-2 btn btn-sm btn-dark"
      style={{ cursor: "pointer" }}
    >
      Change Cover
      <input
        type="file"
        accept="image/*"
        onChange={(e) => handleCoverPhotoUpload(e)}
        style={{ display: "none" }}
      />
    </label>

    {/* Delete Cover Photo Button */}
    {UpdateProfileData.coverPhoto && (
      <button
        type="button"
        className="position-absolute top-0 start-0 m-2 bg-danger text-white p-1 rounded-circle border-0"
        style={{
          width: "30px",
          height: "30px",
          cursor: "pointer",
        }}
        onClick={() => handleDeleteCoverPhoto()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>

  <div className="position-absolute start-50 translate-middle">
    <div
      className="rounded-circle border border-3 border-white shadow position-relative"
      style={{
        width: "80px",
        height: "80px",
        overflow: "hidden",
        backgroundColor: "#e0e0e0",
      }}
    >
      <img
        src={UpdateProfileData.profilePhoto || "https://tse3.mm.bing.net/th/id/OIP.apRNXJkvlf4bc55gw0dXLQHaHa?pid=Api&P=0&h=180"}
        alt="Profile"
        className="w-100 h-100"
        style={{ objectFit: "cover" }}
      />

      <label
        className="position-absolute bottom-2 end-2 
           bg-black bg-opacity-50 text-white 
           rounded-circle d-flex align-items-center justify-content-center 
           cursor-pointer hover:bg-opacity-75 shadow"
style={{ width: "18px", height: "18px", fontSize: "14px" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleProfilePhotoUpload(e)}
          style={{ display: "none" }}
        />
      </label>

      {/* Delete Profile Photo Button */}
      {UpdateProfileData.profilePhoto && (
        <button
          type="button"
          className="position-absolute top-0 end-0 bg-danger text-white p-1 rounded-circle border-0"
          style={{
            width: "28px",
            height: "28px",
            cursor: "pointer",
          }}
          onClick={() => handleDeleteProfilePhoto()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  </div>
</div>

{/* Spacing below the header */}
<div style={{ height: "40px" }}></div>


  <div className="mb-3">
    <label htmlFor="name" className="form-label text-dark">
      Name
    </label>
    <input
      type="text"
      className="form-control"
      value={UpdateProfileData.name}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          name: e.target.value,
        })
      }
    />
  </div>


<div className="mb-3">
  <label htmlFor="role" className="form-label text-dark">
    Role (Movie Craft)
  </label>
  <div className="custom-dropdown-wrapper" style={{ maxHeight: '250px', overflowY: 'auto' }}>
    <select
      id="role"
      className="form-select form-select-tiny"
      value={updaterole.role || UpdateProfileData.role}
      onChange={(e) =>
        setupdaterole({
          ...updaterole,
          role: e.target.value,
        })
      }
      
    >
      <option value="">{updaterole.role}</option>
      <option value="Director">Director</option>
      <option value="Producer">Producer</option>
      <option value="Screenwriter">Screenwriter</option>
      <option value="Cinematographer">Cinematographer</option>
      <option value="Editor">Editor</option>
      <option value="Art Director">Art Director</option>
      <option value="Costume Designer">Costume Designer</option>
      <option value="Music Director">Music Director</option>
      <option value="Sound Designer">Sound Designer</option>
      <option value="Lyricist">Lyricist</option>
      <option value="Playback Singer">Playback Singer</option>
      <option value="Choreographer">Choreographer</option>
      <option value="VFX Artist">VFX Artist</option>
      <option value="Makeup Artist">Makeup Artist</option>
      <option value="Hair Stylist">Hair Stylist</option>
      <option value="Lighting Technician">Lighting Technician</option>
      <option value="Production Designer">Production Designer</option>
      <option value="Assistant Director">Assistant Director</option>
      <option value="Dialogue Writer">Dialogue Writer</option>
      <option value="Casting Director">Casting Director</option>
      <option value="Publicist">Publicist</option>
      <option value="Stunt Coordinator">Stunt Coordinator</option>
      <option value="Actor/Actress">Actor / Actress</option>
      <option value="Dubbing Artist">Dubbing Artist</option>
      <option value="Others">Others</option>
    </select>
  </div>
</div>

{updaterole.role === "Others" && (
  <div className="mb-3">
    <input
      type="text"
      className="form-control"
      placeholder="Enter Your Role"
      onChange={(e) => {
        setupdaterole({ ...updaterole, otherRole: e.target.value });
      }}
    />
  </div>
)}





  <div className="mb-3">
    <label htmlFor="location" className="form-label text-dark">
      Location
    </label>
    <input
      type="text"
      className="form-control"
      value={UpdateProfileData.location}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          location: e.target.value,
        })
      }
    />
  </div>


  <div className="mb-3">
    <label htmlFor="bio" className="form-label text-dark">
      Bio
    </label>
    <input
      className="form-control"
      value={UpdateProfileData.bio}
      onChange={(e) =>
        setUpdateProfileData({
          ...UpdateProfileData,
          bio: e.target.value,
        })
      }
    />
  </div>


<div className="mb-4">
  <label className="form-label text-dark h5 fw-bold">Experience Details</label>

<div className="row">
  {UpdateProfileData?.experience?.length > 0 ? (
    UpdateProfileData.experience.map((exp, index) => (
      <div key={index} className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          {editingIndex === index ? (
            // ===== EDIT MODE =====
            <div>
              <div className="mb-2">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  value={exp.role}
                  onChange={(e) => {
                    const updated = [...UpdateProfileData.experience];
                    updated[index].role = e.target.value;
                    setUpdateProfileData({
                      ...UpdateProfileData,
                      experience: updated,
                    });
                  }}
                />
              </div>
              {/* Company, Duration, Description fields similar to Role */}
              <div className="d-flex justify-content-end gap-2">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => saveEdit(index, exp)}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // ===== VIEW MODE =====
            <div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="card-title mb-0 text-dark fw-bold">
                    {exp.role}
                  </h5>
                  <small className="text-muted">{exp.company}</small>
                </div>
                <span
                  className="badge text-secondary px-3 py-2"
                  style={{ fontStyle: "italic" }}
                >
                  {exp.duration}
                </span>
              </div>
              {exp.description && (
                <p className="card-text mt-2 text-muted">{exp.description}</p>
              )}
              <div className="d-flex justify-content-end gap-2 mt-2">
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => startEdit(index)}
                >
                  <i className="fa-solid fa-pen text-secondary"></i>
                </button>
                <button
                  className="btn btn-sm p-0 border-0 bg-transparent"
                  onClick={() => DeleteExpericence(index)}
                >
                  <i className="fa-solid fa-trash text-secondary"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    ))
  ) : (
    <p className="text-muted">No experience added yet.</p>
  )}

  {/* ADD NEW EXPERIENCE FORM */}
   {isAddingExperience && (
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          <div className="mb-2">
            <label className="form-label">Role</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.role}
              onChange={(e) =>
                setNewExperience({ ...newExperience, role: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Company</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.company}
              onChange={(e) =>
                setNewExperience({ ...newExperience, company: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-control"
              value={newExperience.duration}
              onChange={(e) =>
                setNewExperience({ ...newExperience, duration: e.target.value })
              }
            />
          </div>

          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={newExperience.description}
              onChange={(e) =>
                setNewExperience({ ...newExperience, description: e.target.value })
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button
              className="btn btn-sm btn-success"
              onClick={()=>saveNewExperience()}
            >
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setIsAddingExperience(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
</div>


  {/* ADD BUTTON */}
  {!isAddingExperience && (
    <button
      className="btn mt-1"
      onClick={() => addnewExpEdu("Experience")}
    >
      <i className="fa-solid fa-circle-plus"></i> Add Experience
    </button>
  )}
</div>



<div className="mb-2">
  <label className="form-label text-dark h5 fw-bold">Education Details</label>

  <div className="row">
    {UpdateProfileData?.education?.length > 0 ? (
      UpdateProfileData.education.map((edu, index) => (
        <div key={index} className="card mb-3 shadow-sm border-0">
          <div className="card-body">
            {editingEduIndex === index ? (
              // ===== EDIT MODE =====
              <div>
                <div className="mb-2">
                  <label className="form-label">Institute</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.institute}
                    onChange={(e) => {
                      const updated = [...UpdateProfileData.education];
                      updated[index].institute = e.target.value;
                      setUpdateProfileData({
                        ...UpdateProfileData,
                        education: updated,
                      });
                    }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Course</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.course}
                    onChange={(e) => {
                      const updated = [...UpdateProfileData.education];
                      updated[index].course = e.target.value;
                      setUpdateProfileData({
                        ...UpdateProfileData,
                        education: updated,
                      });
                    }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Duration</label>
                  <input
                    type="text"
                    className="form-control"
                    value={edu.duration}
                    onChange={(e) => {
                      const updated = [...UpdateProfileData.education];
                      updated[index].duration = e.target.value;
                      setUpdateProfileData({
                        ...UpdateProfileData,
                        education: updated,
                      });
                    }}
                  />
                </div>

                <div className="mb-2">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={edu.description}
                    onChange={(e) => {
                      const updated = [...UpdateProfileData.education];
                      updated[index].description = e.target.value;
                      setUpdateProfileData({
                        ...UpdateProfileData,
                        education: updated,
                      });
                    }}
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => saveEditEdu(index, edu)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => setEditingEduIndex(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // ===== VIEW MODE =====
              <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <div>
                    <h5 className="card-title mb-0 text-dark fw-bold">
                      {edu.institute}
                    </h5>
                    <small className="text-muted">{edu.course}</small>
                  </div>

                  <span
                    className="badge text-secondary px-3 py-2"
                    style={{ fontStyle: "italic" }}
                  >
                    {edu.duration}
                  </span>
                </div>

                {edu.description && (
                  <p className="card-text mt-2 text-muted">{edu.description}</p>
                )}

                <div className="d-flex justify-content-end gap-2 mt-2">
                  <button
                    className="btn btn-sm p-0 border-0 bg-transparent"
                    onClick={() => startEditEdu(index)}
                  >
                    <i className="fa-solid fa-pen text-secondary"></i>
                  </button>
                  <button
                    className="btn btn-sm p-0 border-0 bg-transparent"
                    onClick={() => DeleteEducation(index)}
                  >
                    <i className="fa-solid fa-trash text-secondary"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ))
    ) : (
      <p className="text-muted">No education available.</p>
    )}

    {isAddingEducation && (
      <div className="card mb-3 shadow-sm border-0">
        <div className="card-body">
          <div className="mb-2">
            <label className="form-label">Institute</label>
            <input
              type="text"
              className="form-control"
              value={newEducation.institute}
              onChange={(e) =>
                setNewEducation({ ...newEducation, institute: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Course</label>
            <input
              type="text"
              className="form-control"
              value={newEducation.course}
              onChange={(e) =>
                setNewEducation({ ...newEducation, course: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Duration</label>
            <input
              type="text"
              className="form-control"
              value={newEducation.duration}
              onChange={(e) =>
                setNewEducation({ ...newEducation, duration: e.target.value })
              }
            />
          </div>
          <div className="mb-2">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={newEducation.description}
              onChange={(e) =>
                setNewEducation({ ...newEducation, description: e.target.value })
              }
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-sm btn-success" onClick={saveNewEducation}>
              Save
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => setisAddingEducation(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>

  <button
    className="btn mt-3"
    onClick={() => addnewExpEdu("Education")}
  >
    <i className="fa-solid fa-circle-plus"></i> Add Education
  </button>
</div>

</div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={updateData}>
                  Update
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};