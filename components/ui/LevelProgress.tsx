
import React, { useMemo } from 'react';
import { getXPForLevel, getLevelTitle } from '../../hooks/useUserData';
import { Sparkles } from 'lucide-react';

interface LevelProgressProps {
  xp: number;
  level: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({ xp, level }) => {
  const { currentLevelXP, nextLevelXP, progress } = useMemo(() => {
    const startXP = getXPForLevel(level);
    const endXP = getXPForLevel(level + 1);
    const currentProgress = ((xp - startXP) / (endXP - startXP)) * 100;
    
    return {
      currentLevelXP: xp - startXP,
      nextLevelXP: endXP - startXP,
      progress: Math.min(100, Math.max(0, currentProgress))
    };
  }, [xp, level]);

  const title = getLevelTitle(level);

  return (
    <div className="flex flex-col gap-1 min-w-[140px] md:min-w-[200px] animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest mb-0.5">
        <div className="flex items-center gap-1 text-blue-400">
          <Sparkles className="w-3 h-3" />
          <span>Lvl {level}: {title}</span>
        </div>
        <span className="text-slate-500">{currentLevelXP} / {nextLevelXP} XP</span>
      </div>
      
      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-800/50">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default LevelProgress;
