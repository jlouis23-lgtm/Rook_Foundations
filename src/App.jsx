import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { MotionConfig } from 'framer-motion'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import PageLayout from './components/layout/PageLayout';
import ProtectedRoute from './components/ProtectedRoute';
import PlayLayout from './components/play/layout/PlayLayout';
import PlaySignInPrompt from './components/play/PlaySignInPrompt';

// Page imports
import Home from './pages/Home';
import About from './pages/About';
import Classes from './pages/Classes';
import ChessCurriculum from './pages/ChessCurriculum';
import LearningFramework from './pages/LearningFramework';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import Pricing from './pages/Pricing';
import References from './pages/References';
import RiskAssessment from './pages/RiskAssessment';
import TermsAndConditions from './pages/TermsAndConditions';
import CookiesPolicy from './pages/CookiesPolicy';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Events from './pages/Events';
import Schools from './pages/Schools';
import SendPupils from './pages/SendPupils';
import PlayHome from './pages/play/PlayHome';
import PlayManageProfiles from './pages/play/PlayManageProfiles';
import PlayDashboard from './pages/play/PlayDashboard';
import PlayGamePage from './pages/play/PlayGamePage';
import PlayFriends from './pages/play/PlayFriends';
import PlayChallenges from './pages/play/PlayChallenges';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PageLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/our-approach" element={<Classes />} />
        <Route path="/classes/chess-curriculum" element={<ChessCurriculum />} />
        <Route path="/learning-framework" element={<LearningFramework />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sessions" element={<Booking />} />
        <Route path="/references" element={<References />} />
        <Route path="/risk-assessment" element={<RiskAssessment />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
        <Route path="/cookies-policy" element={<CookiesPolicy />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/clubs" element={<Events />} />
        <Route path="/schools" element={<Schools />} />
        <Route path="/schools/send" element={<SendPupils />} />
      </Route>
      <Route element={<ProtectedRoute unauthenticatedElement={<PlaySignInPrompt />} />}>
        <Route element={<PlayLayout />}>
          <Route path="/play" element={<PlayHome />} />
          <Route path="/play/manage" element={<PlayManageProfiles />} />
          <Route path="/play/:childId" element={<PlayDashboard />} />
          <Route path="/play/:childId/games/:gameId" element={<PlayGamePage />} />
          <Route path="/play/:childId/friends" element={<PlayFriends />} />
          <Route path="/play/:childId/challenges" element={<PlayChallenges />} />
        </Route>
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
            <AppRoutes />
          </Router>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </MotionConfig>
  )
}

export default App