
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header.tsx';
import Dashboard from './components/Dashboard.tsx';
import Insights from './components/Insights.tsx';
import ProfilePage from './components/ProfilePage.tsx';
import LoginPage from './components/LoginPage.tsx';
import RegisterPage from './components/RegisterPage.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import TestSessionPage from './pages/TestSessionPage.tsx';
import WellnessPage from './pages/WellnessPage.tsx';
import SocialPage from './pages/SocialPage.tsx';
import LandingPage from './pages/LandingPage.tsx';
import PricingPage from './pages/PricingPage.tsx';
import AICoach from './components/coach/AICoach.tsx';
import PrivacyPolicy from './pages/legal/PrivacyPolicy.tsx';
import TermsOfService from './pages/legal/TermsOfService.tsx';
import ResearchEthics from './pages/legal/ResearchEthics.tsx';
import ConsentBanner from './components/ui/ConsentBanner.tsx';
import { AuthProvider } from './context/AuthContext.tsx';
import { useUserData } from './hooks/useUserData.ts';
import { Bot, MessageSquareText } from 'lucide-react';

const App: React.FC = () => {
  const { history, clearHistory } = useUserData();
  const [isCoachOpen, setIsCoachOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-950 text-slate-200">
          <Header />
          
          <main className="flex-1 container mx-auto px-4 py-8 relative">
            <Routes>
              {/* Public Marketing & Legal Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/ethics" element={<ResearchEthics />} />
              
              {/* Auth Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Protected Dashboard Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              
              {/* Dynamic Test Route */}
              <Route path="/test/:testId" element={<ProtectedRoute><TestSessionPage /></ProtectedRoute>} />
              
              {/* Feature Routes */}
              <Route path="/wellness" element={<ProtectedRoute><WellnessPage /></ProtectedRoute>} />
              <Route path="/social" element={<ProtectedRoute><SocialPage /></ProtectedRoute>} />
              <Route path="/insights" element={<ProtectedRoute><Insights results={[]} /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              
              {/* Fallback for construction */}
              <Route 
                path="/test/sequence" 
                element={
                  <ProtectedRoute>
                    <div className="p-12 text-center bg-slate-900 rounded-3xl border border-dashed border-slate-700">
                      <h2 className="text-2xl font-bold mb-4">Module Under Construction</h2>
                      <p className="text-slate-400">Advanced Sequence capacity testing is coming soon.</p>
                      <Link to="/" className="mt-6 inline-block px-6 py-2 bg-slate-800 rounded-lg">Return Home</Link>
                    </div>
                  </ProtectedRoute>
                } 
              />
            </Routes>

            {/* AI Coach Chat Interface */}
            <AICoach 
              isOpen={isCoachOpen} 
              onClose={() => setIsCoachOpen(false)} 
              history={history} 
            />

            {/* Floating Action Button for AI Coach */}
            <button
              onClick={() => setIsCoachOpen(true)}
              className="fixed bottom-8 right-8 z-50 p-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl shadow-2xl shadow-blue-600/40 transition-all hover:scale-110 active:scale-90 group"
              title="Open AI Coach"
            >
              <div className="relative">
                <Bot className="w-7 h-7 group-hover:hidden" />
                <MessageSquareText className="w-7 h-7 hidden group-hover:block animate-in zoom-in" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                )}
              </div>
            </button>
          </main>

          <footer className="border-t border-slate-900 py-12 bg-slate-950">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
              <div className="space-y-4 text-center md:text-left">
                <div className="text-slate-300 font-black uppercase tracking-tighter text-xl">MindMetricAI</div>
                <div className="text-slate-500 text-xs max-w-xs">
                  Next-generation cognitive assessment & high-performance bio-metrics. Quantify your mind today.
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                <Link to="/privacy" className="text-slate-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest">Privacy Policy</Link>
                <Link to="/terms" className="text-slate-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest">Terms of Service</Link>
                <Link to="/ethics" className="text-slate-500 hover:text-white transition-colors text-xs uppercase font-black tracking-widest">Research Ethics</Link>
              </div>
              <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">
                &copy; {new Date().getFullYear()} Cognitive Health Engine.
              </div>
            </div>
          </footer>
          
          {/* Global Consent Flow */}
          <ConsentBanner />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
