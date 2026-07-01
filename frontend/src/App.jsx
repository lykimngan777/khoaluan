import React, { useState, useEffect } from 'react';
import { Compass, MessageSquareCode, Calendar, Info, Moon, Sun, LogOut } from 'lucide-react';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import { useChatSession } from './hooks/useChatSession';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  
  const chatState = useChatSession();
  const { user, logout, loading } = useAuth();

  // Dark Mode side effects
  useEffect(() => {
    const isDark = localStorage.getItem('dark_mode') === 'true';
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    localStorage.setItem('dark_mode', String(nextDark));
    if (nextDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Intercept tab changes to enforce auth
  const handleTabChange = (tab) => {
    if ((tab === 'assistant' || tab === 'roadmap') && !user) {
      if (window.confirm('Bạn cần đăng nhập để sử dụng tính năng này. Chuyển đến trang Đăng nhập?')) {
        setActiveTab('login');
      }
      return;
    }
    setActiveTab(tab);
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất không?')) {
      logout();
      setActiveTab('home');
    }
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-hidden">
      
      {/* Header (Top Navigation) */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between no-print">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleTabChange('home')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-sky-400 flex items-center justify-center text-white font-extrabold text-sm">
            C
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary-600 to-sky-400 bg-clip-text text-transparent">
            CareerAI
          </span>
        </div>

        {/* Desktop Tabs */}
        <nav className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => handleTabChange('home')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'home' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Compass className="w-4 h-4" />
            Trang chủ
          </button>
          
          <button
            onClick={() => handleTabChange('assistant')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'assistant' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <MessageSquareCode className="w-4 h-4" />
            Định hướng nghề nghiệp
          </button>

          <button
            onClick={() => handleTabChange('roadmap')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'roadmap' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Bảng lộ trình
          </button>

          <button
            onClick={() => handleTabChange('about')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === 'about' 
                ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/40 dark:text-primary-400' 
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
            Giới thiệu
          </button>
        </nav>

        {/* Theme and Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4" />}
          </button>
          
          {!loading && (
            user ? (
              <div className="flex items-center gap-2.5">
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 pl-2.5 pr-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700/60 max-w-[180px]">
                  <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs uppercase shrink-0">
                    {user.name.charAt(0)}
                  </div>
                  <span className="text-xs font-semibold truncate text-slate-700 dark:text-slate-300 hidden sm:inline">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Đăng xuất"
                  className="p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleTabChange('login')}
                className="py-2.5 px-5 bg-gradient-to-r from-primary-600 to-indigo-500 hover:from-primary-700 hover:to-indigo-600 text-white rounded-xl text-sm font-bold shadow-md shadow-primary-500/10 hover:shadow-primary-500/20 active:scale-[0.98] transition-all"
              >
                Đăng nhập
              </button>
            )
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {activeTab === 'home'      && <div className="flex-1 overflow-y-auto"><Home setActiveTab={handleTabChange} /></div>}
        {activeTab === 'assistant' && <Assistant chatState={chatState} setActiveTab={handleTabChange} />}
        {activeTab === 'roadmap'   && <div className="flex-1 overflow-y-auto"><Roadmap chatState={chatState} setActiveTab={handleTabChange} /></div>}
        {activeTab === 'about'     && <div className="flex-1 overflow-y-auto"><About /></div>}
        {activeTab === 'login'     && <div className="flex-1 overflow-y-auto"><Login setActiveTab={handleTabChange} /></div>}
        {activeTab === 'register'  && <div className="flex-1 overflow-y-auto"><Register setActiveTab={handleTabChange} /></div>}
      </main>

      {/* Footer / Mobile Nav */}
      <footer className="md:hidden sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 grid grid-cols-4 py-2 no-print z-50">
        <button onClick={() => handleTabChange('home')} className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'home' ? 'text-primary-500' : 'text-slate-400'}`}>
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Trang chủ</span>
        </button>
        <button onClick={() => handleTabChange('assistant')} className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'assistant' ? 'text-primary-500' : 'text-slate-400'}`}>
          <MessageSquareCode className="w-5 h-5" />
          <span className="text-[10px]">Định hướng</span>
        </button>
        <button onClick={() => handleTabChange('roadmap')} className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'roadmap' ? 'text-primary-500' : 'text-slate-400'}`}>
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Lộ trình</span>
        </button>
        <button onClick={() => handleTabChange('about')} className={`flex flex-col items-center gap-1 py-1 ${activeTab === 'about' ? 'text-primary-500' : 'text-slate-400'}`}>
          <Info className="w-5 h-5" />
          <span className="text-[10px]">Giới thiệu</span>
        </button>
      </footer>
    </div>
  );
}
