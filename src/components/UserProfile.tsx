import React, { useEffect, useState, useRef } from "react";
import "./UserProfile.css";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { ProfileData, checkSession, getSignedUrl,Clip } from "../data/pricing";

// Define a type for the video upload status
type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

export const UserProfile: React.FC = () => {
  const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);
  const closeModal = () => {
        setModalVideoUrl(null);
    };
    const openModal = (url: string) => {
        console.log("Opening modal for URL:", url);
        setModalVideoUrl(url);
    };
    const navigate = useNavigate();
    const [ProfileData, setProfileData] = useState<ProfileData>({
        // ... (rest of your ProfileData state initialization)
        name: "",
        role: "",
        location: "",
        bio: "",
        headline: "",
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
        socialLink: "",
        instagram:"",
        clips: [],
    });

    // === NEW STATE FOR UPLOAD MANAGEMENT ===
    const [uploadState, setUploadState] = useState<UploadStatus>('idle');
    const [showUploadModal, setShowUploadModal] = useState(false);
    // ======================================

    const fileInputRef = useRef<HTMLInputElement>(null);

const fetchData = async () => {
    const loginId = await checkSession();
    const userId = loginId?.[0];
    const storageBucketName = "uservideos"; 

    if (!userId) {
        console.log("No active session");
        return;
    }

    const { data, error: profileError } = await supabase
        .from("profiles")
        .select(`
            *,
            clips (
                id, 
                storagepath,
                title,
                duration
            )
        `)
        .eq("user_id", userId)
        .single();
        
    let finalProfileData = data;
    
    if (profileError && profileError.code === 'PGRST116') {
        console.log("Profile not found, performing upsert.");
        const { data: upsertData, error: upsertError } = await supabase.from("profiles").upsert(
            {
                user_id: userId,
                name: loginId?.[1] || 'New User', // Use a default name if loginId[1] is missing
            },
            { onConflict: "user_id" })
            .select(`
                *,
                clips (
                    id, 
                    storagepath,
                    title,
                    duration
                )
            `) 
            .single();
            
        if (upsertError) {
            console.error("Upsert error:", upsertError.message);
            return;
        }
        finalProfileData = upsertData;
    } else if (profileError) {
        console.error("General profile fetch error:", profileError.message);
    }
    
    if (!finalProfileData) {
        setProfileData({
            name: "", role: "", location: "", bio: "", headline: "", coverPhoto: "", profilePhoto: "", 
            experience: [], skills: [], education: [], plan: "", email:"", gender:"", phone:"", dob:"", 
            socialLink: "", instagram:"", clips: []
        });
        return;
    }

    const fetchedClips: Clip[] = (finalProfileData.clips as Clip[]) || [];
    const clipsWithUrls: Clip[] = [];
    

    for (const clip of fetchedClips) {
        let signedUrl = "";
        if (clip?.storagepath) {
            signedUrl = await getSignedUrl(storageBucketName, clip.storagepath) ?? ""; 
        }
        
        clipsWithUrls.push({
            ...clip,
            signedUrl: signedUrl
        });
    }

    // 4. Process Profile Photos
    const profilePhotoUrl = finalProfileData.profilePhoto
        ? await getSignedUrl("profile-photos", finalProfileData.profilePhoto)?? "" : "";
    const coverPhotoUrl = finalProfileData.coverPhoto
        ? await getSignedUrl("cover-photos", finalProfileData.coverPhoto)?? "" : "";
        
    // 5. Create Final Data Object and Update State
    const completeProfileData = {
        ...finalProfileData,
        profilePhoto: profilePhotoUrl,
        coverPhoto: coverPhotoUrl,
        clips: clipsWithUrls, // Use the processed array with signed URLs
    };
    
    console.log("Complete Profile Data:", completeProfileData);

    setProfileData(completeProfileData as ProfileData);
};

    // === UPLOAD HANDLER FUNCTION ===
    const uploadVideo = async (file: File) => {
        const loginId = await checkSession();
        const userId = loginId?.[0];

        if (!userId) {
            alert("You must be logged in to upload a video.");
            return;
        }

        setUploadState('uploading');
        setShowUploadModal(true);

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${file.name.substring(0, 10)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`; 
        try {
            const { error: uploadError } = await supabase.storage
                .from('uservideos')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            const { error: dbError } = await supabase
            .from('clips')
            .insert({ 
                user_id: userId, 
                storagepath: filePath,
                title: file.name, 
            });

        if (dbError) {
            await supabase.storage.from('').remove([filePath]);
            throw dbError;
        }

            setUploadState('done');
            fetchData(); 

        } catch (error: unknown) {
            let errorMessage = "An unknown error occurred during video upload.";

            if (error instanceof Error) {
                errorMessage = error.message;
            } else if (
                typeof error === 'object' && 
                error !== null && 
                'message' in error
            ) {
                errorMessage = (error as { message: string }).message;
            }
            
            setUploadState('error');
            console.error("Video upload error:", errorMessage);
            alert(`Upload failed: ${errorMessage}`);

        }
    };

    
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            uploadVideo(file);
        }
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Handler to close the modal and reset status
    const handleCloseModal = () => {
        setShowUploadModal(false);
        setUploadState('idle');
    };

    // ... (rest of your useEffect)
    useEffect(() => {
        fetchData();
    }, []);


    const formatDuration = (seconds: number | undefined): string => {
    if (typeof seconds !== 'number' || seconds <= 0) return "0:00";
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    console.log(`Formatting duration: ${seconds} seconds as ${minutes}:${paddedSeconds}`);
    return `${minutes}:${paddedSeconds}`;
};


return (
    <>
      <div className="bg-gray-900 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl mx-auto">
          
          {/* ======================= Header Section ======================= */}
          <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg">
            <img
              src={ProfileData.coverPhoto || "https://wallpapers.com/images/hd/minimalist-simple-linkedin-background-inmeafna599ltxxm.jpg"}
              alt="Cover"
              className="w-full h-48 object-cover"
            />
            <div className="p-6 relative">
              <div className="absolute left-6 md:left-10 -top-16">
                <div className="w-32 h-32 rounded-full border-4 border-gray-900 shadow-2xl overflow-hidden bg-gray-700 flex items-center justify-center">
                  <img
                    src={ProfileData.profilePhoto || "https://placehold.co/128x128/374151/ffffff?text=No+Photo"} 
                    alt={`${ProfileData.name || "User"}'s Profile`}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
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
                <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg shadow hover:bg-yellow-400 transition duration-300 font-medium" onClick={
                  () => { 

                    navigate('ProfileEdit', {
                      state: {initialProfileData: ProfileData}
                    }); 
                    }
                } > Edit Profile </button>
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
 {/* About Section*/}
    <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-white mt-4">
        <h2 className="text-2xl font-bold text-center">About</h2>
        <hr className="my-6 border-gray-600" />
        <p className="text-gray-300 text-lg leading-relaxed text-center">
           {ProfileData?.bio}
          </p>
      </div>
   {/* Experience */}
    {ProfileData?.experience?.length && (
    <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-white mt-4">
      <h2 className="text-2xl font-bold text-center">Filmography & Experience</h2>
      <hr className="my-6 border-gray-600" />

      {/* Container for the list of experiences */}
      <div className="space-y-0">
        {ProfileData?.experience?.map((exp,index) => (
          
          <div key={index} className="flex gap-4 sm:gap-6">
            
           
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white">{exp.role}</h3>
              <p className="text-sm text-gray-400 mt-1">{exp.duration}</p>
              <p className="text-base text-gray-300 mt-1 leading-relaxed">
                {exp.description}
              </p>
              <hr className="my-6 border-gray-600" />
            </div>

          </div>
        ))}
      </div>
    </div>)}
          

    {/* Education */}
    {ProfileData?.education?.length && (
        <div className="bg-gray-800 rounded-2xl p-8 shadow-xl text-white mt-4">
      <h2 className="text-2xl font-bold text-center">Education & Training</h2>
      <hr className="my-6 border-gray-600" />
      <div className="space-y-0">
        {ProfileData?.education.map((edu,index) => (
          
          <div key={index} className="flex gap-4 sm:gap-6">
            
           
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-white">{edu.course}</h3>
              <p className="text-sm text-gray-400 mt-1"> {edu.institute}&nbsp;&nbsp;&nbsp;{edu.duration}</p>
              <p className="text-base text-gray-300 mt-1 leading-relaxed">
                {edu.description}
              </p>
              <hr className="my-6 border-gray-600" />
            </div>

          </div>
        ))}
      </div>
    </div>)}
<div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white text-xl font-bold">Video Showcase</h3>
                            
                            {/* 1. Hidden File Input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="video/*" // Restrict to video files
                                style={{ display: 'none' }} 
                            />
                            
                            {/* 2. Button to trigger the hidden file input */}
                            <button 
                                className="text-black bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-2xl hover:bg-yellow-400 transition duration-300"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploadState === 'uploading'} // Disable if already uploading
                            >
                                +
                            </button>
                        </div>

                        {/* === Video Upload Modal (CONDITIONAL RENDERING) === */}
                        {showUploadModal && (
                            <div className="mt-4 p-4 rounded-lg shadow-xl"
                                style={{ 
                                    backgroundColor: uploadState === 'done' ? 'rgb(22 163 74)' : 
                                                     uploadState === 'error' ? 'rgb(185 28 28)' : 
                                                     'rgb(55 65 81)' 
                                }}
                            >
                                <div className="flex justify-between items-center text-white">
                                    <p className="font-semibold">
                                        {uploadState === 'uploading' && "Uploading Video... Please wait."}
                                        {uploadState === 'done' && "✅ Upload Successful!"}
                                        {uploadState === 'error' && "❌ Upload Failed."}
                                    </p>
                                    <button 
                                        className="text-white font-bold py-1 px-3 rounded"
                                        onClick={handleCloseModal}
                                        // Close button is disabled ONLY while uploading
                                        disabled={uploadState === 'uploading'} 
                                    >
                                        Close
                                    </button>
                                </div>
                                {uploadState === 'uploading' && (
                                    <div className="mt-2 w-full bg-gray-600 rounded-full h-2.5">
                                        <div className="bg-yellow-400 h-2.5 rounded-full animate-pulse" style={{ width: '100%' }}></div>
                                    </div>
                                )}
                            </div>
                        )}
                        {/* ==================================================== */}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {ProfileData.clips?.length && ProfileData.clips.length > 0 ? (
              ProfileData.clips.map((clip) => (
                  <div 
                      key={clip.id} 
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-700 cursor-pointer shadow-md"
                      // === ADD ONCLICK HANDLER HERE ===
                      onClick={() => openModal(clip.signedUrl)} 
                      // ================================
                  >
                      {/* Use the signedUrl as the source for the video player */}
                      <video 
                          src={clip.signedUrl} 
                          poster="https://placehold.co/400x225/374151/ffffff?text=Video+Clip" 
                          className="w-full h-full object-cover"
                          controls={false} // Thumbnail view, no controls
                      />
                      
                      <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 p-2">
                          <div className="flex justify-between items-center">
                              {/* Display the title (which is the original filename) */}
                              <p className="text-white text-sm font-medium truncate">{clip.title || "Untitled Clip"}</p>
                              
                              {/* Display the formatted duration */}
                              <span className="text-xs text-gray-300 ml-2 bg-gray-900 px-1.5 py-0.5 rounded">
                                  {formatDuration(clip.duration)} 
                              </span>
                          </div>
                      </div>
                  </div>
              ))
          ) : (
              <p className="text-gray-400 col-span-4">No videos in the showcase yet. Click the + button to upload your first clip!</p>
          )}
      </div>
                    </div>
          {/* =================================================================================== */}
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
      {/* ======================= Fullscreen Video Modal ======================= */}
{modalVideoUrl && (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
        // Close modal when clicking on the dimmed background
        onClick={closeModal}
    >
        {/* Backdrop with Blur and Dimming */}
        <div 
            className="absolute inset-0 bg-black bg-opacity-80 backdrop-filter backdrop-blur-md"
        ></div>

        {/* Modal Content / Video Container */}
        <div 
            className="relative max-w-4xl w-full max-h-full bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
            // Prevent clicks on the video container from closing the modal
            onClick={(e) => e.stopPropagation()} 
        >
            {/* Close Button */}
            <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-white text-4xl font-light z-50 p-2 hover:text-yellow-400 transition"
                aria-label="Close video player"
            >
                &times;
            </button>

            {/* Video Player */}
            <div className="relative aspect-video w-full">
                <video
                    // Key forces video re-render and ensures video starts playing
                    key={modalVideoUrl} 
                    src={modalVideoUrl}
                    className="w-full h-full object-contain"
                    controls 
                    autoPlay // Start playing automatically
                />
            </div>
        </div>
    </div>
)}
{/* Closing tags for the UserProfile component's return */}
    </>
  );
};