import React from 'react';
import { RefreshCw, CheckCircle, Circle, Loader, User } from 'lucide-react';

// ── Định nghĩa 3 giai đoạn PIC ──────────────────────────────────────────────
const PIC_PHASES = [
  {
    id: 'G',
    label: 'Thông tin chung',
    labelVi: 'Hồ sơ cá nhân',
    color: 'slate',
    stages: ['PRESCREENING'],
    steps: [
      { label: 'Thu thập hồ sơ cá nhân',          subStages: ['PROFILE_GATHERING'] },
    ],
  },
  {
    id: 'P',
    label: 'P — Prescreening',
    labelVi: 'Sàng lọc tiêu chí',
    color: 'sky',
    stages: ['PRESCREENING'],
    steps: [
      { label: 'Phân loại hướng khởi đầu',        subStages: ['WELCOME', 'CLASSIFY_PATH'] },
      { label: 'Liệt kê / Gợi ý nghề nghiệp',     subStages: ['LISTING_CAREERS', 'EXPLAIN_INSUFFICIENT_CAREERS', 'SUGGEST_MORE_QUESTION'] },
      { label: 'Sàng lọc & Xác nhận rút gọn',     subStages: ['CRITERIA_EVALUATION', 'SHORTLIST_CONFIRMATION'] },
    ],
  },
  {
    id: 'I',
    label: 'I — In-depth',
    labelVi: 'Khám phá chuyên sâu',
    color: 'amber',
    stages: ['IN_DEPTH'],
    steps: [
      { label: 'Phân tích xu hướng & mức lương',    subStages: ['IN_DEPTH_EXPLORATION'] },
      { label: 'Đánh giá khoảng cách năng lực',     subStages: ['IN_DEPTH_EXPLORATION'] },
      { label: 'Ưu/nhược điểm từng nghề',           subStages: ['IN_DEPTH_EXPLORATION'] },
    ],
  },
  {
    id: 'C',
    label: 'C — Choice',
    labelVi: 'Lựa chọn lộ trình',
    color: 'emerald',
    stages: ['CHOICE', 'COMPLETED'],
    steps: [
      { label: 'So sánh & Xếp hạng nghề',           subStages: ['CHOICE_SELECTION'] },
      { label: 'Chọn nghề mục tiêu & Xây lộ trình', subStages: ['GENERATE_ROADMAP'] },
      { label: 'Kết nối chuyên gia / Điều chỉnh',   subStages: ['ROADMAP_DECISION', 'ROADMAP_ADJUSTMENT'] },
      { label: 'Xác nhận & Theo dõi tiến độ',       subStages: ['COMPLETED'] },
    ],
  },
];

// Helpers ────────────────────────────────────────────────────────────────────
const SUBSTAGE_ORDER = [
  'PROFILE_GATHERING',
  'WELCOME', 'CLASSIFY_PATH',
  'LISTING_CAREERS', 'EXPLAIN_INSUFFICIENT_CAREERS', 'SUGGEST_MORE_QUESTION',
  'CRITERIA_EVALUATION', 'SHORTLIST_CONFIRMATION',
  'IN_DEPTH_EXPLORATION',
  'CHOICE_SELECTION', 'GENERATE_ROADMAP',
  'ROADMAP_DECISION', 'ROADMAP_ADJUSTMENT',
  'COMPLETED',
];

function currentIdx(subStage) {
  const idx = SUBSTAGE_ORDER.indexOf(subStage);
  return idx === -1 ? 0 : idx;
}

function stepStatus(step, currentSubStage, furthestSubStage) {
  const cur = currentIdx(currentSubStage);
  const furthest = currentIdx(furthestSubStage);
  const stepMin = Math.min(...step.subStages.map(s => currentIdx(s)));
  const stepMax = Math.max(...step.subStages.map(s => currentIdx(s)));

  if (cur >= stepMin && cur <= stepMax) return 'active';
  if (cur > stepMax || furthest > stepMax) return 'done';
  return 'pending';
}

