
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import { useTranslation } from 'react-i18next';
import { BrainCircuit, Mail, Lock, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await register(email, password);
      setIsSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in duration-500">
      <div className="w-full max-w-md p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/20 blur-[80px] rounded-full" />
        
        <div className="flex flex-col items-center mb-8 relative">
          <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-600/20 mb-4">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">{t('auth.register_title')}</h1>
          <p className="text-slate-400 text-sm mt-2">{t('auth.register_subtitle')}</p>
        </div>

        {isSuccess ? (
          <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] text-center space-y-4 animate-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <div className="text-emerald-400 font-bold">{t('auth.register_success')}</div>
            <p className="text-slate-500 text-sm">{t('auth.redirecting')}</p>
          </div>
        ) : (
          <>
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-emerald-500/10"
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
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none transition-all focus:ring-4 focus:ring-emerald-500/10"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : t('auth.register_btn')}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500 relative">
              {t('auth.has_account')}{' '}
              <Link to="/login" className="text-emerald-400 font-bold hover:underline underline-offset-4">
                {t('auth.login_link')}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
