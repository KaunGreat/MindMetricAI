
import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';

interface ReactionDistributionChartProps {
  trials: number[];
  average: number;
}

const ReactionDistributionChart: React.FC<ReactionDistributionChartProps> = ({ trials, average }) => {
  const data = trials.map((time, index) => ({
    trial: index + 1,
    time,
    isLapse: time > average * 1.5,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Trial {payload[0].payload.trial}</p>
          <p className="text-lg font-black text-white">{payload[0].value} <span className="text-xs text-slate-500">ms</span></p>
          {payload[0].payload.isLapse && (
            <p className="text-[10px] font-bold text-red-400 mt-1 uppercase tracking-tighter">Attentional Lapse</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis 
            type="number" 
            dataKey="trial" 
            name="Trial" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            domain={[1, trials.length]}
            tickCount={trials.length}
          />
          <YAxis 
            type="number" 
            dataKey="time" 
            name="Time" 
            unit="ms" 
            stroke="#64748b" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
          />
          <ZAxis type="number" range={[100, 100]} />
          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
          
          <ReferenceLine y={average} stroke="#3b82f6" strokeDasharray="3 3" label={{ position: 'right', value: 'Avg', fill: '#3b82f6', fontSize: 10, fontWeight: 'bold' }} />
          
          <Scatter name="Reaction Times" data={data}>
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.isLapse ? '#ef4444' : '#3b82f6'} 
                className="filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ReactionDistributionChart;
