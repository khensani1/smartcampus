import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  Phone, 
  GraduationCap, 
  BarChart3, 
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Search
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { AssistantChat } from '../chat/AssistantChat';
import { auth } from '../../lib/firebase';
import { signOut } from 'firebase/auth';

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'recommendations', label: 'AI Coach', icon: GraduationCap },
  { id: 'map', label: 'Campus Map', icon: MapIcon },
  { id: 'directory', label: 'Directory', icon: Phone },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export interface ShellProps {
  children: React.ReactNode;
  activeId: string;
  onNavigate: (id: string) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  userProfile: {
    fullName: string;
    surname: string;
    studentNumber: string;
  } | null;
}

export function Shell({ children, activeId, onNavigate, isChatOpen, setIsChatOpen, userProfile }: ShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    signOut(auth);
  };

  const getInitials = () => {
    if (!userProfile) return 'S';
    return `${userProfile.fullName[0]}${userProfile.surname[0]}`.toUpperCase();
  };

  return (
    <div className="flex h-screen bg-slate-50 text-royal font-sans selection:bg-sunflower selection:text-royal">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 260 }}
        className="flex flex-col border-r border-royal/10 bg-white"
      >
        <div className="flex items-center justify-between p-6 h-20 border-bottom border-royal/5">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-bold text-xl tracking-tighter flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-royal rounded flex items-center justify-center">
                <span className="text-white text-xs">T</span>
              </div>
              <span className="text-royal">TUT CSAS</span>
            </motion.div>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-royal/5 rounded transition-colors text-royal"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all group relative",
                activeId === item.id 
                  ? "bg-royal text-white shadow-lg shadow-royal/20" 
                  : "hover:bg-royal/5 text-royal/60 hover:text-royal"
              )}
            >
              <item.icon size={20} className={activeId === item.id ? "text-white" : "group-hover:scale-110 transition-transform"} />
              {!isCollapsed && (
                <span className="font-medium text-sm">{item.label}</span>
              )}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-royal text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-royal/5 space-y-2 text-royal">
          <div className={cn("flex items-center gap-3 p-2 rounded-lg", isCollapsed ? "justify-center" : "")}>
            <div className="w-8 h-8 rounded-full bg-sunflower text-royal flex items-center justify-center font-bold text-xs uppercase shadow-sm">
              {getInitials()}
            </div>
            {!isCollapsed && (
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold truncate text-royal">{userProfile?.fullName || 'Student'} {userProfile?.surname || ''}</p>
                <p className="text-[10px] text-royal/50 truncate font-bold uppercase tracking-widest">S# {userProfile?.studentNumber || '000000000'}</p>
              </div>
            )}
            {!isCollapsed && (
              <button onClick={handleLogout} className="p-1 hover:bg-rose/10 rounded transition-colors text-rose/50 hover:text-rose group">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white border-b border-royal/5 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl bg-slate-50 px-4 py-2 rounded-full border border-royal/5 focus-within:ring-2 focus-within:ring-royal/10 transition-all">
            <Search size={18} className="text-royal/40" />
            <input 
              type="text" 
              placeholder="Search buildings, courses, or info..."
              className="bg-transparent border-none outline-none w-full text-sm placeholder:text-royal/30"
            />
          </div>
          <div className="flex items-center gap-3 ml-4">
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* Floating Chat Button */}
        <motion.button
          onClick={() => setIsChatOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-8 right-8 w-14 h-14 bg-royal text-white rounded-full shadow-2xl flex items-center justify-center z-50 group hover:shadow-royal/20"
        >
          <MessageSquare size={24} />
          <span className="absolute right-full mr-3 px-3 py-1 bg-white text-royal text-xs font-bold rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-royal/5">
            Ask Campus Assistant
          </span>
        </motion.button>

        <AssistantChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </main>
    </div>
  );
}
