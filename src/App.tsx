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
        <Route path="profile/:id" element={<SpecficUserProfile/>} />
        <Route path="dashboard/browse" element={<BrowsePage/>}/>
        <Route path="register/login" element={<LoginPage/>}/>
      </Routes>
    </>
  );
}
/*
function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onPageChange={setCurrentPage} />;
      case 'pricing':
        return <PricingPage onPageChange={setCurrentPage} />;
      case 'register':
        return <RegisterPage onPageChange={setCurrentPage} />;
      case 'login':
        return <LoginPage onPageChange={setCurrentPage} />;
      case 'browse':
        return <BrowsePage onPageChange={setCurrentPage} />;
      case 'search':
        return <BrowsePage onPageChange={setCurrentPage} />;
      case 'about':
        return <AboutPage onPageChange={setCurrentPage} />;
      case 'dashboard':
        return <DashboardPage onPageChange={setCurrentPage} />;
      case 'profile':                         
        return <UserProfile onPageChange={setCurrentPage} />;
      default:
        return <HomePage onPageChange={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      {renderPage()}
    </div>
  );
}*/

export default App;
