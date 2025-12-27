
import React, { useState, useEffect } from 'react';
import { Timer, BrainCircuit, ShieldAlert, CheckCircle2, Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { AppView } from '../types';

declare const chrome: any;

interface DashboardProps {
  isFocusMode: boolean;
  toggleFocus: () => void;
  onNavigate: (view: AppView) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ isFocusMode, toggleFocus, onNavigate }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [blockedSites, setBlockedSites] = useState<string[]>([]);

  // Load blocked sites from storage
  useEffect(() => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      chrome.storage.local.get(['blockedSites'], (result: any) => {
        if (result.blockedSites) {
          setBlockedSites(result.blockedSites);
        }
      });
    }
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      setSessionCount((prev) => prev + 1);
      alert("Great job! Session complete. Take a breather.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-1">Welcome Back, Focused Friend</h2>
          <p className="text-sm md:text-base text-slate-400 font-medium">You've saved <span className="text-indigo-400">2.4 hours</span> this week.</p>
        </div>
        <div className="flex md:hidden lg:flex gap-3">
            <div className="glass px-3 py-1.5 md:px-4 md:py-2 rounded-lg flex items-center gap-2">
                <ShieldAlert className="text-amber-400 w-3.5 h-3.5" />
                <span className="text-[10px] md:text-xs font-bold uppercase text-slate-300">{blockedSites.length} Blocks Today</span>
            </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Timer Card */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 md:p-12 flex flex-col items-center justify-center relative overflow-hidden min-h-[400px]">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
             <div 
               className="h-full bg-indigo-500 transition-all duration-1000" 
               style={{ width: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%` }}
             />
          </div>
          
          <div className="mb-4 md:mb-6 flex items-center gap-2 text-indigo-400 font-bold uppercase tracking-widest text-[10px] md:text-sm">
             <BrainCircuit size={16} className="md:w-5 md:h-5" />
             <span>Deep Work Protocol</span>
          </div>

          <div className="text-6xl sm:text-7xl md:text-9xl font-black tabular-nums tracking-tighter text-white mb-6 md:mb-8 drop-shadow-[0_0_20px_rgba(99,102,241,0.3)]">
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-3 md:gap-4 w-full justify-center">
            <button 
              onClick={() => setIsActive(!isActive)}
              className={`flex-1 max-w-[200px] flex items-center justify-center gap-2 px-6 py-3.5 md:py-4 rounded-2xl font-bold transition-all text-sm md:text-base ${
                isActive 
                  ? 'bg-slate-700 text-white hover:bg-slate-600' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-xl shadow-indigo-600/20'
              }`}
            >
              {isActive ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" />}
              {isActive ? 'Pause' : 'Start'}
            </button>
            <button 
              onClick={resetTimer}
              className="p-3.5 md:p-4 rounded-2xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={18} />
            </button>
          </div>

          <div className="mt-8 md:mt-12 grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg">
            <StatsBox value={sessionCount.toString()} label="Done" />
            <StatsBox value="25:00" label="Target" />
            <StatsBox value="4.2" label="Avg" />
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-5 md:p-6">
            <h3 className="text-base md:text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-rose-500" size={18} />
              Site Blocker
            </h3>
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
              {blockedSites.length === 0 ? (
                <div className="text-center py-6 text-slate-500 text-xs italic">
                  No active blocks
                </div>
              ) : (
                blockedSites.map(site => (
                  <SiteRow 
                    key={site} 
                    name={site} 
                    icon={`https://www.google.com/s2/favicons?domain=${site}`} 
                    count={Math.floor(Math.random() * 20) + 1} // Mock block count
                  />
                ))
              )}
            </div>
            <button 
              onClick={() => onNavigate('SETTINGS')}
              className="w-full mt-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors active:scale-95"
            >
              Customize Rules
            </button>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-5 md:p-6 text-white relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
               <BrainCircuit size={100} />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 flex items-center gap-2">
              <Zap size={18} />
              Focus Pro Tip
            </h3>
            <p className="text-indigo-100 text-xs md:text-sm leading-relaxed relative z-10">
              "Your brain takes 23 minutes to refocus after a single distraction. Close all tabs before you begin."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsBox = ({ value, label }: { value: string, label: string }) => (
  <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl text-center border border-slate-700/30">
    <span className="block text-lg md:text-xl font-black text-white">{value}</span>
    <span className="text-[9px] md:text-xs text-slate-500 uppercase font-black tracking-widest">{label}</span>
  </div>
);

const SiteRow = ({ name, icon, count }: { name: string, icon: string, count: number }) => (
  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/30 border border-slate-700/50">
    <div className="flex items-center gap-3 truncate mr-2">
      <img src={icon} alt={name} className="w-4 h-4 rounded shrink-0 opacity-80" />
      <span className="text-xs font-semibold text-slate-300 truncate">{name}</span>
    </div>
    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full font-bold whitespace-nowrap">{count} blocks</span>
  </div>
);

export default Dashboard;
