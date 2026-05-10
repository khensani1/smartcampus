import React from 'react';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  GraduationCap, 
  ArrowUpRight,
  Clock,
  Calendar,
  Map as MapIcon,
  MessageSquare
} from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Total Enrolments', value: '4,285', icon: GraduationCap, trend: '+12%' },
  { label: 'Daily Navigation Queries', value: '1,102', icon: MapPin, trend: '+24%' },
  { label: 'AI Recommendations', value: '856', icon: TrendingUp, trend: '+8%' },
  { label: 'Departmental Contacts', value: '142', icon: Users, trend: '0%' },
];

export function Dashboard() {
  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-royal">Welcome, Jane</h1>
        <p className="text-royal/50">Your personal campus advisor is ready to help.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-royal/5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-royal group-hover:text-white transition-colors text-royal">
                <stat.icon size={20} />
              </div>
              <span className="text-xs font-bold text-rose bg-rose/5 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <p className="text-sm font-medium text-royal/50 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold tracking-tight text-royal">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Hotspots */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-royal/5 shadow-sm p-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-royal">Recent Activity</h2>
              <p className="text-sm text-royal/40">Your campus engagement over the last 7 days</p>
            </div>
            <button className="text-xs font-bold uppercase tracking-widest text-royal hover:underline flex items-center gap-1">
              View History <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="space-y-6">
            {[
              { type: 'Navigation', title: 'Route to Mathematical Sciences', time: '2 hours ago', meta: 'Shortest path used' },
              { type: 'Academic', title: 'BSc CS Recommendation', time: '5 hours ago', meta: 'APS Match: 34' },
              { type: 'Directory', title: 'Contacted Science Faculty', time: 'Yesterday', meta: 'Email sent' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-6 items-start group">
                <div className="shrink-0 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center font-bold text-xs text-royal/20 group-hover:bg-sunflower group-hover:text-royal transition-all">
                  {i + 1}
                </div>
                <div className="flex-1 pb-6 border-b border-royal/5">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm tracking-tight text-royal">{activity.title}</h3>
                    <span className="text-[10px] text-royal/40 font-mono uppercase">{activity.time}</span>
                  </div>
                  <p className="text-xs text-royal/40 italic serif">{activity.meta}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          <div className="bg-royal text-white p-8 rounded-3xl relative overflow-hidden group cursor-pointer h-full max-h-[220px] shadow-lg shadow-royal/20">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Need Help?</h3>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">Ask our AI coach about courses, campus layout, or admin queries.</p>
              <button className="px-6 py-2 bg-white text-royal text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors">
                Start Chat
              </button>
            </div>
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 20 }}
              className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity"
            >
              <MessageSquare size={160} />
            </motion.div>
          </div>

          <div className="bg-sunflower text-royal p-8 rounded-3xl relative overflow-hidden group cursor-pointer h-full max-h-[220px] shadow-lg shadow-sunflower/20">
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2">Quick Route</h3>
              <p className="text-royal/60 text-sm mb-6 leading-relaxed">Find your next lecture building with turn-by-turn guidance.</p>
              <button className="px-6 py-2 bg-royal text-white text-sm font-bold rounded-xl hover:bg-royal/90 transition-colors">
                Open Map
              </button>
            </div>
            <motion.div 
               animate={{ scale: [1, 1.1, 1] }}
               transition={{ repeat: Infinity, duration: 15 }}
              className="absolute -right-8 -bottom-8 opacity-10 group-hover:opacity-20 transition-opacity"
            >
              <MapIcon size={160} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
