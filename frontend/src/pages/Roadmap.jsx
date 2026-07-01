import React, { useState } from 'react';
import RoadmapView from '../components/RoadmapView';
import { HelpCircle, MessageSquareCode, ChevronDown, ChevronUp } from 'lucide-react';

export default function Roadmap({ chatState, setActiveTab }) {
  const { selectedCareer, finalRoadmap, setExpertConsulted, sendMessage } = chatState;
  const [showSampleRoadmap, setShowSampleRoadmap] = useState(false);

  const isCompleted = !!(selectedCareer || finalRoadmap);

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6">

      {/* Empty state — chưa hoàn tất tư vấn */}
      {!isCompleted && (
        <div className="max-w-4xl mx-auto no-print">
          {/* Banner */}
          <div className="mb-4 p-5 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <HelpCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Bạn chưa chọn nghề mục tiêu</p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Hãy hoàn tất buổi tư vấn với Trợ lý AI để nhận lộ trình cá nhân hóa, hoặc xem thử lộ trình mẫu bên dưới.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                onClick={() => setActiveTab('assistant')}
                className="text-xs font-semibold px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquareCode className="w-3.5 h-3.5" />
                Tiếp tục tư vấn AI
              </button>
              <button
                onClick={() => setShowSampleRoadmap(prev => !prev)}
                className="text-xs font-semibold px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                {showSampleRoadmap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                Xem lộ trình mẫu
              </button>
            </div>
          </div>

          {/* Sample roadmap — chỉ hiện khi bấm nút */}
          {showSampleRoadmap && (
            <div className="animate-fade-in">
              <div className="mb-4 px-4 py-2.5 bg-amber-100 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-lg text-xs text-amber-700 dark:text-amber-400 font-medium flex items-center gap-2">
                <span>📋</span>
                <span>Đây là lộ trình mẫu minh hoạ — hoàn tất tư vấn AI để nhận lộ trình cá nhân hóa cho bạn.</span>
              </div>
              <RoadmapView
                selectedCareer="Kỹ sư Phần mềm"
                finalRoadmap={null}
                setExpertConsulted={setExpertConsulted}
                sendMessage={sendMessage}
                setActiveTab={setActiveTab}
              />
            </div>
          )}
        </div>
      )}

      {/* Roadmap đầy đủ — đã hoàn tất tư vấn */}
      {isCompleted && (
        <RoadmapView
          selectedCareer={selectedCareer}
          finalRoadmap={finalRoadmap}
          setExpertConsulted={setExpertConsulted}
          sendMessage={sendMessage}
          setActiveTab={setActiveTab}
        />
      )}
    </div>
  );
}
