import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import PageLayout from './components/layout/PageLayout';

// Page imports
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Pricing from './pages/Pricing';
import References from './pages/References';
import ResearchSummary from './pages/ResearchSummary';
import RiskAssessment from './pages/RiskAssessment';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Events from './pages/Events';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#FAFAF7]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-[#E8A020] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E8A020]/30 animate-pulse">
            <span className="text-white text-3xl">♜</span>
          </div>
          <div className="w-8 h-8 border-2 border-[#E8A020]/20 border-t-[#E8A020] rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/references" element={<References />} />
        <Route path="/research-summary" element={<ResearchSummary />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/events" element={<Events />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <QueryClientProvider client={queryClientInstance}>
          <Router>
            <AuthenticatedApp />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </MotionConfig>
  )
}

export default App