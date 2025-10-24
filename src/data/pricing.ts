import { PricingTier } from '../types';
import { supabase } from '../lib/supabaseClient';

export const pricingTiers: PricingTier[] = [
  {
    name: 'free',
    price: 0 ,
    features: [
      'Basic profile creation',
      'Up to 5 portfolio items',
      'Standard search visibility',
      'Community support'
    ],
    portfolioLimit: 5,
    featured: false
  },
  {
    name: 'silver',
    price: 99,
    features: [
      'Enhanced profile features',
      'Up to 25 portfolio items',
      'Priority search ranking',
      'Video portfolio support',
      'Analytics dashboard',
      'Email support'
    ],
    portfolioLimit: 25,
    featured: true
  },
  {
    name: 'gold',
    price: 299,
    features: [
      'Premium profile with custom branding',
      'Unlimited portfolio items',
      'Top search placement',
      'HD video support',
      'Advanced analytics',
      'Priority support',
      'Portfolio website builder',
      'Lead generation tools'
    ],
    portfolioLimit: Infinity,
    featured: false
  }
];

export const filmRoles = [
  'Producer',
  'Director', 
  'Musician',
  'Hero',
  'Heroine',
  'Character Artist',
  'Lighting Technician',
  'Transportation',
  'Catering',
  'VFX Artist',
  'Cameraman',
  'Costume Designer',
  'Acting Trainer',
  'Makeup Artist',
  'Infrastructure Provider',
  'Script Writer',
] as const;

export const  roles = [
  { name: 'Producer', highlighted: true },
  { name: 'Director', highlighted: false },
  { name: 'Musician', highlighted: false },
  { name: 'Hero', highlighted: false },
  { name: 'Heroine', highlighted: false },
  { name: 'Character Artist', highlighted: true },
  { name: 'Lighting Technician', highlighted: false },
  { name: 'Transportation', highlighted: false },
  { name: 'Catering', highlighted: false },
  { name: 'VFX Artist', highlighted: false },
  { name: 'Cameraman', highlighted: true },
  { name: 'Costume Designer', highlighted: false },
  { name: 'Acting Trainer', highlighted: false },
  { name: 'Makeup Artist', highlighted: false },
  { name: 'Infrastructure Provider', highlighted: false },
  { name: 'Script Writer', highlighted: true },
];

export type Experience = {
  company: string;
  role: string;
  duration: string;
  description: string;
  startDate?: string;
  endDate?: string;
  currentlyWorking?: boolean;
};

export type Education = {
  institute: string;
  course: string;
  duration: string;
  description: string;
};

export type skills = string[];
export interface Profile {  

    headline?: string | null;
    education: Education[];
    email:string | null;
    gender:string | null;
    phone:string | null;
    dob:string | null;
    socialLink: string| null;
    instagram: string | null;
    id: string | null; 
    user_id: string | null;
    name: string | null;            
    bio: string | null;             
    location: string | null;       
    plan: 'free' | 'silver' | 'gold' | string | null; 
    role: string | null;
    coverPhoto: string | null;     
    profilePhoto: string | null; 
    experience : Experience[] ; 
    rating : number |  null;  
    signedProfilePhoto : string | null
    signedCoverPhoto : string | null
    skills: string[];
    clips: Clip[] | null;
}

 export type ProfileData = {
  name: string;
  user_id: string;
  role: string;
  location: string;
  bio: string;
  headline?: string;
  coverPhoto: string |null;
  profilePhoto: string | null;
  experience: Experience[];
  skills: string[];
  education: Education[];
  plan: string;
  email:string;
  gender:string;
  phone:string;
  dob:string;
  socialLink: string;
  instagram: string;
  clips: Clip[];
};

export const DEFAULT_COVER_PHOTO = 'https://https://wallpapers.com/images/hd/minimalist-simple-linkedin-background-inmeafna599ltxxm.jpg.com/default-cover-photo.jpg';
export const DEFAULT_PROFILE_PHOTO = 'https://example.com/https://www.pngitem.com/pimgs/m/504-5040528_empty-profile-picture-png-transparent-png.png-profile-photo.jpg';

 export const checkSession = async ()=>{
    const {data} = await supabase.auth.getSession();
    if (data?.session) {
    const userId = data.session.user.id;
    const userName = data.session.user.identities?.[0]?.identity_data?.name || "";
    

    return [userId, userName];
    }
    else{
      console.log("No active session is there");
    }
  }

export const getSignedUrl = async (bucketName: string, filePath: string) => {
  if (!filePath) return null;

  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(filePath, 60 * 60); // 1 hour valid

  if (error) {
    console.error("Error generating signed URL:", error.message);
    return null;
  }
  return data?.signedUrl || null;
};
export interface Clip {
    id: number;
    storagepath: string;
    title: string;
    duration: number; // Stored in seconds
    signedUrl: string; // The temporary URL for playback
}
