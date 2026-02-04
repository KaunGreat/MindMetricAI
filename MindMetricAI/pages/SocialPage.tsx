
import React, { useState, useMemo } from 'react';
import { 
  Trophy, 
  Medal, 
  Users, 
  Share2, 
  Crown, 
  Zap, 
  Brain, 
  Target, 
  CheckCircle2, 
  Lock, 
  Copy,
  User as UserIcon
} from 'lucide-react';
import { useUserData } from '../hooks/useUserData.ts';
import { TestType } from '../types.ts';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  color: string;
}

const SocialPage: React.FC = () => {
  const { results } = useUserData();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');
  const [showToast, setShowToast] = useState(false);

  // Mock Leaderboard Data
  const leaderboard = [
    { rank: 1, name: 'NeuroMaster', score: 3120, avatar: 'NM', isMe: false },
    { rank: 2, name: 'Brainiac99', score: 2980, avatar: 'B9', isMe: false },
    { rank: 3, name: 'SynapsePro', score: 2850, avatar: 'SP', isMe: false },
    { rank: 4, name: 'You (Strategist)', score: 2450, avatar: 'ME', isMe: true },
    { rank: 5, name: 'Cognito', score: 2100, avatar: 'CO', isMe: false },
    { rank: 6, name: 'NeuralNomad', score: 1950, avatar: 'NN', isMe: false },
  ];

  // Achievement Logic
  const badges: Badge[] = useMemo(() => {
    const reactionResults = results.filter(r => r.type === TestType.REACTION);
    const bestReaction = reactionResults.length > 0 ? Math.min(...reactionResults.map(r => r.score)) : null;
    
    const memoryResults = results.filter(r => r.type === TestType.MEMORY);
    const bestMemory = memoryResults.length > 0 ? Math.max(...memoryResults.map(r => r.score)) : null;

    const stroopResults = results.filter(r => r.type === TestType.STROOP);
    const bestStroop = stroopResults.length > 0 ? Math.min(...stroopResults.map(r => r.score)) : null;

    return [
      {
        id: 'speed-demon',
        title: 'Speed Demon',
        description: 'Reaction time < 200ms',
        icon: <Zap className="w-6 h-6" />,
        isUnlocked: bestReaction !== null && bestReaction < 200,
        color: 'text-yellow-400 bg-yellow-400/10'
      },
      {
        id: 'memory-king',
        title: 'Memory King',
        description: 'Spatial Span level > 8',
        icon: <Brain className="w-6 h-6" />,
        isUnlocked: bestMemory !== null && bestMemory > 8,
        color: 'text-purple-400 bg-purple-400/10'
      },
      {
        id: 'focus-guru',
        title: 'Focus Guru',
        description: 'Stroop avg < 600ms',
        icon: <Target className="w-6 h-6" />,
        isUnlocked: bestStroop !== null && bestStroop < 600,
        color: 'text-emerald-400 bg-emerald-400/10'
      },
      {
        id: 'daily-warrior',
        title: 'Daily Warrior',
        description: 'First test completed',
        icon: <CheckCircle2 className="w-6 h-6" />,
        isUnlocked: results.length > 0,
        color: 'text-blue-400 bg-blue-400/10'
      },
      {
        id: 'marathoner',
        title: 'Marathoner',
        description: '10+ sessions logged',
        icon: <Medal className="w-6 h-6" />,
        isUnlocked: results.length >= 10,
        color: 'text-pink-400 bg-pink-400/10'
      }
    ];
  }, [results]);

  const copyChallengeLink = () => {
    const dummyUrl = `https://mindmetric.ai/duel/${Math.floor(Math.random() * 100000)}`;
    navigator.clipboard.writeText(dummyUrl);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-purple-400" /> Neural Network
          </h1>
          <p className="text-slate-400">Connect, compete, and climb the cognitive hierarchy.</p>
        </div>
        
        <div className="flex bg-slate-900 p-1 rounded-2xl border border-slate-800">
          <button 
            onClick={() => setActiveTab('leaderboard')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'leaderboard' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Leaderboard
          </button>
          <button 
            onClick={() => setActiveTab('achievements')}
            className={`px-6 py-2 text-xs font-black uppercase tracking-widest rounded-xl transition-all ${
              activeTab === 'achievements' ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Achievements
          </button>
        </div>
      </header>

      {activeTab === 'leaderboard' ? (
        <section className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-8 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Crown className="w-6 h-6 text-yellow-500" /> Global Rankings
            </h2>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Season 1: Neuro-Agility</div>
          </div>
          <div className="divide-y divide-slate-800">
            {leaderboard.map((user) => (
              <div 
                key={user.rank} 
                className={`flex items-center gap-6 p-6 transition-colors ${
                  user.isMe ? 'bg-purple-500/10 border-l-4 border-l-purple-500' : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="w-8 text-center font-black text-lg italic text-slate-600">
                  {user.rank === 1 ? <Trophy className="w-6 h-6 text-yellow-500 mx-auto" /> : `#${user.rank}`}
                </div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm border-2 ${
                  user.isMe ? 'bg-purple-600 border-purple-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  {user.avatar}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-white flex items-center gap-2">
                    {user.name}
                    {user.isMe && <span className="text-[10px] bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">You</span>}
                  </div>
                  <div className="text-xs text-slate-500">Active {user.rank % 3 + 1} days ago</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-black text-white tabular-nums">{user.score.toLocaleString()}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MindScore</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in zoom-in duration-500">
          {badges.map((badge) => (
            <div 
              key={badge.id}
              className={`relative p-8 rounded-[2.5rem] border transition-all flex flex-col items-center text-center group ${
                badge.isUnlocked 
                  ? 'bg-slate-900 border-slate-800 shadow-xl' 
                  : 'bg-slate-950 border-slate-900 opacity-60 grayscale'
              }`}
            >
              <div className={`p-5 rounded-3xl mb-6 transition-transform group-hover:scale-110 ${badge.color}`}>
                {badge.isUnlocked ? badge.icon : <Lock className="w-6 h-6 text-slate-700" />}
              </div>
              <h3 className={`text-lg font-bold mb-2 ${badge.isUnlocked ? 'text-white' : 'text-slate-600'}`}>
                {badge.isUnlocked ? badge.title : 'Locked Achievement'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed uppercase font-bold tracking-tight">
                {badge.isUnlocked ? badge.description : 'Analyze more data to unlock'}
              </p>
              
              {badge.isUnlocked && (
                <div className="absolute top-4 right-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Challenge System */}
      <section className="bg-gradient-to-br from-indigo-900/40 via-purple-900/20 to-slate-900 border border-purple-500/20 rounded-[2.5rem] p-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 space-y-6 text-center lg:text-left">
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2 italic">Neural Duel</h2>
              <p className="text-slate-400 leading-relaxed max-w-md">
                Challenge your network to beat your current Personal Best. Generate a secure uplink and compare synaptic efficiency.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={copyChallengeLink}
                className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-purple-600/40 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <Copy className="w-4 h-4" /> Copy Challenge Link
              </button>
              <button className="px-8 py-4 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all flex items-center justify-center gap-3">
                <Share2 className="w-4 h-4" /> Share to Network
              </button>
            </div>
          </div>
          
          <div className="w-full max-w-sm">
            <div className="bg-slate-950/80 backdrop-blur-md border border-slate-800 p-8 rounded-[2rem] shadow-2xl ring-1 ring-purple-500/20">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-slate-900 rounded-2xl border border-slate-800 text-purple-400">
                  <UserIcon className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Active Profile</div>
                  <div className="text-lg font-bold text-white tracking-tight">Strategist Alpha</div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                  <span className="text-xs font-bold text-slate-500 uppercase">MindScore</span>
                  <span className="text-2xl font-black text-white italic">2,450</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50">
                  <span className="text-xs font-bold text-slate-500 uppercase">Global Rank</span>
                  <span className="text-2xl font-black text-purple-400 italic">#4</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-bottom-5">
          <div className="bg-emerald-500 text-slate-950 px-6 py-3 rounded-full font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 flex items-center gap-3">
            <CheckCircle2 className="w-4 h-4" /> Challenge Link Copied!
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialPage;
