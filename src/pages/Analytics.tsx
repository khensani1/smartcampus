import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { BarChart3, TrendingUp, Users, MapPin, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const searchData = [
  { name: 'Computer Science', count: 450 },
  { name: 'Accounting', count: 320 },
  { name: 'Civil Engineering', count: 280 },
  { name: 'Law', count: 210 },
  { name: 'Architecture', count: 180 },
];

const navigationHotspots = [
  { name: 'Science Labs', value: 400 },
  { name: 'Main Library', value: 300 },
  { name: 'Student Hub', value: 250 },
  { name: 'Wits Junction', value: 200 },
];

const userGrowth = [
  { date: 'Mon', users: 120 },
  { date: 'Tue', users: 210 },
  { date: 'Wed', users: 450 },
  { date: 'Thu', users: 380 },
  { date: 'Fri', users: 510 },
  { date: 'Sat', users: 150 },
  { date: 'Sun', users: 180 },
];

const COLORS = ['#4169E1', '#FBBF24', '#BE123C', '#E2E8F0'];

export function Analytics() {
  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-royal text-white rounded-2xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-royal">System Reporting & Analytics</h1>
          <p className="text-royal/50 leading-relaxed">
            Real-time insights for university administrators to monitor campus engagement and academic trends.
          </p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-white border border-royal/10 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors text-royal">
          <Download size={16} /> Export CSV
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Most Requested Courses */}
        <div className="bg-white p-8 rounded-3xl border border-royal/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <TrendingUp size={18} className="text-sunflower" />
             <h3 className="font-bold tracking-tight text-royal">Most Requested Courses</h3>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={searchData} layout="vertical" margin={{ left: 40 }}>
                   <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(65, 105, 225, 0.05)" />
                   <XAxis type="number" hide />
                   <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#4169E1' }} width={120} />
                   <Tooltip 
                     contentStyle={{ borderRadius: '12px', border: '1px solid rgba(65, 105, 225, 0.05)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                     labelStyle={{ fontWeight: 'bold', color: '#4169E1' }}
                   />
                   <Bar dataKey="count" fill="#4169E1" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* User Adoption Trends */}
        <div className="bg-white p-8 rounded-3xl border border-royal/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <Users size={18} className="text-sunflower" />
             <h3 className="font-bold tracking-tight text-royal">Daily Active Users</h3>
          </div>
          <div className="h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={userGrowth}>
                   <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#4169E1" stopOpacity={0.1}/>
                         <stop offset="95%" stopColor="#4169E1" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(65, 105, 225, 0.05)" />
                   <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#4169E160' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 600, fill: '#4169E160' }} />
                   <Tooltip />
                   <Area type="monotone" dataKey="users" stroke="#4169E1" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Navigation Hotspots */}
        <div className="bg-white p-8 rounded-3xl border border-royal/5 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
             <MapPin size={18} className="text-sunflower" />
             <h3 className="font-bold tracking-tight text-royal">Campus Navigation Hotspots</h3>
          </div>
          <div className="flex items-center justify-center h-[300px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                   <Pie
                      data={navigationHotspots}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                   >
                      {navigationHotspots.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                   </Pie>
                   <Tooltip />
                </PieChart>
             </ResponsiveContainer>
             <div className="flex flex-col gap-4 pr-12 min-w-[150px]">
                {navigationHotspots.map((entry, index) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-royal/40">{entry.name}</span>
                      <span className="text-xs font-bold text-royal">{entry.value} visits</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </div>

         {/* Adoption metrics card */}
         <div className="bg-royal text-white p-8 rounded-3xl flex flex-col justify-between shadow-lg shadow-royal/20">
            <div>
               <h3 className="text-2xl font-bold tracking-tight mb-2">CSAS Adoption Index</h3>
               <p className="text-white/50 text-sm mb-8">System performance and student satisfaction rating.</p>
               <div className="space-y-6">
                  {[
                    { label: 'Overall Engagement', value: '84%', color: 'bg-green-400' },
                    { label: 'AI Accuracy', value: '92%', color: 'bg-sunflower' },
                    { label: 'Safety Rating', value: '78%', color: 'bg-blue-300' },
                  ].map(stat => (
                    <div key={stat.label} className="space-y-2">
                       <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <span>{stat.label}</span>
                          <span>{stat.value}</span>
                       </div>
                       <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: stat.value }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className={cn("h-full", stat.color)} 
                          />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
            <div className="pt-8 border-t border-white/10 flex justify-between items-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Last Updated Today, 11:22</span>
               <button className="text-[10px] font-bold uppercase tracking-widest bg-white/10 px-3 py-2 rounded hover:bg-white/20 transition-colors">Generate Report</button>
            </div>
         </div>
      </div>
    </div>
  );
}
