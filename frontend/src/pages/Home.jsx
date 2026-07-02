import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, BookOpen, HeartPulse, X, Calendar, MessageSquare, Award, Clock, ArrowRight, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RoadmapView from '../components/RoadmapView';
import MessageBubble from '../components/MessageBubble';

export default function Home({ setActiveTab, chatState }) {
  const { user } = useAuth();
  const [historyList, setHistoryList] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState('chat'); // 'chat' | 'roadmap'

  // Fetch consultation history when logged in
  useEffect(() => {
    if (user && chatState?.fetchUserHistory) {
      chatState.fetchUserHistory(user.id).then(data => {
        setHistoryList(data || []);
      });
    }
  }, [user, chatState]);

  // Format timestamp nicely
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

  return (
    <div className="flex-1 overflow-y-auto no-print">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Glow Effects */}
        <div className="absolute top-0 -z-10 w-[500px] h-[500px] bg-primary-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -z-10 w-[500px] h-[500px] bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/40 border border-primary-200/50 dark:border-primary-800/30 text-xs font-semibold text-primary-600 dark:text-primary-400 mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Giải pháp hướng nghiệp ứng dụng AI & Khoa học Hành vi
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100 max-w-4xl leading-tight">
          Định hình Tương lai Nghề nghiệp <br />
          Với Sự Trợ Giúp Từ <span className="bg-gradient-to-r from-primary-600 to-indigo-500 bg-clip-text text-transparent">Trí Tuệ Nhân Tạo</span>
        </h1>

        <p className="mt-6 text-base md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
          Ứng dụng mô hình PIC (Prescreening - In-depth - Choice) giúp bạn vượt qua áp lực đồng trang lứa, lọc bỏ thông tin nhiễu để tìm ra con đường phù hợp nhất.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => setActiveTab('assistant')}
            className="py-3 px-8 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl text-base font-semibold shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all"
          >
            Trò chuyện với AI
          </button>
          


          <button
            onClick={() => setActiveTab('about')}
            className="py-3 px-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl text-base font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Tìm hiểu mô hình PIC
          </button>
        </div>
      </section>

      {/* History List Section */}
      {user && historyList.length > 0 && (
        <section id="consultation-history-section" className="py-16 px-6 max-w-6xl mx-auto border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-6 h-6 text-primary-500" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 dark:text-slate-100">
              Lịch sử tư vấn của bạn
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            Xem lại các phiên định hướng nghề nghiệp, lịch sử đối thoại và các lộ trình học tập đã lưu.
          </p>

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

                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base line-clamp-1">
                    {item.selectedCareer 
                      ? `🎯 Lộ trình: ${item.selectedCareer}` 
                      : item.shortlistedCareers?.length > 0 
                        ? `🔍 Nhóm nghề: ${item.shortlistedCareers.join(', ')}`
                        : `📋 Khảo sát hồ sơ & Tiêu chí`}
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
                        setShowHistoryModal(true);
                        setActiveSubTab('chat');
                      }}
                      className="px-3.5 py-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg text-xs border border-slate-200 dark:border-slate-700 transition-colors"
                    >
                      Xem lại
                    </button>
                    <button
                      onClick={() => {
                        chatState.loadHistoricalSession(item);
                        setActiveTab('assistant');
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
        </section>
      )}

      {/* PIC Model Introduction Cards */}
      <section className="bg-slate-100/50 dark:bg-slate-900/30 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center text-slate-800 dark:text-slate-100 mb-12">
            Luồng Hướng Nghiệp Chuẩn Khoa Học
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 flex items-center justify-center mb-6">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">1. Sàng lọc (Prescreening)</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Khai phá mong muốn ban đầu và lọc danh sách từ hàng trăm nghề nghiệp xuống nhóm rút gọn từ 5-7 nghề thông qua bộ tiêu chí ưu tiên của riêng bạn.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">2. Khám phá chuyên sâu</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                AI hỗ trợ nghiên cứu sâu sắc về thu nhập, yêu cầu công việc thực tế, ưu - nhược điểm và giải đáp các câu hỏi phản biện của bạn.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200/60 dark:border-slate-800/80 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 flex items-center justify-center mb-6">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">3. Lựa chọn & Lộ trình</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                Đưa ra quyết định cuối cùng dựa trên ma trận so sánh khoa học. Nhận lộ trình phát triển kỹ năng 6-12 tháng có thể tải về dưới dạng PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* History Detail Modal */}
      {showHistoryModal && selectedSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-scale-up">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div>
                <span className="text-[10px] font-semibold text-primary-500 dark:text-primary-400 uppercase tracking-wider bg-primary-50 dark:bg-primary-950/40 px-2 py-0.5 rounded">Lịch sử tư vấn</span>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mt-2">
                  {selectedSession.selectedCareer 
                    ? `🎯 Lộ trình: ${selectedSession.selectedCareer}` 
                    : selectedSession.shortlistedCareers?.length > 0 
                      ? `🔍 Nhóm nghề: ${selectedSession.shortlistedCareers.join(', ')}`
                      : `📋 Phiên khảo sát PIC`}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Cập nhật: {formatDate(selectedSession.updatedAt)} • {selectedSession.history?.length || 0} tin nhắn
                </p>
              </div>
              <button 
                onClick={() => { setShowHistoryModal(false); setSelectedSession(null); }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub-tabs inside Modal */}
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

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto min-h-0 bg-slate-50/50 dark:bg-slate-950/10">
              {activeSubTab === 'chat' ? (
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
                      setActiveTab={setActiveTab}
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
              <button
                onClick={() => {
                  chatState.loadHistoricalSession(selectedSession);
                  setShowHistoryModal(false);
                  setSelectedSession(null);
                  setActiveTab('assistant');
                }}
                className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl text-xs shadow-md transition-colors"
              >
                Tiếp tục tư vấn phiên này
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

