
import React, { useState, useEffect } from 'react';
import { analyzeCognitivePerformance } from '../services/geminiService.ts';
import { TestResult, CognitiveInsight } from '../types.ts';
import { Sparkles, Brain, Zap, Target, Loader2, History } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';

const Insights: React.FC<{ results: TestResult[] }> = ({ results }) => {
  const [insights, setInsights] = useState<CognitiveInsight[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      if (results.length < 2) return;
      setLoading(true);
      try {
        const aiInsights = await analyzeCognitivePerformance(results);
        setInsights(aiInsights);
      } catch (e) {
        console.error("Insights load failure", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, [results]);

  const chartData = results
    .slice(-10)
    .map(r => ({
      score: r.score,
      date: new Date(r.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-blue-400" /> Cognitive Intelligence
          </h1>
          <p className="text-slate-400 mt-2">Deep analysis of your mental performance metrics.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-900 px-4 py-2 rounded-full border border-slate-800">
          <History className="w-4 h-4" /> Last 10 sessions recorded
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl">
          <h3 className="text-lg font-bold mb-6 text-slate-300">Performance Trend</h3>
          <div className="h-[300px] w-full">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#60a5fa' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl">
                Perform more tests to see trends
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" /> Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Average</div>
                <div className="text-2xl font-black text-white">
                  {results.length > 0 ? Math.round(results.reduce((acc, r) => acc + r.score, 0) / results.length) : '-'}
                  <span className="text-sm font-normal text-slate-500 ml-1">ms</span>
                </div>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Best</div>
                <div className="text-2xl font-black text-emerald-400">
                  {results.length > 0 ? Math.min(...results.map(r => r.score)) : '-'}
                  <span className="text-sm font-normal text-slate-500 ml-1">ms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-emerald-400" /> AI Insights
          </h2>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-blue-500" />}
        </div>

        {results.length < 2 ? (
          <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
            <p className="text-slate-400 italic">"Complete at least two tests to unlock personalized AI cognitive mapping."</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-2 mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                    insight.category === 'Agility' ? 'bg-emerald-500/10 text-emerald-400' :
                    insight.category === 'Memory' ? 'bg-purple-500/10 text-purple-400' :
                    'bg-blue-500/10 text-blue-400'
                  }`}>
                    {insight.category}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-2">{insight.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{insight.description}</p>
                <div className="pt-4 border-t border-slate-800">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2">Recommendation</p>
                  <p className="text-blue-400 text-sm font-medium">{insight.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Insights;
