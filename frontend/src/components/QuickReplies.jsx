import React from 'react';

const QUICK_REPLIES = {
  WELCOME: [],
  CLASSIFY_PATH: [],
  LISTING_CAREERS: [],
  EXPLAIN_INSUFFICIENT_CAREERS: [],
  PROFILE_GATHERING: [
    "Sở thích cá nhân cốt lõi: Công nghệ. Ngành học/Trình độ: CNTT năm 3. Năng lực cá nhân: Kỹ năng kỹ thuật lập trình Python. Học lực/Kinh nghiệm: Học lực Giỏi (GPA 3.4). Rào cản/Hạn chế: Không. Mục tiêu: Lương 20tr+.",
    "Sở thích cá nhân cốt lõi: Kinh doanh. Ngành học/Trình độ: Quản trị Kinh doanh. Năng lực cá nhân: Sự sáng tạo và Giao tiếp tốt. Học lực/Kinh nghiệm: Học lực Khá (đã làm CTV Marketing). Rào cản/Hạn chế: Không. Mục tiêu: Trở thành quản lý nhóm."
  ],
  CRITERIA_EVALUATION: [],
  SUGGEST_MORE_QUESTION: [],
  SHORTLIST_CONFIRMATION: [],
  IN_DEPTH_EXPLORATION: [],
  CHOICE_SELECTION: [],
  GENERATE_ROADMAP: [],
  ROADMAP_DECISION: [],
  ROADMAP_ADJUSTMENT: [],
  COMPLETED: [],
  // Chat stages where the input is open and free text is typed:
  PRESCREENING: [],
  IN_DEPTH: [],
  CHOICE: []
};

export default function QuickReplies({ stage, subStage, onSelect }) {
  // Prefer subStage-based replies, fallback to stage
  const currentReplies = QUICK_REPLIES[subStage] || QUICK_REPLIES[stage] || [];

  if (currentReplies.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2 px-4 py-2 no-print">
      {currentReplies.map((reply, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(reply)}
          className="text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 transition-colors"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}