function phaseStatus(phase, stage, subStage) {
  if (phase.id === 'G') {
    return subStage === 'PROFILE_GATHERING' ? 'active' : 'done';
  }
  if (phase.stages.includes(stage) && stage !== 'COMPLETED') {
    if (phase.id === 'P' && subStage === 'PROFILE_GATHERING') return 'pending';
    return 'active';
  }
  if (
    (phase.id === 'P' && ['IN_DEPTH', 'CHOICE', 'COMPLETED'].includes(stage)) ||
    (phase.id === 'I' && ['CHOICE', 'COMPLETED'].includes(stage)) ||
    (phase.id === 'C' && stage === 'COMPLETED')
  ) return 'done';
  return 'pending';
}

// Colour maps ────────────────────────────────────────────────────────────────
const PHASE_COLORS = {
  slate: {
    badge:   'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    header:  'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/20',
    active:  'bg-slate-500 text-white',
    done:    'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-400',
    dot:     'bg-slate-500',
    activeLine: 'text-slate-700 dark:text-slate-300 font-semibold',
    doneLine:   'text-slate-400 dark:text-slate-500',
    pendingLine:'text-slate-400 dark:text-slate-600',
  },
  sky: {
    badge:   'bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300',
    header:  'border-sky-200 dark:border-sky-800 bg-sky-50/60 dark:bg-sky-950/20',
    active:  'bg-sky-500 text-white',
    done:    'bg-sky-200 dark:bg-sky-800 text-sky-700 dark:text-sky-300',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-400',
    dot:     'bg-sky-500',
    activeLine: 'text-sky-700 dark:text-sky-300 font-semibold',
    doneLine:   'text-slate-400 dark:text-slate-500',
    pendingLine:'text-slate-400 dark:text-slate-600',
  },
  amber: {
    badge:   'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
    header:  'border-amber-200 dark:border-amber-800 bg-amber-50/60 dark:bg-amber-950/20',
    active:  'bg-amber-500 text-white',
    done:    'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-400',
    dot:     'bg-amber-500',
    activeLine: 'text-amber-700 dark:text-amber-300 font-semibold',
    doneLine:   'text-slate-400 dark:text-slate-500',
    pendingLine:'text-slate-400 dark:text-slate-600',
  },
  emerald: {
    badge:   'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300',
    header:  'border-emerald-200 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-950/20',
    active:  'bg-emerald-500 text-white',
    done:    'bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300',
    pending: 'bg-slate-100 dark:bg-slate-800 text-slate-400',
    dot:     'bg-emerald-500',
    activeLine: 'text-emerald-700 dark:text-emerald-300 font-semibold',
    doneLine:   'text-slate-400 dark:text-slate-500',
    pendingLine:'text-slate-400 dark:text-slate-600',
  },
};

