import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PricingPage } from './components/PricingPage';
import { RegisterPage } from './components/RegisterPage';
import { LoginPage } from './components/LoginPage';
import { BrowsePage } from './components/BrowsePage';
import { AboutPage } from './components/AboutPage';
import { DashboardPage } from './components/DashboardPage';
import { UserProfile } from './components/UserProfile';
import { Route, Routes } from 'react-router-dom';
import SpecficUserProfile from './components/SpecficUserProfile';
import EditProfile from './components/EditProfile';
import Viewvideos from './components/Viewvideos';
function App() {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<HomePage />}  />
        <Route path="pricing" element={<PricingPage/>}  />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="browse" element={<BrowsePage />} />
        <Route path="about" element={<AboutPage/>}/>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="userprofile" element={<UserProfile />} />
        <Route path="profile/:id/:name" element={<SpecficUserProfile/>} />
        <Route path="dashboard/browse" element={<BrowsePage/>}/>
        <Route path="register/login" element={<LoginPage/>}/>
        <Route path="userprofile/ProfileEdit" element={<EditProfile/>}/>
         <Route path="userprofile/:id/:name/filmreels" element={<Viewvideos/>}/>
        
      </Routes>
    </>
  );
}
export default App;
