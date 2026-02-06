
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 blur-[80px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-600/20 blur-[80px] rounded-full" />

        <div className="flex flex-col items-center mb-8 relative">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20 mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">{t('auth.login_title')}</h1>
          <p className="text-slate-400 text-sm mt-2">{t('auth.login_subtitle')}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                required
                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-blue-500/10"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.login_btn')}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500 relative">
          {t('auth.no_account')}{' '}
          <Link to="/register" className="text-blue-400 font-bold hover:underline underline-offset-4">
            {t('auth.register_link')}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
