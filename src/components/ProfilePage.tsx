
import React from 'react';
import { useUserData } from '../hooks/useUserData';
import { Trophy, History, Trash2, Calendar, Brain, Zap, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfilePage = () => {
  const { history, clearHistory } = useUserData();

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'reaction': return <Zap className="w-4 h-4 text-yellow-400" />;
      case 'memory':
      case 'spatial-span': return <Brain className="w-4 h-4 text-purple-400" />;
      case 'stroop': return <Target className="w-4 h-4 text-emerald-400" />;
      default: return <History className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-4xl mx-auto text-white space-y-10 py-20"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">My Profile</h1>
          <p className="text-slate-400 mt-1">Review your neural progression and cognitive benchmarks.</p>
        </div>
        <button 
          onClick={() => {
            if (window.confirm("Are you sure you want to clear your entire history?")) {
              clearHistory();
            }
          }} 
          className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl transition-colors text-sm font-bold"
        >
          <Trash2 className="w-4 h-4" /> Reset History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
              <History className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Total Tests</div>
          </div>
          <div className="text-5xl font-black text-white italic">{history.length}</div>
        </div>
        
        <div className="p-8 bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 blur-3xl rounded-full" />
          <div className="flex items-center gap-4 mb-2">
            <div className="p-3 bg-emerald-500/10 rounded-2xl">
              <Calendar className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-slate-400 text-sm font-bold uppercase tracking-widest">Latest Activity</div>
          </div>
          <div className="text-3xl font-black text-white italic">
            {history.length > 0 ? new Date(history[0].date).toLocaleDateString() : '-'}
          </div>
          <p className="text-slate-500 text-xs mt-1 uppercase font-bold tracking-tighter">
            {history.length > 0 ? new Date(history[0].date).toLocaleTimeString() : 'No activity logged'}
          </p>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Recent Activity</h2>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Session Log v2.0</div>
        </div>
        
        {history.length === 0 ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-600">
              <History className="w-8 h-8" />
            </div>
            <p className="text-slate-500 font-medium italic">"The journey of a thousand minds begins with a single test."</p>
            <p className="text-slate-600 text-sm">No tests completed yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/50">
            {history.map((item) => (
              <div key={item.id} className="p-6 flex justify-between items-center hover:bg-slate-800/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-slate-700 transition-colors">
                    {getIconForType(item.type)}
                  </div>
                  <div>
                    <div className="font-black text-white capitalize text-lg tracking-tight">{item.type.replace('-', ' ')}</div>
                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
                      <Calendar className="w-3 h-3" />
                      {new Date(item.date).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-emerald-400 font-black text-2xl italic tracking-tighter">
                    {typeof item.score === 'object' ? JSON.stringify(item.score) : item.score}
                    <span className="text-[10px] text-slate-500 ml-1 uppercase not-italic font-bold tracking-widest">
                      {item.type === 'reaction' ? 'ms' : 'pts'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
