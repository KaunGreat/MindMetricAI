
import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Shield, Star, Crown, ArrowRight } from 'lucide-react';

const PricingPage: React.FC = () => {
  const tiers = [
    {
      name: "Basic",
      price: "$0",
      desc: "Essential cognitive tracking for the casual learner.",
      icon: <Shield className="w-6 h-6 text-slate-400" />,
      features: ["Reaction Time test", "Spatial Span test", "Local result history", "Basic dashboard"],
      btnText: "Get Started",
      recommended: false
    },
    {
      name: "Plus",
      price: "$12",
      period: "/month",
      desc: "Full cognitive battery for the high-performance strategist.",
      icon: <Star className="w-6 h-6 text-blue-400" />,
      features: ["All tests unlocked", "AI Coach (GPT-4o)", "Detailed post-test analytics", "Wellness modules", "Cloud synchronization"],
      btnText: "Start Trial",
      recommended: true
    },
    {
      name: "Pro",
      price: "$29",
      period: "/month",
      desc: "Custom neural mapping for elite teams and research.",
      icon: <Crown className="w-6 h-6 text-yellow-400" />,
      features: ["Personalized AI training", "Raw data export (JSON/CSV)", "Advanced social league", "Priority feature access", "24/7 neuro-expert support"],
      btnText: "Go Pro",
      recommended: false
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-20 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white uppercase tracking-tighter">Choose Your Velocity</h1>
        <p className="text-slate-400 max-w-xl mx-auto text-lg">Invest in your cognitive longevity. Select the plan that matches your training frequency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier, i) => (
          <div 
            key={i} 
            className={`
              relative p-10 rounded-[3rem] border transition-all flex flex-col
              ${tier.recommended ? 'bg-slate-900 border-blue-500/50 shadow-2xl shadow-blue-600/10 scale-105 z-10' : 'bg-slate-950 border-slate-800'}
            `}
          >
            {tier.recommended && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white font-black uppercase text-[10px] tracking-widest rounded-full shadow-lg">
                Recommended
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-8">
              <div className={`p-3 rounded-2xl ${tier.recommended ? 'bg-blue-600/20' : 'bg-slate-900'}`}>
                {tier.icon}
              </div>
              <h3 className="text-xl font-bold text-white">{tier.name}</h3>
            </div>

            <div className="mb-6">
              <span className="text-5xl font-black text-white">{tier.price}</span>
              {tier.period && <span className="text-slate-500 font-bold ml-1">{tier.period}</span>}
            </div>
            
            <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
              {tier.desc}
            </p>

            <ul className="space-y-4 mb-10 flex-1">
              {tier.features.map((f, j) => (
                <li key={j} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                  <Check className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <Link 
              to="/register" 
              className={`
                w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2
                ${tier.recommended ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/20' : 'bg-slate-900 hover:bg-slate-800 text-slate-300'}
              `}
            >
              {tier.btnText} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="text-center">
        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
          All plans include 256-bit AES neural data encryption. No hidden fees. Cancel anytime.
        </p>
      </div>
    </div>
  );
};

export default PricingPage;