// Component ──────────────────────────────────────────────────────────────────
export default function ProgressSidebar({ 
  stage = 'PRESCREENING', 
  subStage = 'WELCOME', 
  furthestSubStage = 'PROFILE_GATHERING',
  resetSession,
  onNavigate
}) {
  const handleStepClick = (step) => {
    if (!onNavigate) return;
    const targetSubStage = step.subStages[0];
    let targetStage = 'PRESCREENING';
    if (['IN_DEPTH_EXPLORATION'].includes(targetSubStage)) {
      targetStage = 'IN_DEPTH';
    } else if (['CHOICE_SELECTION', 'GENERATE_ROADMAP', 'ROADMAP_DECISION', 'ROADMAP_ADJUSTMENT'].includes(targetSubStage)) {
      targetStage = 'CHOICE';
    } else if (targetSubStage === 'COMPLETED') {
      targetStage = 'COMPLETED';
    }
    onNavigate(targetStage, targetSubStage);
  };

  return (
    <aside className="w-full lg:w-72 xl:w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full flex-shrink-0 overflow-hidden">

      {/* Logo — cố định, không co */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-primary-500/20 font-extrabold text-sm flex-shrink-0">
          AI
        </div>
        <div>
          <h2 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight">CareerAI Counselor</h2>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Mô hình hướng nghiệp PIC</p>
        </div>
      </div>

      {/* 3 Phases — cuộn nếu nội dung quá dài */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {PIC_PHASES.map((phase) => {
          const pStatus = phaseStatus(phase, stage, subStage);
          const c = PHASE_COLORS[phase.color];
          
          // A phase is unlocked if any of its steps' subStages are less than or equal to furthestSubStage
          const isPhaseUnlocked = phase.steps.some(step => {
            const stepMin = Math.min(...step.subStages.map(s => currentIdx(s)));
            return stepMin <= currentIdx(furthestSubStage);
          });

          const isActive  = pStatus === 'active';
          const isDone    = pStatus === 'done' || (isPhaseUnlocked && !isActive);
          const isPending = !isActive && !isDone;

          return (
            <div
              key={phase.id}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isActive
                  ? `${c.header} border-2 shadow-sm`
                  : isDone
                    ? 'border border-slate-100 dark:border-slate-800 opacity-80'
                    : 'border border-slate-100 dark:border-slate-800 opacity-50'
              }`}
            >
              {/* Phase header */}
              <div className="flex items-center gap-3 px-4 py-3">
                {/* Badge letter */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-extrabold text-sm flex-shrink-0 transition-colors ${
                  isActive  ? c.active :
                  isDone    ? c.done :
                              c.pending
                }`}>
                  {isDone ? <CheckCircle className="w-4 h-4" /> : (phase.id === 'G' ? <User className="w-4 h-4" /> : phase.id)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs text-slate-800 dark:text-slate-100 truncate">
                    {phase.label}
                    {isActive && (
                      <span className={`ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${c.badge}`}>
                        Đang thực hiện
                      </span>
                    )}
                    {isDone && (
                      <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
                        Hoàn tất ✓
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">{phase.labelVi}</div>
                </div>
              </div>

              {/* Steps — only shown if active, done, or unlocked */}
              {(isActive || isDone || isPhaseUnlocked) && (
                <div className="px-4 pb-3 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-2">
                  {phase.steps.map((step, i) => {
                    const sStatus = stepStatus(step, subStage, furthestSubStage);
                    const stepMax = Math.max(...step.subStages.map(s => currentIdx(s)));
                    const isClickable = !!onNavigate && (stepMax <= currentIdx(furthestSubStage));
                    return (
                      <button 
                        key={i} 
                        onClick={() => isClickable && handleStepClick(step)}
                        className={`w-full flex items-start gap-2 text-left rounded-lg p-1.5 transition-all ${
                          isClickable 
                            ? 'hover:bg-slate-100 dark:hover:bg-slate-800/30 cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary-500' 
                            : 'cursor-default'
                        }`}
                        title={isClickable ? `Chuyển đến: ${step.label}` : undefined}
                      >
                        {/* Step icon */}
                        <div className="flex-shrink-0 mt-0.5">
                          {sStatus === 'done'    && <CheckCircle className={`w-3.5 h-3.5 text-${phase.color === 'sky' ? 'sky' : phase.color === 'amber' ? 'amber' : phase.color === 'emerald' ? 'emerald' : 'slate'}-500`} />}
                          {sStatus === 'active'  && <Loader     className={`w-3.5 h-3.5 text-${phase.color === 'sky' ? 'sky' : phase.color === 'amber' ? 'amber' : phase.color === 'emerald' ? 'emerald' : 'slate'}-500 animate-spin`} />}
                          {sStatus === 'pending' && <Circle     className="w-3.5 h-3.5 text-slate-300 dark:text-slate-700" />}
                        </div>
                        {/* Step label */}
                        <span className={`text-[11px] leading-snug ${
                          sStatus === 'done'    ? 'text-slate-600 dark:text-slate-400 font-medium' :
                          sStatus === 'active'  ? 'text-slate-800 dark:text-slate-100 font-bold' :
                                                  'text-slate-400 dark:text-slate-600'
                        }`}>
                          {step.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Reset button ── */}
      <div className="px-4 pb-5 pt-2">
        <button
          onClick={resetSession}
          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Làm mới phiên tư vấn
        </button>
      </div>
    </aside>
  );
}
