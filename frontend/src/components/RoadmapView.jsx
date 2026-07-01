import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  Calendar, Award, GraduationCap, Printer, ChevronRight, Users, 
  RefreshCw, CheckSquare, Square, FileText, UploadCloud, Trash2, 
  Plus, Check, ExternalLink, Edit3, Save, BookOpen, Link, Sparkles,
  X, Send, MessageSquare
} from 'lucide-react';

const DEFAULT_ROADMAPS = {
  "Kỹ sư Phần mềm": {
    careerName: "Kỹ sư Phần mềm (Software Engineer)",
    summary: "Lập trình và thiết kế hệ thống phần mềm chuyên nghiệp. Cơ hội thăng tiến cao lên Tech Lead, Architect hoặc Project Manager.",
    milestones: [
      { 
        phase: "Giai đoạn 1 (Tháng 1-3): Nền tảng cốt lõi", 
        desc: "Học cấu trúc dữ liệu, thuật toán và một ngôn ngữ lập trình chính (Javascript/Python).",
        subtasks: [
          "Học cú pháp ngôn ngữ lập trình cốt lõi (Javascript/Python)",
          "Thực hành các bài toán cấu trúc dữ liệu (Mảng, Danh sách liên kết, Ngăn xếp, Hàng đợi)",
          "Giải ít nhất 20 bài tập thuật toán cơ bản trên LeetCode/HackerRank"
        ]
      },
      { 
        phase: "Giai đoạn 2 (Tháng 4-6): Lập trình ứng dụng Web", 
        desc: "Nắm vững HTML, CSS, ReactJS và kiến thức cơ bản về cơ sở dữ liệu.",
        subtasks: [
          "Xây dựng giao diện tĩnh Responsive bằng HTML5 & CSS3/Tailwind",
          "Nắm vững các hook cơ bản của ReactJS (useState, useEffect, useContext)",
          "Thiết kế database schema đơn giản và thực hành truy vấn SQL cơ bản"
        ]
      },
      { 
        phase: "Giai đoạn 3 (Tháng 7-12): Dự án thực tế & Thực tập", 
        desc: "Xây dựng portfolio cá nhân trên GitHub, thực tập tại doanh nghiệp công nghệ.",
        subtasks: [
          "Xây dựng và hoàn thiện một dự án Full-stack cá nhân",
          "Tối ưu mã nguồn, tạo tài liệu README.md chất lượng trên GitHub",
          "Viết CV lập trình viên và gửi hồ sơ thực tập tại các doanh nghiệp"
        ]
      }
    ],
    courses: [
      { title: "JavaScript Algorithms and Data Structures", provider: "freeCodeCamp" },
      { title: "React - The Complete Guide", provider: "Academind (Udemy)" },
      { title: "CS50's Introduction to Computer Science", provider: "Harvard University (edX)" }
    ],
    certificates: [
      "Meta Front-End Developer Professional Certificate",
      "AWS Certified Cloud Practitioner"
    ]
  },
  "Digital Marketer": {
    careerName: "Chuyên viên Marketing Số (Digital Marketer)",
    summary: "Xây dựng chiến dịch truyền thông đa kênh trực tuyến, tối ưu tỷ lệ chuyển đổi thương mại.",
    milestones: [
      { 
        phase: "Giai đoạn 1 (Tháng 1-3): Tư duy Marketing", 
        desc: "Học về chân dung khách hàng, hành trình mua hàng và viết nội dung cơ bản.",
        subtasks: [
          "Nghiên cứu và lập bản đồ hành trình khách hàng (Customer Journey Map)",
          "Thực hành viết 5 bài Content Marketing mẫu trên Social Media",
          "Học cách thiết lập hệ thống phễu Marketing (Marketing Funnel) cơ bản"
        ]
      },
      { 
        phase: "Giai đoạn 2 (Tháng 4-6): Công cụ & Chạy quảng cáo", 
        desc: "Thành thạo quảng cáo Google Ads, Facebook Ads và tối ưu SEO.",
        subtasks: [
          "Thiết lập và chạy tối ưu hóa chiến dịch Google Search Ads",
          "Nghiên cứu từ khóa & thực hành tối ưu SEO On-page cho 1 website",
          "Thiết lập và thử nghiệm quảng cáo Facebook/TikTok Ads"
        ]
      },
      { 
        phase: "Giai đoạn 3 (Tháng 7-12): Phân tích & Đo lường", 
        desc: "Đọc số liệu từ Google Analytics, thiết kế phễu chuyển đổi nâng cao.",
        subtasks: [
          "Cài đặt Google Analytics 4 (GA4) và theo dõi các sự kiện chuyển đổi",
          "Thiết kế và triển khai chiến dịch A/B testing cho Landing Page",
          "Lập báo cáo tổng hợp hiệu quả Marketing của dự án thực tế"
        ]
      }
    ],
    courses: [
      { title: "Google Digital Marketing & E-commerce Professional Certificate", provider: "Google (Coursera)" },
      { title: "Search Engine Optimization (SEO) Specialization", provider: "UC Davis (Coursera)" }
    ],
    certificates: [
      "Google Analytics Individual Qualification (GAIQ)",
      "HubSpot Inbound Marketing Certification"
    ]
  }
};

