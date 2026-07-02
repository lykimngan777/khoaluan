import React, { useState, useEffect } from 'react';
import { Compass, MessageSquareCode, Calendar, Info, Moon, Sun, LogOut, Clock, X, MessageSquare, Award, ArrowRight, Trash2 } from 'lucide-react';
import RoadmapView from './components/RoadmapView';
import MessageBubble from './components/MessageBubble';
import Home from './pages/Home';
import Assistant from './pages/Assistant';
import Roadmap from './pages/Roadmap';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import ExpertDashboard from './pages/ExpertDashboard';
import { useChatSession } from './hooks/useChatSession';
import { useAuth } from './context/AuthContext';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [darkMode, setDarkMode] = useState(false);
  
  const chatState = useChatSession();
  const { user, logout, loading } = useAuth();

  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [historyList, setHistoryList] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' | 'roadmap'

  // Fetch consultation history when logged in
  useEffect(() => {
    if (user && chatState?.fetchUserHistory && showHistoryModal) {
      chatState.fetchUserHistory(user.id).then(data => {
        setHistoryList(data || []);
      });
    }
  }, [user, chatState, showHistoryModal]);

  // Format date/time
  const formatDate = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

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

  // Nếu user là expert → render dashboard riêng
  if (!loading && user?.role === 'expert') {
    return <ExpertDashboard onLogout={handleLogout} />;
  }

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
        <div className="flex items-center gap-2 md:gap-3">
          {user && (
            <button
              onClick={() => setShowHistoryModal(true)}
              title="Lịch sử tư vấn"
              className="px-2.5 py-1.5 md:py-2.5 md:px-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:hover:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold transition-colors flex items-center gap-1.5 text-[11px] md:text-xs hover:scale-[1.02] active:scale-95 transition-all shadow-md shadow-indigo-500/5 shrink-0 animate-fade-in"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Lịch sử tư vấn</span>
            </button>
          )}

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
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
        {activeTab === 'home'      && <div className="flex-1 overflow-y-auto"><Home setActiveTab={handleTabChange} chatState={chatState} /></div>}
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

      {/* Global History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in no-print">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                {selectedSession ? (
                  <button 
                    onClick={() => setSelectedSession(null)}
                    className="text-xs font-semibold text-primary-500 hover:text-primary-600 flex items-center gap-1 mb-1 transition-colors"
                  >
                    ← Quay lại danh sách
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded">Lịch sử</span>
                )}
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-2">
                  {selectedSession ? (
                    selectedSession.selectedCareer 
                      ? `🎯 Lộ trình: ${selectedSession.selectedCareer}` 
                      : selectedSession.shortlistedCareers?.length > 0 
                        ? `🔍 Nhóm nghề: ${selectedSession.shortlistedCareers.join(', ')}`
                        : `📋 Phiên khảo sát PIC`
                  ) : (
                    "Lịch sử tư vấn hướng nghiệp"
                  )}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedSession 
                    ? `Cập nhật: ${formatDate(selectedSession.updatedAt)} • ${selectedSession.history?.length || 0} tin nhắn`
                    : `Danh sách các cuộc trò chuyện và lộ trình bạn đã thực hiện`}
                </p>
              </div>
              <button 
                onClick={() => { setShowHistoryModal(false); setSelectedSession(null); }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside Modal (only shown when viewing a specific session) */}
            {selectedSession && (
              <div className="px-6 py-2 border-b border-slate-150 dark:border-slate-800/60 flex gap-4 shrink-0 bg-slate-50/20">
                <button
                  onClick={() => setActiveSubTab('chat')}
                  className={`py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    activeSubTab === 'chat'
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Đoạn hội thoại ({selectedSession.history?.length || 0})
                </button>
                <button
                  onClick={() => setActiveSubTab('roadmap')}
                  className={`py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    activeSubTab === 'roadmap'
                      ? 'bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" /> Lộ trình học tập & Kỹ năng
                </button>
              </div>
            )}

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 dark:bg-slate-950/10">
              {!selectedSession ? (
                /* History List */
                <div className="p-6 space-y-4 max-w-4xl mx-auto">
                  {historyList.length === 0 ? (
                    <div className="py-20 text-center space-y-3">
                      <div className="text-4xl text-slate-300">📋</div>
                      <h4 className="font-bold text-slate-700 dark:text-slate-300">Chưa có lịch sử tư vấn</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Các phiên tư vấn tương lai của bạn sẽ được lưu giữ tại đây.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {historyList.map((item) => (
                        <div 
                          key={item.id} 
                          className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                        >
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(item.updatedAt)}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.stage === 'COMPLETED'
                                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
                                  : 'bg-amber-50 text-amber-600 dark:bg-amber-950/20'
                              }`}>
                                {item.stage === 'COMPLETED' ? 'Đã hoàn tất' : 'Đang thực hiện'}
                              </span>
                            </div>

                            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                              {item.selectedCareer 
                                ? `🎯 Lộ trình: ${item.selectedCareer}` 
                                : item.shortlistedCareers?.length > 0 
                                  ? `🔍 Nhóm nghề: ${item.shortlistedCareers.join(', ')}`
                                  : `📋 Phiên khảo sát PIC`}
                            </h3>

                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                              {item.profileInfo?.interests ? `Sở thích: ${item.profileInfo.interests}. ` : ''}
                              {item.profileInfo?.goals ? `Mục tiêu: ${item.profileInfo.goals}` : ''}
                            </p>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                              <MessageSquare className="w-3.5 h-3.5" />
                              {item.history?.length || 0} tin nhắn
                            </span>

                            <div className="flex gap-2 items-center">
                              <button
                                onClick={async () => {
                                  if (window.confirm("Bạn có chắc chắn muốn xóa đoạn chat này không?")) {
                                    const success = await chatState.deleteSession(item.id);
                                    if (success) {
                                      chatState.fetchUserHistory(user.id).then(data => {
                                        setHistoryList(data || []);
                                      });
                                    }
                                  }
                                }}
                                title="Xóa đoạn chat"
                                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedSession(item);
                                  setActiveSubTab('chat');
                                }}
                                className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                              >
                                Xem lại
                              </button>
                              <button
                                onClick={() => {
                                  chatState.loadHistoricalSession(item);
                                  setShowHistoryModal(false);
                                  handleTabChange('assistant');
                                }}
                                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg text-xs transition-colors flex items-center gap-0.5"
                              >
                                Tiếp tục <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* History Details tab content */
                activeSubTab === 'chat' ? (
                  <div className="p-6 space-y-4 max-w-4xl mx-auto">
                    {selectedSession.history?.map((msg, idx) => (
                      <MessageBubble key={idx} message={msg} index={idx} />
                    ))}
                  </div>
                ) : (
                  <div className="p-6">
                    {selectedSession.finalRoadmap || selectedSession.selectedCareer ? (
                      <RoadmapView 
                        selectedCareer={selectedSession.selectedCareer || selectedSession.finalRoadmap?.careerName} 
                        finalRoadmap={selectedSession.finalRoadmap} 
                        setExpertConsulted={() => {}} 
                        sendMessage={() => {}} 
                        setActiveTab={handleTabChange}
                      />
                    ) : (
                      <div className="max-w-md mx-auto py-16 text-center space-y-3">
                        <div className="text-4xl">🗺️</div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">Chưa thiết lập lộ trình</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Phiên tư vấn này chưa được tiến hành đầy đủ để nhận lộ trình. Bạn có thể nhấn nút <strong>Tiếp tục tư vấn</strong> bên dưới để hoàn tất cùng AI.
                        </p>
                      </div>
                    )}
                  </div>
                )
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50/50 dark:bg-slate-900/50 shrink-0">
              <button
                onClick={() => { setShowHistoryModal(false); setSelectedSession(null); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl text-xs transition-colors"
              >
                Đóng
              </button>
              {selectedSession && (
                <button
                  onClick={() => {
                    chatState.loadHistoricalSession(selectedSession);
                    setShowHistoryModal(false);
                    setSelectedSession(null);
                    handleTabChange('assistant');
                  }}
                  className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
                >
                  Tiếp tục tư vấn phiên này
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
