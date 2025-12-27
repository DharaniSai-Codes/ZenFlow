
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Globe, ShieldCheck, Bell, Smartphone, Timer, Search, ShieldAlert, Info, Activity, CheckCircle2, XCircle } from 'lucide-react';

declare const chrome: any;

const POPULAR_DISTRACTIONS = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'youtube.com',
  'reddit.com',
  'tiktok.com',
  'netflix.com',
  'linkedin.com',
  'pinterest.com',
  'twitch.tv',
  'discord.com',
  'quora.com',
  'tumblr.com'
];

const SettingsView: React.FC = () => {
  const [newSite, setNewSite] = useState('');
  const [sites, setSites] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [adBlockEnabled, setAdBlockEnabled] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    chromeApi: false,
    storage: false,
    aiReady: !!process.env.API_KEY && process.env.API_KEY !== 'undefined'
  });
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Perform Health Check
    const hasChrome = typeof chrome !== 'undefined';
    const hasStorage = hasChrome && !!chrome.storage;
    setSystemStatus(prev => ({ ...prev, chromeApi: hasChrome, storage: hasStorage }));

    if (hasStorage) {
      chrome.storage.local.get(['blockedSites', 'adBlockEnabled'], (result: any) => {
        if (result.blockedSites) setSites(result.blockedSites);
        if (result.adBlockEnabled !== undefined) setAdBlockEnabled(result.adBlockEnabled);
      });
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const saveToStorage = (updatedSites: string[]) => {
    setSites(updatedSites);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ blockedSites: updatedSites });
    }
  };

  const toggleAdBlock = () => {
    const newState = !adBlockEnabled;
    setAdBlockEnabled(newState);
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.set({ adBlockEnabled: newState });
    }
  };

  const addSite = (siteToAdd?: string) => {
    const rawInput = (siteToAdd || newSite).trim();
    if (!rawInput) return;

    let cleanUrl = rawInput.toLowerCase()
      .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
      .split('/')[0];
    
    if (cleanUrl && !cleanUrl.includes('.')) {
      const match = POPULAR_DISTRACTIONS.find(d => d.startsWith(cleanUrl));
      cleanUrl = match || `${cleanUrl}.com`;
    }

    if (cleanUrl && !sites.includes(cleanUrl)) {
      saveToStorage([...sites, cleanUrl]);
      setNewSite('');
      setShowSuggestions(false);
    }
  };

  const removeSite = (site: string) => {
    saveToStorage(sites.filter(s => s !== site));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Blocking Protocols</h2>
          <p className="text-slate-400">Configure how strictly ZenFlow handles distractions.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 rounded-xl border border-indigo-500/20">
          <Activity size={16} className="text-indigo-400" />
          <span className="text-xs font-bold text-indigo-200">System Live</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 relative">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Globe className="text-indigo-400" size={20} />
              Blocked Domains
            </h3>
            
            <div className="relative" ref={suggestionRef}>
              <div className="flex gap-2 mb-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    value={newSite}
                    onChange={(e) => setNewSite(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSite()}
                    onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                    placeholder="Enter URL or domain name..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                  />
                </div>
                <button 
                  onClick={() => addSite()}
                  className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                >
                  <Plus size={24} />
                </button>
              </div>

              {showSuggestions && (
                <div className="absolute z-50 w-full mt-1 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => addSite(suggestion)}
                      className="w-full text-left px-4 py-3 hover:bg-indigo-600/20 flex items-center gap-3 text-slate-300 hover:text-white transition-colors border-b border-slate-800 last:border-0"
                    >
                      <img src={`https://www.google.com/s2/favicons?domain=${suggestion}`} className="w-4 h-4 opacity-70" alt="" />
                      <span className="text-sm font-medium">{suggestion}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-2">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Currently Blocked</h4>
              {sites.length === 0 ? (
                <div className="text-center py-10 bg-slate-900/50 rounded-2xl border border-dashed border-slate-700">
                  <p className="text-slate-500 text-sm italic">No sites blocked yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sites.map(site => (
                    <div key={site} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-transparent hover:border-indigo-500/30 transition-all">
                      <div className="flex items-center gap-3 truncate">
                        <img src={`https://www.google.com/s2/favicons?domain=${site}`} className="w-5 h-5 rounded opacity-70" alt="" />
                        <span className="text-slate-200 font-medium text-sm truncate">{site}</span>
                      </div>
                      <button onClick={() => removeSite(site)} className="p-1.5 text-slate-500 hover:text-rose-500 transition-colors bg-slate-900 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-indigo-400" size={20} />
              Ad Suppression Protocol
            </h3>
            <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-bold text-white">Universal Ad Blocking</p>
                  <p className="text-xs text-slate-400 max-w-xs">Blocks 10,000+ common tracking and ad domains.</p>
                </div>
                <Toggle checked={adBlockEnabled} onChange={toggleAdBlock} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="glass rounded-3xl p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <ShieldCheck className="text-emerald-400" size={20} />
                System Health
              </h3>
              <div className="space-y-3">
                <HealthItem label="Chrome API" active={systemStatus.chromeApi} />
                <HealthItem label="Storage Engine" active={systemStatus.storage} />
                <HealthItem label="AI Engine" active={systemStatus.aiReady} />
              </div>
           </div>

           <div className="glass rounded-3xl p-6 space-y-6">
              <h3 className="text-lg font-bold mb-2">Notification Center</h3>
              <ToggleRow icon={<Bell size={18} />} label="System Alerts" checked={true} />
              <ToggleRow icon={<Timer size={18} />} label="Sound Cues" checked={true} />
           </div>

           <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white text-center shadow-xl shadow-indigo-600/20 border border-white/10">
              <h4 className="font-bold mb-2">Privacy Shield</h4>
              <p className="text-xs text-indigo-100 leading-relaxed">
                ZenFlow works 100% locally.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const HealthItem = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
    <span className="text-xs text-slate-400 font-medium">{label}</span>
    {active ? <CheckCircle2 size={14} className="text-emerald-500" /> : <XCircle size={14} className="text-rose-500" />}
  </div>
);

const Toggle = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
  </button>
);

const ToggleRow = ({ icon, label, checked }: { icon: React.ReactNode, label: string, checked: boolean }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3 text-slate-300">
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
    <Toggle checked={checked} onChange={() => {}} />
  </div>
);

export default SettingsView;
