
import React from 'react';
import { AlertTriangle, FileText, Scale, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const TermsOfService: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20 space-y-12"
    >
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8 text-slate-400" />
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Terms of Service</h1>
        <p className="text-slate-400 text-lg">Rules and guidelines for using the MindMetricAI platform.</p>
      </header>

      {/* Critical Medical Disclaimer */}
      <section className="bg-red-500/10 border border-red-500/30 p-10 rounded-[3rem] relative overflow-hidden">
        <AlertTriangle className="absolute -bottom-4 -right-4 w-32 h-32 text-red-500/10" />
        <div className="relative z-10 space-y-4">
          <h2 className="text-2xl font-black text-red-500 uppercase tracking-widest flex items-center gap-3">
            <AlertTriangle className="w-6 h-6" /> Medical Disclaimer
          </h2>
          <p className="text-red-200/80 leading-relaxed font-bold">
            MINDMETRICAI IS NOT A MEDICAL DIAGNOSTIC TOOL. The cognitive assessments provided are for informational, 
            educational, and self-optimization purposes only. They are not intended to diagnose, treat, or prevent 
            neurological conditions, including but not limited to ADHD, dementia, or concussion. 
            Consult a medical professional for clinical evaluations.
          </p>
        </div>
      </section>

      <section className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Scale className="w-6 h-6 text-blue-400" /> 1. Acceptance of Terms
          </h2>
          <p>
            By accessing MindMetricAI, you agree to be bound by these terms. If you do not agree to any part of these terms, 
            you must not use our services.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Zap className="w-6 h-6 text-yellow-400" /> 2. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate information when creating an account.</li>
            <li>You are responsible for maintaining the confidentiality of your credentials.</li>
            <li>You agree not to use automated scripts (bots) to manipulate test results.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white">3. Limitation of Liability</h2>
          <p>
            MindMetricAI shall not be liable for any indirect, incidental, or consequential damages resulting from the use 
            or inability to use the platform. Our "MindScore" and "Archetypes" are algorithmic interpretations and should 
            not be used for critical decision-making.
          </p>
        </div>
      </section>
    </motion.div>
  );
};

export default TermsOfService;
