import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Import 
import { supabase } from "../lib/supabaseClient";
import { getSignedUrl,Clip} from '../data/pricing';


interface LocationState {
    initialProfileData: { 
        user_id: string;
    };
    
    ProfileData?: {
        user_id: string;
    };
}


// Helper function to format duration (M:SS or H:MM:SS)
const formatDuration = (seconds: number | undefined): string => {
    if (typeof seconds !== 'number' || seconds <= 0) return "0:00";
    seconds = Math.round(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const paddedMinutes = hours > 0 ? minutes.toString().padStart(2, '0') : minutes.toString();
    const paddedSeconds = remainingSeconds.toString().padStart(2, '0');
    
    if (hours > 0) {
        return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }
    return `${minutes}:${paddedSeconds}`;
};

const Viewvideos: React.FC = () => {
    const location = useLocation();
    
    // Extract user_id safely from the location state
    const receivedData = location.state as LocationState | undefined;
    const userId = receivedData?.ProfileData?.user_id || receivedData?.initialProfileData?.user_id;

    // === 1. STATE FOR VIDEO GALLERY AND MODAL ===
    const [videoClips, setVideoClips] = useState<Clip[]>([]);
    const [modalVideoUrl, setModalVideoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    // ============================================

    const getVideoData = async () => {
        if (!userId) {
            console.error("User ID not found in location state.");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        const storageBucketName = 'uservideos'; // Ensure this matches your bucket name

        try{
            // Fetch all clips for the target user
            const {data , error} = await supabase
                .from('clips')
                .select('*')
                .eq('user_id', userId);

            if(error){
                console.error("Error fetching clips:", error);
                setIsLoading(false);
                return;
            }

            if(data && data.length > 0){
                const clipURLS: Clip[] = [];
                for(const clip of data){
                    let signedUrl: string| null = "";
                    
                    // NOTE: You MUST use the correct column name here (e.g., clip.file_path or clip.video_path)
                    // I'm using clip.storagepath as per your provided code, but verify this in your DB!
                    if (clip.storagepath) { 
                        signedUrl = await getSignedUrl(storageBucketName, clip.storagepath);
                    }
                    
                    clipURLS.push({
                        id: clip.id,
                        storagepath: clip.storagepath,
                        title: clip.title,
                        duration: clip.duration,
                        signedUrl: signedUrl || '',
                    });
                }
                setVideoClips(clipURLS);
            }
            setIsLoading(false);
        }
        catch(error){
            console.error("Error fetching video data:", error);
            setIsLoading(false);
        }
    }

    // Handlers for the Modal
    const openModal = (url: string) => setModalVideoUrl(url);
    const closeModal = () => setModalVideoUrl(null);


    useEffect(() => {
        if (userId) {
            getVideoData();
        } else {
             setIsLoading(false);
             console.log("No User ID to fetch videos for.");
        }
    }, [userId]);


    return (
        <div className="bg-gray-900 min-h-screen p-4 sm:p-8">
            <div className="w-full max-w-5xl mx-auto">
                
                <h1 className="text-3xl font-bold text-yellow-400 mb-6">User Video Showcase</h1>
                <p className="text-gray-400 mb-8">A collection of creative works from this profile.</p>

                {/* Loading State */}
                {isLoading && (
                    <div className="text-center p-10">
                        <p className="text-white text-lg">Loading clips...</p>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && videoClips.length === 0 && (
                    <div className="text-center p-10 bg-gray-800 rounded-lg">
                        <p className="text-gray-400 text-lg">No videos found for this user.</p>
                    </div>
                )}
                
                {/* Video Gallery Grid */}
                {!isLoading && videoClips.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {videoClips.map((clip) => (


<div 
    key={clip.id} 
    className="relative aspect-video rounded-lg overflow-hidden bg-gray-800 cursor-pointer shadow-xl transform transition hover:scale-[1.02]"
    onClick={() => openModal(clip.signedUrl)} 
>
    {/* Video Thumbnail/Preview: Static Poster is displayed */}
    <video 
        src={clip.signedUrl} 
        // CRITICAL: We remove autoPlay, loop, and muted
        // The poster image will now be displayed instead of the video playing.
        poster="https://placehold.co/600x337/374151/ffffff?text=Video+Clip" 
        className="w-full h-full object-cover transition-opacity duration-500 hover:opacity-75"
        controls={false}
        playsInline 
    />
    
    {/* Play Icon Overlay (Good UX to indicate it's clickable) */}
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 transition duration-300">
        <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-white fill-current opacity-75" 
            viewBox="0 0 20 20" 
            fill="currentColor"
        >
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
    </div>

    {/* Overlay for Title and Duration (remains the same) */}
    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex justify-between items-end">
            <p className="text-white text-md font-semibold truncate pr-2">{clip.title || "Untitled Video"}</p>
            
            <span className="text-xs text-yellow-400 bg-gray-900 px-2 py-0.5 rounded-full font-medium">
                {formatDuration(clip.duration)}
            </span>
        </div>
    </div>
</div>
                        ))}
                    </div>
                )}
            </div>

            {/* Fullscreen Video Modal (Lightbox) */}
            {modalVideoUrl && (
                <div 
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
                    onClick={closeModal}
                >
                    {/* Backdrop with Blur and Dimming */}
                    <div 
                        className="absolute inset-0 bg-black bg-opacity-85 backdrop-filter backdrop-blur-md"
                    ></div>

                    {/* Modal Content / Video Player */}
                    <div 
                        className="relative max-w-5xl w-full max-h-full bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
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

                        {/* Video Element */}
                        <div className="relative aspect-video w-full">
                            <video
                                key={modalVideoUrl} 
                                src={modalVideoUrl}
                                className="w-full h-full object-contain"
                                controls 
                                autoPlay
                                loop // Optional: loop the video
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 
export default Viewvideos;