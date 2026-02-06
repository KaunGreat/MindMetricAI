
import React, { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: ReactNode;
  trend?: {
    value: number;
    isGood: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ label, value, unit, icon, trend }) => {
  return (
    <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-lg hover:border-slate-700 transition-all group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-slate-950 rounded-lg text-slate-400 group-hover:text-blue-400 transition-colors">
          {icon}
        </div>
        {trend && (
          <div className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend.isGood ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </div>
        )}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-white">{value}</span>
          {unit && <span className="text-xs font-bold text-slate-500 uppercase">{unit}</span>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;
