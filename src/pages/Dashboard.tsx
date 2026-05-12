import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  MapPin, 
  GraduationCap, 
  ArrowUpRight,
  Clock,
  Calendar,
  Map as MapIcon,
  MessageSquare,
  Sparkles,
  Info,
  AlertCircle,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, onSnapshot, query, orderBy, limit, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firebase-errors';
import { aiService } from '../services/ai';

const stats = [
  { label: 'Total Enrolments', value: '4,285', icon: GraduationCap, trend: '+12%' },
  { label: 'Daily Navigation Queries', value: '1,102', icon: MapPin, trend: '+24%' },
  { label: 'AI Recommendations', value: '856', icon: TrendingUp, trend: '+8%' },
  { label: 'Departmental Contacts', value: '142', icon: Users, trend: '0%' },
];

interface DashboardProps {
  onStartChat: () => void;
  onOpenMap: () => void;
  userProfile: any;
}

interface CampusInsight {
  id?: string;
  title: string;
  content: string;
  type: 'News' | 'Tip' | 'Deadline';
}

export function Dashboard({ onStartChat, onOpenMap, userProfile }: DashboardProps) {
  const [insights, setInsights] = useState<CampusInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'insights'), orderBy('createdAt', 'desc'), limit(3));
    
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      if (snapshot.empty) {
        // Only if empty, try to seed with AI
        try {
          const freshInsights = await aiService.getCampusInsights();
          for (const insight of freshInsights) {
            try {
              await addDoc(collection(db, 'insights'), {
                ...insight,
                createdAt: serverTimestamp()
              });
            } catch (aErr) {
              handleFirestoreError(aErr, OperationType.WRITE, 'insights');
            }
          }
        } catch (e) {
          console.error("AI Insight seeding failed", e);
        }
      } else {
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CampusInsight));
        setInsights(data);
        setLoadingInsights(false);
      }
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'insights');
    });

    return () => unsubscribe();
  }, []);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'News': return <Info size={16} className="text-royal" />;
      case 'Deadline': return <AlertCircle size={16} className="text-rose" />;
      case 'Tip': return <Lightbulb size={16} className="text-sunflower" />;
      default: return <Sparkles size={16} />;
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-royal">Welcome, {userProfile?.fullName || 'Student'}</h1>
          <p className="text-royal/50">Your Soshanguve South Campus advisor is ready to help.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-royal/5 border border-royal/10 rounded-xl">
          <Sparkles size={14} className="text-sunflower animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-royal/60">System Online</span>
        </div>
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
        <div className="lg:col-span-2 space-y-8">
          {/* AI Campus Pulse */}
          <div className="bg-white rounded-3xl border border-royal/5 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-royal/5 flex items-center justify-center text-royal">
                <Sparkles size={18} />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-royal">AI Campus Pulse</h2>
                <p className="text-[10px] text-royal/40 font-bold uppercase tracking-widest">Real-time Sosh South Updates</p>
              </div>
            </div>

            {loadingInsights ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="animate-spin text-royal/20" size={32} />
                <p className="text-xs text-royal/40 font-medium">Analyzing campus data...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimatePresence>
                  {insights.map((insight, i) => (
                    <motion.div
                      key={insight.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="p-5 rounded-2xl bg-slate-50 border border-royal/5 hover:border-royal/10 transition-colors cursor-help"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {getInsightIcon(insight.type)}
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-widest",
                          insight.type === 'Deadline' ? "text-rose" : 
                          insight.type === 'Tip' ? "text-sunflower" : "text-royal/60"
                        )}>
                          {insight.type}
                        </span>
                      </div>
                      <h3 className="font-bold text-xs text-royal mb-2 line-clamp-1">{insight.title}</h3>
                      <p className="text-[11px] text-royal/60 leading-relaxed line-clamp-3 font-medium italic">"{insight.content}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-3xl border border-royal/5 shadow-sm p-8">
            <div className="flex justify-between items-center mb-10">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-royal">Recent Activity</h2>
                <p className="text-sm text-royal/40">Your campus engagement over the last 7 days</p>
              </div>
              <button 
                onClick={onOpenMap}
                className="text-xs font-bold uppercase tracking-widest text-royal hover:underline flex items-center gap-1"
              >
                View History <ArrowUpRight size={14} />
              </button>
            </div>

            <div className="space-y-6">
              {[
                { type: 'Navigation', title: 'Route to Building 10', time: '2 hours ago', meta: 'Shortest path used' },
                { type: 'Academic', title: 'ICT Diploma Recommendation', time: '5 hours ago', meta: 'APS Match: 28' },
                { type: 'Directory', title: 'Contacted ICT Faculty', time: 'Yesterday', meta: 'Email sent' },
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
        </div>

        {/* Action Cards */}
        <div className="space-y-6">
          <div 
            onClick={onStartChat}
            className="bg-royal text-white p-8 rounded-3xl relative overflow-hidden group cursor-pointer h-full max-h-[220px] shadow-lg shadow-royal/20"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-white">Need Help?</h3>
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

          <div 
            onClick={onOpenMap}
            className="bg-sunflower text-royal p-8 rounded-3xl relative overflow-hidden group cursor-pointer h-full max-h-[220px] shadow-lg shadow-sunflower/20"
          >
            <div className="relative z-10">
              <h3 className="text-2xl font-bold tracking-tight mb-2 text-royal">Quick Route</h3>
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

// Helper for cn in case it is needed, usually in utils
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
