import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { DEPARTMENTS } from '../../constants';
import { Search, Sparkles, Loader2, Navigation as NavigationIcon } from 'lucide-react';
import { aiService } from '../../services/ai';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY !== '';

interface CampusMapProps {
  prefilledSearch?: string;
}

export function CampusMap({ prefilledSearch }: CampusMapProps) {
  const [searchQuery, setSearchQuery] = useState(prefilledSearch || '');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ destination: string; explanation: string } | null>(null);

  React.useEffect(() => {
    if (prefilledSearch) {
      const runPrefilled = async () => {
        setIsSearching(true);
        try {
          const result = await aiService.getSmartNavigation(prefilledSearch);
          setSearchResult(result);
        } catch (error) {
          console.error("Prefilled search failed", error);
        } finally {
          setIsSearching(false);
        }
      };
      runPrefilled();
    }
  }, [prefilledSearch]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    setSearchResult(null);
    try {
      const result = await aiService.getSmartNavigation(searchQuery);
      setSearchResult(result);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-full bg-white rounded-2xl border border-royal/10 p-12">
        <div className="max-w-xl text-center">
          <div className="w-16 h-16 bg-royal/5 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">🗺️</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4 text-royal">Google Maps API Key Required</h2>
          <p className="text-royal/60 mb-8 leading-relaxed">
            The interactive campus map requires a valid Google Maps Platform API key to function. 
            Follow the steps below to enable navigation and route optimization.
          </p>
          
          <div className="grid gap-6 text-left">
            <div className="bg-slate-50 p-6 rounded-xl border border-royal/5">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-3 text-royal/40">Step 1: Get an API Key</h3>
              <p className="text-sm text-royal/70 mb-4">Visit the Google Cloud Console to create or retrieve your API key.</p>
              <a 
                href="https://console.cloud.google.com/google/maps-apis/start" 
                target="_blank" 
                rel="noopener"
                className="inline-block px-6 py-2 bg-royal text-white text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Go to Cloud Console
              </a>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-royal/5">
              <h3 className="font-bold text-sm uppercase tracking-widest mb-3 text-royal/40">Step 2: Add Secret</h3>
              <ul className="text-sm text-royal/70 space-y-2 list-disc pl-4">
                <li>Open <strong>Settings</strong> (gear icon, top-right)</li>
                <li>Select <strong>Secrets</strong></li>
                <li>Add <code>GOOGLE_MAPS_PLATFORM_KEY</code> as name</li>
                <li>Paste your key as the value</li>
              </ul>
            </div>
          </div>
          
          <p className="mt-8 text-xs text-royal/30 font-bold uppercase tracking-widest">The application will automatically rebuild once the secret is saved.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-2xl overflow-hidden shadow-sm border border-royal/10 relative group">
      {/* Search Bar Overlay */}
      <div className="absolute top-6 left-6 z-10 w-full max-w-sm">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <input 
              type="text" 
              placeholder="e.g. 'Where is Building 10?'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/90 backdrop-blur-md border border-royal/10 rounded-xl px-4 py-3 pl-11 text-sm text-royal focus:outline-none focus:ring-2 focus:ring-royal/20 shadow-xl"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-royal/30" size={16} />
          </div>
          <button 
            type="submit"
            disabled={isSearching}
            className="p-3 bg-royal text-white rounded-xl shadow-xl hover:bg-royal/90 transition-colors disabled:opacity-50"
          >
            {isSearching ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
          </button>
        </form>

        {searchResult && (
          <div className="mt-3 p-4 bg-white/95 backdrop-blur-md border border-royal/10 rounded-xl shadow-2xl animate-in fade-in slide-in-from-top-2">
            <div className="flex items-start gap-3">
              <div className="shrink-0 w-8 h-8 rounded-lg bg-sunflower/20 text-royal flex items-center justify-center">
                <NavigationIcon size={14} />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-royal">AI Destination identified</h4>
                <p className="text-[10px] font-bold text-royal/40 uppercase tracking-widest">{searchResult.destination}</p>
                <p className="text-[11px] text-royal/60 leading-relaxed italic">"{searchResult.explanation}"</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={{ lat: -25.5413, lng: 28.0863 }}
          defaultZoom={16}
          mapId="TUT_SOSH_SOUTH_MAP"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
          disableDefaultUI={false}
          gestureHandling="greedy"
        >
          {DEPARTMENTS.map((dept) => {
            const isHighlighted = searchResult?.destination.toLowerCase().includes(dept.building.toLowerCase()) || 
                              searchResult?.destination.toLowerCase().includes(dept.name.toLowerCase());
            
            return (
              <AdvancedMarker 
                key={dept.id} 
                position={dept.location}
                title={dept.name}
              >
                <Pin 
                  background={isHighlighted ? '#BE123C' : (dept.faculty === 'ICT' ? '#4169E1' : '#FBBF24')} 
                  glyphColor="#fff" 
                  borderColor="#fff"
                  scale={isHighlighted ? 1.2 : 1}
                />
              </AdvancedMarker>
            );
          })}
        </Map>
      </APIProvider>
      
      {/* Legend Overlay */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-royal/10 shadow-lg pointer-events-none hidden md:block">
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3 text-royal/50">Campus Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-royal" />
            <span className="text-xs font-bold text-royal">Academic Depts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-sunflower" />
            <span className="text-xs font-bold text-royal">Administration</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose" />
            <span className="text-xs font-bold text-royal">Laboratories</span>
          </div>
        </div>
      </div>
    </div>
  );
}
