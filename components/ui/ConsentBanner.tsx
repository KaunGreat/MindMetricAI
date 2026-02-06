
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const ConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mindmetric_consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('mindmetric_consent', type);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[100] md:left-auto md:max-w-md"
        >
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 rounded-[2.5rem] shadow-2xl ring-1 ring-white/10">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-bold text-lg mb-1">Neural Privacy</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  We analyze cognitive data to provide personalized insights. By continuing, you agree to our 
                  <Link to="/privacy" className="text-blue-400 hover:underline mx-1">Privacy Policy</Link> 
                  and 
                  <Link to="/terms" className="text-blue-400 hover:underline mx-1">Terms</Link>.
                </p>
              </div>
              <button onClick={() => setIsVisible(false)} className="text-slate-500 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleAccept('all')}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl transition-all shadow-lg shadow-blue-600/20"
              >
                Accept All
              </button>
              <button 
                onClick={() => handleAccept('essential')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-black uppercase tracking-widest text-[10px] rounded-xl transition-all"
              >
                Essential Only
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConsentBanner;
