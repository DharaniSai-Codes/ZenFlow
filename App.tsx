
import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  BarChart3, 
  Settings, 
  MessageSquareQuote,
  Zap,
  AlertCircle
} from 'lucide-react';
import Dashboard from './components/Dashboard';
import Stats from './components/Stats';
import SettingsView from './components/SettingsView';
import AICoach from './components/AICoach';
import { AppView } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>('DASHBOARD');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(true);

  useEffect(() => {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      setHasApiKey(false);
    }
  }, []);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-950 text-slate-100 overflow-hidden font-['Plus_Jakarta_Sans']">
      
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 z-50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Zen<span className="text-indigo-500">Flow</span></span>
        </div>
        <button 
          onClick={() => setIsFocusMode(!isFocusMode)}
          className={`p-2.5 rounded-full transition-all duration-300 ${isFocusMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'bg-slate-800 text-slate-400'}`}
        >
          <Zap size={18} fill={isFocusMode ? "currentColor" : "none"} />
        </button>
      </header>

      {/* Desktop Sidebar */}
      <nav className="hidden md:flex w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex-col items-center py-8 px-4 gap-8 shrink-0">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="hidden lg:block text-2xl font-bold tracking-tight">Zen<span className="text-indigo-500">Flow</span></h1>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <NavButton 
            active={activeView === 'DASHBOARD'} 
            onClick={() => setActiveView('DASHBOARD')}
            icon={<LayoutDashboard size={22} />}
            label="Home"
          />
          <NavButton 
            active={activeView === 'STATS'} 
            onClick={() => setActiveView('STATS')}
            icon={<BarChart3 size={22} />}
            label="Analytics"
          />
          <NavButton 
            active={activeView === 'COACH'} 
            onClick={() => setActiveView('COACH')}
            icon={<MessageSquareQuote size={22} />}
            label="AI Coach"
          />
          <NavButton 
            active={activeView === 'SETTINGS'} 
            onClick={() => setActiveView('SETTINGS')}
            icon={<Settings size={22} />}
            label="Rules"
          />
        </div>

        <div className="mt-auto w-full pt-6 border-t border-slate-800">
           {!hasApiKey && (
             <div className="hidden lg:flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl mb-6 animate-pulse">
                <AlertCircle className="text-rose-500 shrink-0" size={16} />
                <span className="text-[10px] text-rose-200 font-medium">AI Key Missing. Check documentation.</span>
             </div>
           )}

           <div className="flex flex-col items-center gap-4 text-center">
              <div className={`p-1 rounded-full ${isFocusMode ? 'bg-indigo-500/20' : 'bg-slate-800'}`}>
                <button 
                  onClick={() => setIsFocusMode(!isFocusMode)}
                  className={`p-3 rounded-full transition-all duration-300 ${isFocusMode ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/40 scale-110' : 'text-slate-400 hover:text-white'}`}
                >
                  <Zap size={20} fill={isFocusMode ? "currentColor" : "none"} />
                </button>
              </div>
              <span className="hidden lg:block text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                Deep Work Mode<br/>{isFocusMode ? 'ACTIVE' : 'INACTIVE'}
              </span>
           </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-slate-950 pb-24 md:pb-0">
        <div className="p-5 md:p-8 lg:p-12 max-w-7xl mx-auto">
          {activeView === 'DASHBOARD' && (
            <Dashboard 
              isFocusMode={isFocusMode} 
              toggleFocus={() => setIsFocusMode(!isFocusMode)} 
              onNavigate={setActiveView} 
            />
          )}
          {activeView === 'STATS' && <Stats />}
          {activeView === 'COACH' && <AICoach />}
          {activeView === 'SETTINGS' && <SettingsView />}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around items-center px-4 py-3 z-50 backdrop-blur-lg bg-opacity-90">
        <MobileNavButton active={activeView === 'DASHBOARD'} onClick={() => setActiveView('DASHBOARD')} icon={<LayoutDashboard size={20} />} />
        <MobileNavButton active={activeView === 'STATS'} onClick={() => setActiveView('STATS')} icon={<BarChart3 size={20} />} />
        <MobileNavButton active={activeView === 'COACH'} onClick={() => setActiveView('COACH')} icon={<MessageSquareQuote size={20} />} />
        <MobileNavButton active={activeView === 'SETTINGS'} onClick={() => setActiveView('SETTINGS')} icon={<Settings size={20} />} />
      </nav>
    </div>
  );
};

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group w-full ${
      active 
        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-600/30' 
        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <span className={`${active ? 'text-indigo-400' : 'group-hover:scale-110 transition-transform'}`}>{icon}</span>
    <span className="hidden lg:block font-semibold tracking-wide">{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; }> = ({ active, onClick, icon }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${
      active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 scale-110' : 'text-slate-500'
    }`}
  >
    {icon}
  </button>
);

export default App;
