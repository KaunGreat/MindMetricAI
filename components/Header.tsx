
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, User, BarChart3, LayoutDashboard, LogOut, Heart, Users, Sparkles, Tag } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher.tsx';
import { useAuth } from '../context/AuthContext.tsx';
import LevelProgress from './ui/LevelProgress.tsx';
import { useUserData } from '../hooks/useUserData.ts';

const Header: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const { xp, level } = useUserData();

  const loggedInLinks = [
    { path: '/dashboard', label: t('header.dashboard'), icon: <LayoutDashboard className="w-4 h-4" /> },
    { path: '/wellness', label: 'Wellness', icon: <Heart className="w-4 h-4" /> },
    { path: '/social', label: 'Social', icon: <Users className="w-4 h-4" /> },
    { path: '/insights', label: t('header.insights'), icon: <BarChart3 className="w-4 h-4" /> },
    { path: '/profile', label: t('header.profile'), icon: <User className="w-4 h-4" /> },
  ];

  const loggedOutLinks = [
    { path: '/', label: 'Features', icon: <Sparkles className="w-4 h-4" /> },
    { path: '/pricing', label: 'Pricing', icon: <Tag className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl hidden sm:block font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
            MindMetricAI
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto no-scrollbar">
          {user ? (
            loggedInLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  location.pathname === link.path 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))
          ) : (
            loggedOutLinks.map(link => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-all whitespace-nowrap ${
                  location.pathname === link.path 
                  ? 'text-blue-400 bg-blue-400/10' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))
          )}
        </nav>

        <div className="flex items-center gap-4 ml-auto">
          {user && <LevelProgress xp={xp} level={level} />}
          
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          
          {user ? (
            <div className="flex items-center gap-2">
              <Link 
                to="/profile"
                className="flex items-center justify-center p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
                title={user.email}
              >
                <User className="w-5 h-5" />
              </Link>
              <button 
                onClick={logout}
                className="flex items-center justify-center p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-colors text-red-400"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link 
                to="/login"
                className="text-slate-400 hover:text-white text-sm font-bold transition-colors"
              >
                {t('auth.login_btn')}
              </Link>
              <Link 
                to="/register"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                {t('auth.register_btn')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
