
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Target, TrendingUp, Zap, Clock } from 'lucide-react';

const data = [
  { name: 'Mon', focus: 120, distractions: 45 },
  { name: 'Tue', focus: 180, distractions: 30 },
  { name: 'Wed', focus: 150, distractions: 60 },
  { name: 'Thu', focus: 210, distractions: 20 },
  { name: 'Fri', focus: 240, distractions: 15 },
  { name: 'Sat', focus: 90, distractions: 80 },
  { name: 'Sun', focus: 45, distractions: 120 },
];

const Stats: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <header>
        <h2 className="text-3xl font-bold text-white mb-2">Focus Intelligence</h2>
        <p className="text-slate-400 tracking-tight">Real-time breakdown of your productivity patterns.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         <StatCard icon={<Clock className="text-indigo-400" />} label="Avg. Deep Work" value="3.5h" delta="+12%" />
         <StatCard icon={<Zap className="text-amber-400" />} label="Focus Score" value="84/100" delta="+5%" />
         <StatCard icon={<Target className="text-emerald-400" />} label="Tasks Done" value="28" delta="+8" />
         <StatCard icon={<TrendingUp className="text-sky-400" />} label="Streak" value="5 Days" delta="Best: 12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-6">Focus vs Distraction (Minutes)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }}
                />
                <Area type="monotone" dataKey="focus" stroke="#6366f1" fillOpacity={1} fill="url(#colorFocus)" strokeWidth={3} />
                <Area type="monotone" dataKey="distractions" stroke="#f43f5e" fillOpacity={0.1} fill="#f43f5e" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl">
          <h3 className="text-lg font-bold mb-6">Top Time-Wasting Sites</h3>
          <div className="h-[300px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Instagram', val: 45 },
                  { name: 'YouTube', val: 32 },
                  { name: 'Twitter', val: 28 },
                  { name: 'Reddit', val: 12 },
                ]} layout="vertical">
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={80} />
                   <Tooltip cursor={{fill: 'transparent'}} />
                   <Bar dataKey="val" radius={[0, 8, 8, 0]}>
                      { [0,1,2,3].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#f43f5e' : '#6366f1'} />
                      ))}
                   </Bar>
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, delta }: { icon: React.ReactNode, label: string, value: string, delta: string }) => (
  <div className="glass p-5 rounded-2xl flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <div className="p-2 bg-slate-800 rounded-lg">{icon}</div>
      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full">{delta}</span>
    </div>
    <div>
      <span className="block text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</span>
      <span className="text-2xl font-bold text-white">{value}</span>
    </div>
  </div>
);

export default Stats;
