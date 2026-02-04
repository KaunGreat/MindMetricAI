
import React from 'react';
import { Shield, Lock, Eye, Server, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-20 space-y-12"
    >
      <header className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto border border-blue-500/20">
          <Shield className="w-8 h-8 text-blue-500" />
        </div>
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Privacy Policy</h1>
        <p className="text-slate-400 text-lg">How we protect and manage your neural data.</p>
      </header>

      <section className="prose prose-invert prose-slate max-w-none space-y-8 text-slate-300">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Lock className="w-6 h-6 text-emerald-400" /> 1. Data Collection
          </h2>
          <p>
            MindMetricAI collects data strictly necessary for cognitive performance tracking. This includes:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Assessment Results:</strong> Millisecond-precision reaction times, accuracy rates, and cognitive spans.</li>
            <li><strong>Wellness Logs:</strong> Sleep quality, stress levels, and subjective mental states provided by you.</li>
            <li><strong>Neural Profile:</strong> AI-generated insights and performance trends derived from your usage history.</li>
          </ul>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Eye className="w-6 h-6 text-blue-400" /> 2. AI Processing
          </h2>
          <p>
            Your data is processed by our Neural Insight Engine (powered by Google Gemini API). 
            This data is used to generate personalized coaching advice and performance windows. 
            <strong>We do not use your assessment data to train third-party LLMs.</strong>
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Server className="w-6 h-6 text-purple-400" /> 3. Data Storage & Security
          </h2>
          <p>
            All data is encrypted using 256-bit AES standards. Data is stored on secure servers with strict access controls. 
            We comply with GDPR and relevant regional data protection laws (e.g., 152-FZ) to ensure your "Right to be Forgotten."
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <UserCheck className="w-6 h-6 text-yellow-400" /> 4. Your Rights
          </h2>
          <p>
            You maintain full ownership of your data. You may:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request a full export of your cognitive history in JSON format.</li>
            <li>Delete your entire profile and historical data via the Profile settings.</li>
            <li>Opt-out of optional analytical tracking at any time.</li>
          </ul>
        </div>
      </section>

      <footer className="text-center text-slate-500 text-sm">
        Last Updated: October 2023. For inquiries, contact privacy@mindmetric.ai
      </footer>
    </motion.div>
  );
};

export default PrivacyPolicy;
