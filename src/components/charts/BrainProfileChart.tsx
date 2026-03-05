
import React from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { DomainScore } from '../../utils/analytics';

interface BrainProfileChartProps {
  data: DomainScore[];
}

const BrainProfileChart: React.FC<BrainProfileChartProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] flex items-center justify-center animate-in zoom-in duration-1000">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em' }} 
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={false} 
            axisLine={false} 
          />
          <Radar
            name="Cognitive Profile"
            dataKey="score"
            stroke="#3b82f6"
            strokeWidth={3}
            fill="#3b82f6"
            fillOpacity={0.3}
            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
          {/* Decorative Glow Radar */}
          <Radar
            dataKey="score"
            stroke="none"
            fill="#60a5fa"
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BrainProfileChart;