export default function RoadmapView({ selectedCareer, finalRoadmap, setExpertConsulted, sendMessage, setActiveTab }) {
  // Priority: use the AI-generated roadmap if available, else fall back to default
  const currentRoadmap = finalRoadmap 
    || (selectedCareer ? DEFAULT_ROADMAPS[selectedCareer] : null) 
    || DEFAULT_ROADMAPS["Kỹ sư Phần mềm"];

  // Normalize milestones to ensure subtasks exist
  const milestones = (currentRoadmap.milestones || []).map((m, idx) => {
    // If it's custom or generated, it might not have subtasks array. Let's build default ones if missing.
    if (!m.subtasks || m.subtasks.length === 0) {
      return {
        ...m,
        subtasks: [
          `Nghiên cứu lý thuyết và kiến thức nền tảng của ${m.phase || `bước ${idx+1}`}`,
          `Thực hành bài tập thực tế và làm quen công cụ liên quan`,
          `Hoàn thành sản phẩm/dự án nhỏ để tự đánh giá năng lực`
        ]
      };
    }
    return m;
  });

  // State Management
  const [completedSubtasks, setCompletedSubtasks] = useState({});
  const [milestoneNotes, setMilestoneNotes] = useState({});
  const [activeNoteIdx, setActiveNoteIdx] = useState(null);
  
  // Simulated file upload states
  const [uploadedCerts, setUploadedCerts] = useState([]);
  const [uploadedProjects, setUploadedProjects] = useState({}); // key: milestoneIdx
  const [isUploading, setIsUploading] = useState(null); // cert or milestoneIdx

  const [showRecreateInput, setShowRecreateInput] = useState(false);
  const [recreateFeedback, setRecreateFeedback] = useState('');

  // Mini chatbot popup states
  const [isMiniChatOpen, setIsMiniChatOpen] = useState(false);
  const [miniChatInput, setMiniChatInput] = useState('');
  const [isExpertTyping, setIsExpertTyping] = useState(false);
  const [miniChatHistory, setMiniChatHistory] = useState([]);

  const miniChatEndRef = useRef(null);

  // Sync welcome message on career change
  useEffect(() => {
    const career = currentRoadmap.careerName || 'Kỹ sư Phần mềm';
    let welcomeMsg = '';
    let expertName = 'Thầy Nguyễn Văn A';
    let title = 'Chuyên gia Công nghệ';
    
    if (career.toLowerCase().includes('phần mềm') || career.toLowerCase().includes('software')) {
      welcomeMsg = "Chào em! Thầy là Nguyễn Văn A, chuyên gia hướng nghiệp ngành CNTT. Thầy đã xem qua lộ trình Kỹ sư Phần mềm của em. Lộ trình thiết kế rất tốt, tuy nhiên thầy khuyên em ở Giai đoạn 2 nên tập trung học thêm về Git/GitHub nâng cao và Docker. Ở Giai đoạn 3, hãy bắt đầu nộp CV thực tập sớm từ tháng thứ 8 để cọ xát thực tế nhé. Em có câu hỏi gì cần thầy hỗ trợ thêm không?";
    } else if (career.toLowerCase().includes('marketing') || career.toLowerCase().includes('marketer')) {
      expertName = 'Thầy Trần Minh B';
      title = 'Chuyên gia Marketing';
      welcomeMsg = "Chào em! Thầy là Trần Minh B, chuyên gia hướng nghiệp ngành Digital Marketing. Thầy đã xem qua lộ trình Chuyên viên Marketing Số của em. Lộ trình rất chi tiết, nhưng thầy khuyên em nên tập trung thực hành chạy chiến dịch thực tế với ngân sách nhỏ ở Giai đoạn 2 và rèn luyện kỹ năng viết content SEO. Em có câu hỏi gì cần thầy hỗ trợ thêm không?";
    } else if (career.toLowerCase().includes('thiết kế') || career.toLowerCase().includes('designer') || career.toLowerCase().includes('ux/ui')) {
      expertName = 'Cô Lê Thị C';
      title = 'Chuyên gia UX/UI';
      welcomeMsg = "Chào em! Cô là Lê Thị C, chuyên gia hướng nghiệp ngành UX/UI Design. Cô đã xem qua lộ trình thiết kế của em. Lộ trình đi rất đúng hướng. Cô khuyên em nên chú trọng làm các dự án thực tế trên Figma để xây dựng Portfolio thật ấn tượng trong Giai đoạn 2 & 3. Em có câu hỏi nào cần cô giải đáp thêm không?";
    } else {
      welcomeMsg = `Chào em! Thầy đã xem qua lộ trình phát triển của em cho nghề ${career}. Lộ trình này rất hợp lý và đi từ nền tảng đến thực hành. Thầy khuyên em nên chú trọng xây dựng các sản phẩm thực tế để đưa vào Portfolio ở Giai đoạn 2. Em có câu hỏi gì cần thầy tư vấn thêm không?`;
    }
    setMiniChatHistory([
      {
        sender: 'user',
        text: 'Tư vấn với chuyên gia',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      { 
        sender: 'expert', 
        text: welcomeMsg, 
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        expertName,
        title
      }
    ]);
  }, [currentRoadmap.careerName]);

  // Scroll to bottom of mini-chat
  useEffect(() => {
    if (isMiniChatOpen) {
      setTimeout(() => {
        miniChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  }, [miniChatHistory, isExpertTyping, isMiniChatOpen]);

  // Handle sending message in mini-chat
  const handleSendMiniMessage = (e) => {
    e?.preventDefault();
    if (!miniChatInput.trim()) return;

    const userMsg = {
      sender: 'user',
      text: miniChatInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMiniChatHistory(prev => [...prev, userMsg]);
    const currentInput = miniChatInput;
    setMiniChatInput('');
    setIsExpertTyping(true);

    // Simulate expert response
    setTimeout(() => {
      let replyText = '';
      const lowerInput = currentInput.toLowerCase();
      const career = currentRoadmap.careerName || 'Kỹ sư Phần mềm';
      
      if (lowerInput.includes('lương') || lowerInput.includes('thu nhập') || lowerInput.includes('tiền')) {
        if (career.toLowerCase().includes('phần mềm') || career.toLowerCase().includes('software')) {
          replyText = "Với Kỹ sư Phần mềm ở Việt Nam, lương fresher mới ra trường dao động khoảng 10-18 triệu VNĐ. Sau 2-3 năm kinh nghiệm (Senior) có thể đạt 25-40 triệu VNĐ. Đặc biệt nếu em có ngoại ngữ tốt và làm cho công ty nước ngoài (remote hoặc onsite), thu nhập có thể đạt từ $2,000 đến $4,500/tháng đấy.";
        } else if (career.toLowerCase().includes('marketing') || career.toLowerCase().includes('marketer')) {
          replyText = "Ngành Digital Marketing có dải lương khá rộng. Mới ra trường (fresher) tầm 8-12 triệu VNĐ. Khi em có kinh nghiệm tối ưu chiến dịch (2-4 năm) lương sẽ từ 15-25 triệu VNĐ. Vị trí Manager trở lên có thể đạt 30-50 triệu VNĐ/tháng, tuỳ thuộc vào KPI doanh số em đem lại.";
        } else {
          replyText = "Mức lương của ngành này tại thị trường Việt Nam rất hứa hẹn, fresher từ 8-15 triệu VNĐ và tăng trưởng nhanh theo số năm kinh nghiệm thực tế của em.";
        }
      } else if (lowerInput.includes('chứng chỉ') || lowerInput.includes('bằng') || lowerInput.includes('certificate')) {
        if (career.toLowerCase().includes('phần mềm') || career.toLowerCase().includes('software')) {
          replyText = "Về chứng chỉ, em nên ưu tiên các chứng chỉ Cloud (AWS Certified Cloud Practitioner hoặc Developer Associate) vì xu hướng Cloud đang rất hot. Ngoài ra các chứng chỉ ngoại ngữ như TOEIC 750+ hoặc IELTS 6.5+ là lợi thế cực kỳ lớn khi ứng tuyển.";
        } else if (career.toLowerCase().includes('marketing') || career.toLowerCase().includes('marketer')) {
          replyText = "Em hãy thi lấy chứng chỉ Google Analytics (GAIQ), HubSpot Inbound Marketing, và Facebook Blueprint. Đây là những chứng chỉ miễn phí hoặc chi phí thấp nhưng được các Agency tuyển dụng đánh giá rất cao.";
        } else {
          replyText = "Em nên tập trung vào các chứng chỉ nghề nghiệp của Coursera (Google Professional Certificates) và chứng chỉ ngoại ngữ. Đó là minh chứng rõ nhất cho nỗ lực tự học của em.";
        }
      } else if (lowerInput.includes('thực tập') || lowerInput.includes('intern') || lowerInput.includes('xin việc')) {
        replyText = "Để xin thực tập thành công, điều cốt lõi là em phải có sản phẩm thực tế (Portfolio). Đừng chỉ ghi lý thuyết suông trong CV. Hãy đính kèm link GitHub (đối với code) hoặc link Figma (đối với design) hay các bản kế hoạch chạy campaign (đối với Marketing) để nhà tuyển dụng đánh giá năng lực thực hành của em.";
      } else if (lowerInput.includes('học ở đâu') || lowerInput.includes('khóa học') || lowerInput.includes('tài liệu')) {
        replyText = "Thầy khuyên em bám sát các khóa học ghi trong lộ trình (như Coursera, Udemy). Bên cạnh đó, các nguồn miễn phí như freeCodeCamp, W3Schools, các kênh YouTube chuyên ngành cũng rất tốt. Quan trọng là em phải tự code, tự làm dự án thực tế chứ không chỉ xem video lý thuyết.";
      } else {
        replyText = "Ý kiến/câu hỏi của em rất thực tế. Đối với ngành này, điều quan trọng nhất là tính kiên trì và tự học liên tục. Em hãy chia nhỏ lộ trình ra từng tuần và thực hiện đều đặn. Nếu gặp khó khăn ở giai đoạn nào, hãy nhắn tin trao đổi tiếp với thầy nhé!";
      }

      setMiniChatHistory(prev => [
        ...prev,
        {
          sender: 'expert',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsExpertTyping(false);
    }, 1500);
  };

  const certInputRef = useRef(null);
  const projectInputRefs = useRef({});

  // Calculations for progress
  const totalSubtasks = milestones.reduce((sum, m) => sum + m.subtasks.length, 0);
  const completedCount = Object.values(completedSubtasks).filter(Boolean).length;
  const progressPct = totalSubtasks > 0 ? Math.round((completedCount / totalSubtasks) * 100) : 0;

  // Toggle checklist
  const toggleSubtask = (mIdx, sIdx) => {
    const key = `${mIdx}-${sIdx}`;
    setCompletedSubtasks(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Generate ASCII progress bar
  const getAsciiProgressBar = (pct) => {
    const totalBlocks = 10;
    const filledBlocks = Math.round(pct / 10);
    const emptyBlocks = totalBlocks - filledBlocks;
    const filledStr = '█'.repeat(filledBlocks);
    const emptyStr = '░'.repeat(emptyBlocks);
    return `[${filledStr}${emptyStr}] ${pct}%`;
  };

  // Note updates
  const handleSaveNote = (idx, text) => {
    setMilestoneNotes(prev => ({
      ...prev,
      [idx]: text
    }));
    setActiveNoteIdx(null);
  };

  // Simulated Certificate Upload
  const handleCertUploadClick = () => {
    certInputRef.current?.click();
  };

  const handleCertFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading('cert');
    setTimeout(() => {
      setUploadedCerts(prev => [
        ...prev,
        {
          id: Date.now(),
          name: file.name,
          size: (file.size / 1024).toFixed(1) + ' KB',
          date: new Date().toLocaleDateString('vi-VN')
        }
      ]);
      setIsUploading(null);
    }, 1200);
  };

  const handleRemoveCert = (id) => {
    setUploadedCerts(prev => prev.filter(c => c.id !== id));
  };

  // Simulated Project Upload per Milestone
  const handleProjectUploadClick = (mIdx) => {
    projectInputRefs.current[mIdx]?.click();
  };

  const handleProjectFileChange = (mIdx, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(mIdx);
    setTimeout(() => {
      setUploadedProjects(prev => {
        const existing = prev[mIdx] || [];
        return {
          ...prev,
          [mIdx]: [
            ...existing,
            {
              id: Date.now(),
              name: file.name,
              size: (file.size / 1024).toFixed(1) + ' KB',
              date: new Date().toLocaleDateString('vi-VN')
            }
          ]
        };
      });
      setIsUploading(null);
    }, 1200);
  };

  const handleRemoveProject = (mIdx, pId) => {
    setUploadedProjects(prev => {
      const existing = prev[mIdx] || [];
      return {
        ...prev,
        [mIdx]: existing.filter(p => p.id !== pId)
      };
    });
  };

  const handlePrint = () => window.print();

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 md:p-8 max-w-4xl mx-auto my-6 print:border-none print:shadow-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
        <div>
          <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            {finalRoadmap ? 'Lộ trình cá nhân hóa' : 'Lộ trình học tập mẫu'}
          </span>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-2">
            {currentRoadmap.careerName}
          </h2>
        </div>
        <button
          onClick={handlePrint}
          className="no-print py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm hover:shadow flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          In lộ trình học tập
        </button>
      </div>

      <div className="space-y-8">
        
        {/* Tóm tắt */}
        <div className="bg-slate-50 dark:bg-slate-800/40 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1.5">Tổng quan nghề nghiệp</h3>
          <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
            {currentRoadmap.summary}
          </p>
        </div>

        {/* ASCII / Modern Interactive Progress Board */}
        <div className="bg-slate-950 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-inner no-print">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                TIẾN ĐỘ HỌC TẬP (LEARNING PROGRESS)
              </p>
              <p className="font-mono text-lg font-bold text-emerald-400">
                Progress {getAsciiProgressBar(progressPct)}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase font-semibold">Công việc hoàn thành</p>
                <p className="text-sm font-bold text-slate-200">{completedCount} / {totalSubtasks} Nhiệm vụ</p>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-slate-800 flex items-center justify-center text-sm font-black text-emerald-400 relative">
                <svg className="w-full h-full transform -rotate-90 absolute">
                  <circle
                    cx="20" cy="20" r="16"
                    className="stroke-slate-800 fill-none"
                    strokeWidth="4"
                  />
                  <circle
                    cx="20" cy="20" r="16"
                    className="stroke-emerald-500 fill-none transition-all duration-500"
                    strokeWidth="4"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - progressPct / 100)}`}
                    transform="translate(4,4)"
                  />
                </svg>
                <span className="z-10 text-[11px]">{progressPct}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Progress Checklist */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-5 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Nội dung lộ trình & Nhiệm vụ thực tế
          </h3>

          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 pl-6 space-y-8">
            {milestones.map((m, mIdx) => {
              const notes = milestoneNotes[mIdx] || '';
              const projects = uploadedProjects[mIdx] || [];
              const isWritingNote = activeNoteIdx === mIdx;

              // Calculate milestone completion rate
              const milestoneTotal = m.subtasks.length;
              const milestoneCompleted = m.subtasks.filter((_, sIdx) => completedSubtasks[`${mIdx}-${sIdx}`]).length;
              const isMilestoneDone = milestoneTotal > 0 && milestoneTotal === milestoneCompleted;

              return (
                <div key={mIdx} className="relative">
                  {/* Timeline indicator circle */}
                  <div className={`absolute -left-[33px] top-1.5 w-4 h-4 rounded-full border-4 transition-colors ${
                    isMilestoneDone
                      ? 'bg-emerald-500 border-emerald-100 dark:border-emerald-950'
                      : 'bg-primary-500 border-white dark:border-slate-900'
                  }`} />

                  <div className={`p-5 rounded-2xl border transition-all ${
                    isMilestoneDone
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/10 border-emerald-100 dark:border-emerald-900/30'
                      : 'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800/80'
                  }`}>
                    {/* Header */}
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <div>
                        <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
                          {m.phase}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {m.desc}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isMilestoneDone 
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}>
                        {milestoneCompleted}/{milestoneTotal}
                      </span>
                    </div>

                    {/* Sub-task checklist */}
                    <div className="space-y-2 mt-4 pl-1">
                      {m.subtasks.map((taskText, sIdx) => {
                        const done = completedSubtasks[`${mIdx}-${sIdx}`] || false;
                        return (
                          <div 
                            key={sIdx} 
                            onClick={() => toggleSubtask(mIdx, sIdx)}
                            className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-all ${
                              done 
                                ? 'bg-emerald-500/5 dark:bg-emerald-400/5 text-slate-500 dark:text-slate-400' 
                                : 'hover:bg-slate-100/50 dark:hover:bg-slate-800/30 text-slate-700 dark:text-slate-200'
                            }`}
                          >
                            <span className="mt-0.5 flex-shrink-0">
                              {done ? (
                                <CheckSquare className="w-4 h-4 text-emerald-500" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </span>
                            <span className={`text-xs ${done ? 'line-through opacity-70' : 'font-medium'}`}>
                              {taskText}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* interactive features for notes & projects */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3.5 no-print">
                      
                      {/* Notes Section */}
                      <div>
                        {isWritingNote ? (
                          <div className="space-y-2">
                            <textarea
                              defaultValue={notes}
                              id={`textarea-${mIdx}`}
                              placeholder="Nhập ghi chú học tập, tài liệu tham khảo, liên kết tự học..."
                              className="w-full text-xs p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
                              rows="3"
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => setActiveNoteIdx(null)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-semibold"
                              >
                                Hủy
                              </button>
                              <button
                                onClick={() => {
                                  const text = document.getElementById(`textarea-${mIdx}`)?.value || '';
                                  handleSaveNote(mIdx, text);
                                }}
                                className="px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                              >
                                <Save className="w-3.5 h-3.5" />
                                Lưu ghi chú
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {notes ? (
                              <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/30 rounded-xl p-3 text-xs text-slate-600 dark:text-slate-300 relative group">
                                <p className="font-semibold text-[10px] text-amber-700 dark:text-amber-400 mb-1 uppercase tracking-wider">📝 Ghi chú cá nhân</p>
                                <p className="whitespace-pre-line">{notes}</p>
                                <button
                                  onClick={() => setActiveNoteIdx(mIdx)}
                                  className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setActiveNoteIdx(mIdx)}
                                className="w-fit text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 font-medium transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                                Thêm ghi chú học tập
                              </button>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Project Upload Section */}
                      <div className="space-y-2">
                        {projects.length > 0 && (
                          <div className="space-y-1.5">
                            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                              📁 Sản phẩm & Dự án hoàn thành
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {projects.map(p => (
                                <div key={p.id} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between items-center text-xs shadow-sm">
                                  <div className="min-w-0">
                                    <p className="font-medium text-slate-700 dark:text-slate-200 truncate flex items-center gap-1.5">
                                      <FileText className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                                      {p.name}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{p.size} · {p.date}</p>
                                  </div>
                                  <button
                                    onClick={() => handleRemoveProject(mIdx, p.id)}
                                    className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all ml-2"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <input
                          type="file"
                          ref={el => projectInputRefs.current[mIdx] = el}
                          onChange={(e) => handleProjectFileChange(mIdx, e)}
                          className="hidden"
                        />
                        <button
                          onClick={() => handleProjectUploadClick(mIdx)}
                          disabled={isUploading === mIdx}
                          className="w-fit text-xs text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50"
                        >
                          <UploadCloud className="w-3.5 h-3.5" />
                          {isUploading === mIdx ? 'Đang tải lên...' : 'Tải lên sản phẩm thực hành / source code'}
                        </button>
                      </div>

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Khóa học đề xuất */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary-500" />
            Khóa học đề xuất
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentRoadmap.courses.map((course, idx) => (
              <div key={idx} className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center group hover:border-primary-200 dark:hover:border-primary-700 transition-colors cursor-pointer">
                <div>
                  <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {course.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-1">{course.provider}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Chứng chỉ uy tín + upload */}
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary-500" />
            Chứng chỉ nghề nghiệp đề xuất
          </h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {currentRoadmap.certificates.map((cert, idx) => (
              <span key={idx} className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                {cert}
              </span>
            ))}
          </div>

          {/* Certificates upload list */}
          <div className="bg-slate-50 dark:bg-slate-800/20 rounded-xl p-4 border border-slate-100 dark:border-slate-800 no-print">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Chứng chỉ cá nhân của bạn</span>
              <input
                type="file"
                ref={certInputRef}
                onChange={handleCertFileChange}
                className="hidden"
                accept=".pdf,.png,.jpg,.jpeg"
              />
              <button
                onClick={handleCertUploadClick}
                disabled={isUploading === 'cert'}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                {isUploading === 'cert' ? 'Đang tải lên...' : 'Tải lên chứng chỉ'}
              </button>
            </div>

            {uploadedCerts.length > 0 ? (
              <div className="space-y-2">
                {uploadedCerts.map(cert => (
                  <div key={cert.id} className="p-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl flex items-center justify-between text-xs shadow-sm">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500 flex-shrink-0">
                        <Check className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800 dark:text-slate-200 truncate">{cert.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Kích thước: {cert.size} · Ngày tải: {cert.date}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveCert(cert.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-all ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center">
                <Award className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Bạn chưa tải lên chứng chỉ nào</p>
              </div>
            )}
          </div>

        </div>

        {/* Recreate Roadmap Input Area */}
        {showRecreateInput && (
          <div className="mt-4 p-4 bg-sky-50/50 dark:bg-sky-950/15 border border-sky-100 dark:border-sky-900/30 rounded-xl space-y-3 no-print animate-fade-in">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <label className="block text-xs font-bold text-sky-800 dark:text-sky-300">
                Bạn muốn chỉnh sửa lộ trình này như thế nào?
              </label>
            </div>
            <textarea
              value={recreateFeedback}
              onChange={(e) => setRecreateFeedback(e.target.value)}
              placeholder="Ví dụ: Tôi muốn bổ sung thêm các khoá học tiếng Anh giao tiếp ở giai đoạn 1, hoặc đổi qua học Python thay vì Javascript..."
              className="w-full p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-sky-500 focus:outline-none placeholder:text-slate-400 min-h-[80px]"
            />
            <div className="flex justify-end gap-2 text-xs font-semibold">
              <button
                onClick={() => {
                  setShowRecreateInput(false);
                  setRecreateFeedback('');
                }}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (!recreateFeedback.trim()) return;
                  if (sendMessage) sendMessage(`Tôi muốn điều chỉnh lộ trình: ${recreateFeedback}`);
                  if (setActiveTab) setActiveTab('assistant');
                  setShowRecreateInput(false);
                  setRecreateFeedback('');
                }}
                className="px-4 py-2 bg-gradient-to-r from-sky-600 to-primary-600 hover:from-sky-700 hover:to-primary-700 text-white rounded-lg transition-all flex items-center gap-1.5 shadow-md shadow-sky-500/10 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                Gửi yêu cầu tạo lại
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row gap-3 no-print">
          <button
            onClick={() => setShowRecreateInput(prev => !prev)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border hover:scale-[1.01] active:scale-[0.98] ${
              showRecreateInput
                ? 'bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-800'
                : 'bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800/80 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" />
            Tạo lại lộ trình (AI)
          </button>
        </div>
      </div>

      {/* Floating Chatbot Button — rendered via portal to bypass parent transform/overflow */}
      {!isMiniChatOpen && createPortal(
        <div
          onClick={() => setIsMiniChatOpen(true)}
          className="fixed bottom-6 right-6 flex items-center gap-3 z-50 group no-print cursor-pointer animate-fade-in"
        >
          <div className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-extrabold px-3.5 py-2.5 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-all duration-300 hover:scale-105 select-none hover:shadow-2xl">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Kết nối chuyên gia
          </div>
          <button className="w-14 h-14 bg-gradient-to-tr from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white dark:border-slate-800">
            <div className="relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800 animate-ping"></span>
              <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </div>
          </button>
        </div>,
        document.body
      )}

      {/* Mini Chatbot Popup Widget */}
      {isMiniChatOpen && createPortal(
        <div className="fixed bottom-6 right-6 w-[360px] h-[480px] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col z-[9999] overflow-hidden animate-fade-in no-print">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm border border-white/10">
                💬
              </div>
              <div>
                <h4 className="font-bold text-xs leading-none">
                  {miniChatHistory.find(m => m.expertName)?.expertName || 'Chuyên gia Hướng nghiệp'}
                </h4>
                <span className="text-[9px] text-emerald-100 flex items-center gap-1 mt-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  {miniChatHistory.find(m => m.title)?.title || 'Chuyên gia'} · Đang trực tuyến
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsMiniChatOpen(false)}
              className="p-1 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 dark:bg-slate-950">
            {miniChatHistory.map((msg, idx) => {
              const isExpert = msg.sender === 'expert';
              const delayMs = Math.min(idx, 6) * 60;
              return (
                <div
                  key={idx}
                  className={`flex flex-col ${isExpert ? 'items-start msg-ai' : 'items-end msg-user'}`}
                  style={{ animationDelay: `${delayMs}ms` }}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      isExpert
                        ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm'
                        : 'bg-emerald-600 text-white rounded-tr-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-400 dark:text-slate-500 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              );
            })}
            
            {isExpertTyping && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 p-3 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={miniChatEndRef} />
          </div>

          {/* Footer Input */}
          <form onSubmit={handleSendMiniMessage} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-150 dark:border-slate-800 flex items-center gap-2 flex-shrink-0">
            <input
              type="text"
              value={miniChatInput}
              onChange={(e) => setMiniChatInput(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!miniChatInput.trim() || isExpertTyping}
              className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>,
        document.body
      )}
    </div>
  );
}

