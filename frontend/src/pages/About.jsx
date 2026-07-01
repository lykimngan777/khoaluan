import React from 'react';
import { Target, CheckCircle2, Award, ExternalLink } from 'lucide-react';

export default function About() {
  return (
    <div className="flex-1 overflow-y-auto max-w-4xl mx-auto p-6 md:p-8 no-print space-y-10">
      
      {/* Introduction */}
      <section className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          Về CareerAI & Mô hình Hướng nghiệp PIC
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
          CareerAI là giải pháp tiên phong ứng dụng trí tuệ nhân tạo (AI) kết hợp mô hình hành vi PIC nhằm cách mạng hóa phương thức tự hướng nghiệp cho học sinh, sinh viên.
        </p>
      </section>

      {/* PIC Model Details */}
      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          Mô hình PIC là gì?
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          Được đề xuất bởi Giáo sư <strong>Itamar Gati</strong> (Đại học Hebrew, Jerusalem), mô hình <strong>PIC (Prescreening, In-depth Exploration, Choice)</strong> là một trong những khung hướng nghiệp phổ biến và khoa học nhất trên thế giới. Nó được thiết kế để giải quyết bài toán "quá tải thông tin" khi người học đứng trước hàng trăm lựa chọn nghề nghiệp.
        </p>

        <div className="space-y-4">
          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-600 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">P</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Sàng lọc Sơ bộ (Prescreening)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Lọc bớt các nghề không tương thích bằng cách định nghĩa các tiêu chí quan trọng (vùng làm việc, thu nhập mong muốn, mức độ stress...). Từ đó giảm danh sách từ 300 nghề xuống 5-7 nghề.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">I</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Khám phá Chuyên sâu (In-depth Exploration)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Tìm hiểu kỹ từng khía cạnh của 5-7 nghề trong danh sách rút gọn. Trả lời các câu hỏi về chuyên môn, mặt tối của nghề để lọc tiếp xuống còn 2-3 nghề phù hợp nhất.
              </p>
            </div>
          </div>

          <div className="flex gap-3 items-start">
            <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-xs font-bold">C</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">Lựa chọn Tối ưu (Choice)</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                So sánh các lựa chọn còn lại bằng ma trận trọng số. Đưa ra quyết định cuối cùng và cam kết hành động với lộ trình phát triển kỹ năng thực tế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Thesis Information */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-primary-500" />
            Đề tài Khóa luận
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Nghiên cứu tích hợp mô hình hướng nghiệp PIC vào hệ thống AI đàm thoại giúp cá nhân hóa lộ trình học tập, đào tạo kỹ năng cho học sinh THPT và sinh viên đại học.
          </p>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-1.5">
            <Target className="w-4.5 h-4.5 text-primary-500" />
            Tài liệu tham khảo
          </h4>
          <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-2">
            <li>
              <a 
                href="https://krumboltz.stanford.edu/" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-primary-500 hover:underline inline-flex items-center gap-1"
              >
                Lý thuyết Học tập Xã hội hướng nghiệp <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a 
                href="https://cddq.huji.ac.il/" 
                target="_blank" 
                rel="noreferrer"
                className="hover:text-primary-500 hover:underline inline-flex items-center gap-1"
              >
                Hệ thống CDDQ - Itamar Gati <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </section>

    </div>
  );
}
