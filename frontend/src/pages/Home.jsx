import React from 'react';
import { Compass, Sparkles, BookOpen, HeartPulse } from 'lucide-react';

export default function Home({ setActiveTab }) {
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

        <div className="mt-10 flex flex-col sm:flex-row gap-4">
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
    </div>
  );
}
