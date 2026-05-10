import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Mail, 
  PhoneCall, 
  ChevronRight, 
  Search,
  Filter,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'motion/react';
import { DEPARTMENTS } from '../constants';
import { cn } from '../lib/utils';

export function Directory() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const faculties = useMemo(() => ['All', ...new Set(DEPARTMENTS.map(d => d.faculty))], []);

  const filteredDepts = useMemo(() => {
    return DEPARTMENTS.filter(d => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || 
                           d.building.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = filter === 'All' || d.faculty === filter;
      return matchesSearch && matchesFilter;
    });
  }, [search, filter]);

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="w-12 h-12 bg-royal text-white rounded-2xl flex items-center justify-center">
            <Building2 size={24} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-royal">Department Directory</h1>
          <p className="text-royal/50 max-w-lg leading-relaxed">
            Quickly find contact information and physical locations for all university faculties and administrative offices.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-royal/30 pointer-events-none group-focus-within:text-royal transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search directory..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-royal/10 rounded-2xl text-sm focus:ring-2 focus:ring-royal/10 transition-all outline-none w-full md:w-64 text-royal"
            />
          </div>
          <div className="relative flex items-center bg-white border border-royal/10 rounded-2xl px-4 py-3 group">
            <Filter size={16} className="text-royal/30 mr-2" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-bold uppercase tracking-widest cursor-pointer text-royal"
            >
              {faculties.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid gap-4 text-royal">
         {/* Table Header */}
         <div className="hidden lg:grid grid-cols-[1fr_1.5fr_1fr_0.5fr] px-8 py-4 opacity-30 text-[10px] font-bold uppercase tracking-[0.2em] italic serif">
            <div>Building</div>
            <div>Department Name</div>
            <div>Contacts</div>
            <div className="text-right">Action</div>
         </div>

         {filteredDepts.map((dept, i) => (
           <motion.div
             key={dept.id}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.05 }}
             className="group bg-white rounded-2xl border border-royal/5 hover:border-royal/20 hover:shadow-lg transition-all p-8 flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr_1fr_0.5fr] items-center gap-8 relative overflow-hidden"
           >
              {/* Sidebar color accent */}
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1",
                dept.faculty === 'Science' ? "bg-royal" : "bg-sunflower"
              )} />

              {/* Building Info */}
              <div className="flex items-center gap-4 w-full">
                <div className="shrink-0 w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-royal/20 group-hover:bg-royal group-hover:text-white transition-all">
                  <Building2 size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-royal/40 mb-1">{dept.faculty}</p>
                  <p className="text-sm font-semibold truncate max-w-[140px] text-royal">{dept.building}</p>
                </div>
              </div>

              {/* Dept Name */}
              <div className="w-full">
                <h3 className="text-xl font-bold tracking-tight mb-2 text-royal">{dept.name}</h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose animate-pulse" />
                  <span className="text-[10px] font-bold tracking-widest text-royal/30 uppercase">Operational</span>
                </div>
              </div>

              {/* Contacts */}
              <div className="flex flex-col gap-2 w-full">
                <a href={`mailto:${dept.contactEmail}`} className="flex items-center gap-2 text-xs font-medium text-royal/60 hover:text-royal transition-colors">
                  <Mail size={14} className="opacity-40" /> {dept.contactEmail}
                </a>
                <a href={`tel:${dept.contactPhone}`} className="flex items-center gap-2 text-xs font-medium text-royal/60 hover:text-royal transition-colors">
                  <PhoneCall size={14} className="opacity-40" /> {dept.contactPhone}
                </a>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 w-full">
                 <button className="px-4 py-2 bg-slate-50 text-royal text-[10px] font-bold rounded-lg uppercase tracking-widest hover:bg-sunflower hover:text-royal transition-colors flex items-center gap-2 shadow-sm">
                   Navigate <ArrowUpRight size={14} />
                 </button>
              </div>
           </motion.div>
         ))}

         {filteredDepts.length === 0 && (
           <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-[#141414]/10">
              <p className="text-[#141414]/40 italic serif">No departments found matching your search.</p>
           </div>
         )}
      </div>
    </div>
  );
}
