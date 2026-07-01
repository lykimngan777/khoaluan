import React, { useRef, useEffect, useState } from 'react';
import { Sliders, Brain, Briefcase, ChevronRight, CheckCircle, Users, Target, Star, Sparkles } from 'lucide-react';
import MessageBubble from './MessageBubble';
import QuickReplies from './QuickReplies';

const CRITERIA_QUESTIONS = {
  "Mức thu nhập": {
    question: "Mức thu nhập tối thiểu bạn mong muốn hàng tháng là bao nhiêu?",
    options: [
      "Dưới 15 triệu VNĐ",
      "Từ 15 - 25 triệu VNĐ",
      "Từ 25 - 40 triệu VNĐ",
      "Trên 40 triệu VNĐ"
    ]
  },
  "Thời gian đào tạo": {
    question: "Thời gian đào tạo/học tập tối đa mà bạn có thể đầu tư trước khi đi làm là bao lâu?",
    options: [
      "Ngắn hạn (dưới 6 tháng - học nghề, chứng chỉ ngắn hạn)",
      "Trung hạn (1 - 2 năm - cao đẳng, học nghề chuyên sâu)",
      "Dài hạn (3 - 5 năm - đại học, thạc sĩ)",
      "Dài hạn đặc biệt (trên 5 năm - y khoa, nghiên cứu sâu)"
    ]
  },
  "Yêu cầu thể chất": {
    question: "Yêu cầu/Khả năng đáp ứng về thể chất của bạn đối với công việc là gì?",
    options: [
      "Chỉ làm việc nhẹ nhàng, văn phòng ngồi bàn máy tính",
      "Làm việc di chuyển nhiều, đứng lâu hoặc đi thực địa",
      "Làm việc chân tay nặng nhọc, yêu cầu sức khoẻ bền bỉ"
    ]
  },
  "Kỹ năng đặc thù (Toán học, ...)": {
    question: "Kỹ năng đặc thù nổi trội nhất của bạn hoặc yêu cầu công việc bạn muốn hướng tới?",
    options: [
      "Tư duy toán học, tính toán số liệu và logic cao",
      "Năng khiếu nghệ thuật, hội họa, thiết kế hình ảnh",
      "Sử dụng ngôn từ, viết lách, hùng biện hoặc ngoại ngữ xuất sắc"
    ]
  },
  "Sáng tạo": {
    question: "Bạn muốn thể hiện tính sáng tạo ở mức độ nào trong công việc?",
    options: [
      "Tự do sáng tạo hoàn toàn, tự phát triển ý tưởng mới",
      "Sáng tạo trong khuôn khổ, cải tiến quy trình có sẵn",
      "Chỉ cần giải quyết vấn đề thực tế, không cần đổi mới nhiều"
    ]
  },
  "Ít áp lực": {
    question: "Mức độ chịu áp lực tiến độ (deadline) và OT của bạn như thế nào?",
    options: [
      "Làm việc giờ hành chính cố định, không OT, áp lực thấp",
      "Có thể chịu áp lực vừa phải vào thời điểm dự án cao điểm",
      "Sẵn sàng chịu áp lực cao nếu đi kèm đãi ngộ tương xứng"
    ]
  },
  "Linh hoạt": {
    question: "Bạn mong muốn một chế độ làm việc linh hoạt như thế nào?",
    options: [
      "Làm việc từ xa (Remote) hoặc Hybrid (kết hợp)",
      "Giờ giấc tự do, đo lường bằng kết quả công việc",
      "Làm việc tại văn phòng cố định nhưng linh động đổi ca"
    ]
  },
  "Công nghệ": {
    question: "Mức độ tiếp cận và sử dụng công nghệ trong công việc bạn mong muốn?",
    options: [
      "Lập trình, nghiên cứu công nghệ lõi mới (AI, Blockchain...)",
      "Sử dụng công nghệ/phần mềm hiện đại làm công cụ làm việc",
      "Ít sử dụng kỹ thuật phức tạp, chủ yếu tương tác thủ công/giao tiếp"
    ]
  },
  "Giao tiếp": {
    question: "Tần suất và vai trò giao tiếp trong công việc bạn hướng tới là gì?",
    options: [
      "Làm việc nhóm liên tục, giao lưu khách hàng, thuyết trình",
      "Giao tiếp nội bộ vừa phải, tập trung làm việc độc lập",
      "Hạn chế tối đa hội họp, chỉ làm việc qua báo cáo/task"
    ]
  },
  "Kỹ thuật": {
    question: "Bạn mong muốn làm việc với máy móc, thiết bị hay hệ thống kỹ thuật nào?",
    options: [
      "Lắp ráp, vận hành máy móc cơ khí, thiết bị phần cứng",
      "Quản lý hệ thống kỹ thuật số, lập trình phần mềm",
      "Thiết kế, vẽ kỹ thuật hoặc quản lý chất lượng quy trình"
    ]
  },
  "Nghiên cứu": {
    question: "Bạn thích loại hình nghiên cứu, tìm tòi thông tin như thế nào?",
    options: [
      "Nghiên cứu khoa học, phân tích học thuật hàn lâm sâu sắc",
      "Phân tích dữ liệu thực tế, nghiên cứu thị trường kinh doanh",
      "Tìm hiểu thông tin nhanh để áp dụng ngay vào dự án thực tế"
    ]
  },
  "Xã hội": {
    question: "Bạn muốn công việc đóng góp giá trị như thế nào cho cộng đồng/xã hội?",
    options: [
      "Giảng dạy, tư vấn tâm lý, hỗ trợ trực tiếp từng cá nhân",
      "Tổ chức hoạt động xã hội, sự kiện cộng đồng phi lợi nhuận",
      "Tạo ra các sản phẩm/dịch vụ gián tiếp phục vụ đời sống"
    ]
  },
  "Kinh doanh": {
    question: "Mức độ trực tiếp tham gia hoạt động thương mại/doanh thu mà bạn hướng tới?",
    options: [
      "Trực tiếp bán hàng (Sales), thương lượng hợp đồng mang về doanh số",
      "Lập kế hoạch chiến lược phát triển kinh doanh, quản trị vận hành",
      "Hỗ trợ gián tiếp (Back-office, nhân sự, kế toán)"
    ]
  },
  "Khởi nghiệp": {
    question: "Bạn hứng thú thế nào với tinh thần khởi nghiệp và chấp nhận rủi ro?",
    options: [
      "Muốn tự xây dựng doanh nghiệp riêng, tự làm chủ tài chính",
      "Muốn làm việc trong công ty khởi nghiệp trẻ (Start-up) năng động",
      "Thích làm việc ở doanh nghiệp lớn, quy trình chuẩn chỉnh và an toàn"
    ]
  },
  "Môi trường quốc tế": {
    question: "Bạn mong muốn sử dụng ngoại ngữ và làm việc với đối tác nước ngoài thế nào?",
    options: [
      "Làm việc hoàn toàn bằng tiếng Anh/ngoại ngữ với đồng nghiệp quốc tế",
      "Làm việc ở công ty Việt Nam có đối tác/khách hàng quốc tế",
      "Làm việc chủ yếu với đồng nghiệp và thị trường nội địa"
    ]
  },
  "Ổn định": {
    question: "Bạn định nghĩa sự ổn định công việc thế nào là phù hợp nhất?",
    options: [
      "Làm việc lâu dài ở một tổ chức lớn, ít thay đổi vị trí",
      "Thu nhập ổn định hàng tháng, chế độ bảo hiểm phúc lợi đầy đủ",
      "Có thể thay đổi công việc linh hoạt nhưng cần sự bền vững của ngành nghề"
    ]
  }
};

export default function ChatWindow({
  stage,
  setStage,
  subStage,
  setSubStage,
  history,
  sendMessage,
  isLoading,
  selectedCriteria,
  setSelectedCriteria,
  shortlistedCareers,
  setShortlistedCareers,
  userProposedCareers,
  setSelectedCareer,
  selectedCareer,
  profileInfo,
  setProfileInfo,
  expertConsulted,
  setExpertConsulted,
  updateSession,
  setActiveTab
}) {
  const [careerInputText, setCareerInputText] = useState('');
  const [interestScores, setInterestScores] = useState({});
  const [isWizardCollapsed, setIsWizardCollapsed] = useState(false);
  const [isQuestionnaireMode, setIsQuestionnaireMode] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [questionnaireAnswers, setQuestionnaireAnswers] = useState({});
  const messagesEndRef = useRef(null);
  const lastAIMessageRef = useRef(null);

  useEffect(() => {
    if (userProposedCareers && userProposedCareers.length > 0) {
      setShortlistedCareers(prev => {
        const combined = [...new Set([...prev, ...userProposedCareers])];
        return combined.slice(0, 5);
      });
    }
  }, [userProposedCareers, setShortlistedCareers]);

  useEffect(() => {
    if (subStage === 'CHOICE_SELECTION' && !selectedCareer) {
      const list = shortlistedCareers.length > 0 ? shortlistedCareers : ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];
      setSelectedCareer(list[0]);
    }
  }, [subStage, shortlistedCareers, selectedCareer, setSelectedCareer]);

  const [criteriaScores, setCriteriaScores] = useState(() => {
    const initial = {};
    if (selectedCriteria) {
      selectedCriteria.forEach(item => {
        initial[item] = 5;
      });
    }
    return initial;
  });

  useEffect(() => {
    setCriteriaScores(prev => {
      const updated = { ...prev };
      selectedCriteria.forEach(item => {
        if (updated[item] === undefined) {
          updated[item] = 5;
        }
      });
      Object.keys(updated).forEach(item => {
        if (!selectedCriteria.includes(item)) {
          delete updated[item];
        }
      });
      return updated;
    });
  }, [selectedCriteria]);

  const filteredHistory = history.filter(msg => {
    const msgStage = msg.stage || 'PRESCREENING';
    const currentGroup = stage === 'COMPLETED' ? 'CHOICE' : stage;
    const msgGroup = msgStage === 'COMPLETED' ? 'CHOICE' : msgStage;
    return msgGroup === currentGroup;
  });

  const renderEmptyHistoryPlaceholder = () => {
    let welcomeTitle = "Bắt đầu buổi tư vấn CareerAI";
    let welcomeDesc = "Trợ lý AI sẽ dẫn dắt bạn qua 3 giai đoạn của mô hình hướng nghiệp PIC.";
    let welcomeTip = "Sử dụng bảng điều khiển bên dưới để bắt đầu ↓";

    if (stage === 'IN_DEPTH') {
      welcomeTitle = "Giai đoạn 2: Khám phá chuyên sâu (In-depth)";
      welcomeDesc = "Tại đây, CareerAI sẽ cùng bạn đi sâu nghiên cứu xu hướng, mức lương, khoảng cách năng lực và ưu/nhược điểm của từng ngành nghề rút gọn.";
      welcomeTip = "Bấm nút 'Xem phân tích chuyên sâu' bên dưới để bắt đầu khám phá ↓";
    } else if (stage === 'CHOICE' || stage === 'COMPLETED') {
      welcomeTitle = "Giai đoạn 3: Lựa chọn lộ trình (Choice)";
      welcomeDesc = "Chúng ta sẽ tiến hành so sánh các ngành nghề qua Ma trận quyết định để chọn ra 1 nghề mục tiêu tối ưu, từ đó xây dựng lộ trình học tập 6-12 tháng.";
      welcomeTip = "Lựa chọn nghề nghiệp mục tiêu của bạn bên dưới ↓";
    }

    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-lg mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary-500 to-sky-400 text-white flex items-center justify-center mb-6 shadow-lg shadow-primary-500/20">
          <Brain className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">{welcomeTitle}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-2">
          {welcomeDesc}
        </p>
        <p className="text-xs text-slate-400 dark:text-slate-500">{welcomeTip}</p>
      </div>
    );
  };

  const availableCriteria = [
    "Mức thu nhập", "Thời gian đào tạo", "Yêu cầu thể chất", "Kỹ năng đặc thù (Toán học, ...)",
    "Sáng tạo", "Ít áp lực", "Linh hoạt", "Công nghệ", "Giao tiếp",
    "Kỹ thuật", "Nghiên cứu", "Xã hội", "Kinh doanh", "Khởi nghiệp",
    "Môi trường quốc tế", "Ổn định"
  ];

  const suggestedCareers = [
    "Kỹ sư Phần mềm", "Digital Marketer", "UX/UI Designer",
    "Data Analyst", "Product Manager", "Chuyên viên AI/ML",
    "Kỹ sư Điện tử", "Nhà Báo Truyền thông"
  ];


  const selectQuickReply = (reply) => {
    sendMessage(reply);
  };

  const toggleCriteria = (item) => {
    if (selectedCriteria.includes(item)) {
      setSelectedCriteria(selectedCriteria.filter(x => x !== item));
    } else {
      setSelectedCriteria([...selectedCriteria, item]);
    }
  };

  const moveCriteria = (index, direction) => {
    const updated = [...selectedCriteria];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    
    // Swap items
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    
    setSelectedCriteria(updated);
  };

  const sortCriteriaByScore = () => {
    const sorted = [...selectedCriteria].sort((a, b) => {
      const scoreA = criteriaScores[a] || 5;
      const scoreB = criteriaScores[b] || 5;
      return scoreB - scoreA;
    });
    setSelectedCriteria(sorted);
  };

  const handleSliderChange = (item, value) => {
    setCriteriaScores(prev => ({ ...prev, [item]: value }));
  };

  const handleSliderRelease = (item, finalValue) => {
    setCriteriaScores(prevScores => {
      const nextScores = { ...prevScores, [item]: finalValue };
      setSelectedCriteria(prevSelected => {
        const sorted = [...prevSelected].sort((a, b) => {
          const scoreA = nextScores[a] || 5;
          const scoreB = nextScores[b] || 5;
          return scoreB - scoreA;
        });
        return sorted;
      });
      return nextScores;
    });
  };

  // General similarity check helper
  const isSimilarCareer = (c1, c2) => {
    if (!c1 || !c2) return false;
    const cleanStr = (s) => s.toLowerCase()
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
      
    const n1 = cleanStr(c1);
    const n2 = cleanStr(c2);
    if (n1 === n2) return true;
    if (n1.includes(n2) || n2.includes(n1)) return true;
    
    const w1 = n1.split(' ').filter(Boolean);
    const w2 = n2.split(' ').filter(Boolean);
    const common = w1.filter(w => w2.includes(w));
    if (common.length >= 2 && (common.length >= w1.length - 1 || common.length >= w2.length - 1)) {
      return true;
    }
    return false;
  };

  const toggleCareer = (career) => {
    const similarSelected = shortlistedCareers.find(c => isSimilarCareer(c, career));
    if (similarSelected) {
      setShortlistedCareers(shortlistedCareers.filter(c => !isSimilarCareer(c, career)));
    } else {
      if (shortlistedCareers.length >= 5) return;
      setShortlistedCareers([...shortlistedCareers, career]);
    }
  };

  useEffect(() => {
    if (isLoading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      if (lastAIMessageRef.current) {
        lastAIMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [history, isLoading]);

  // --- Stage label helper ---
  const getStageLabel = () => {
    if (stage === 'PRESCREENING') return 'Giai đoạn 1: Sàng lọc tiêu chí';
    if (stage === 'IN_DEPTH') return 'Giai đoạn 2: Khám phá chuyên sâu';
    if (stage === 'CHOICE') return 'Giai đoạn 3: Lựa chọn lộ trình';
    if (stage === 'COMPLETED') return '✅ Hoàn tất tư vấn';
    return 'Tư vấn Hướng nghiệp PIC';
  };

  // ============================================================
  //  STEP WIZARD PANELS — rendered below message stream
  // ============================================================

  // 1. WELCOME — classification buttons
  const renderWelcomeWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary-500" />
        Hãy chọn điểm khởi đầu của bạn:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => sendMessage('Đã có danh sách nghề quan tâm rồi')}
          className="flex items-center gap-3 p-4 rounded-xl border-2 border-sky-200 dark:border-sky-700 bg-sky-50 dark:bg-sky-950/30 hover:border-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-sky-700 dark:text-sky-300 transition-all text-sm font-medium group"
        >
          <CheckCircle className="w-5 h-5 text-sky-500 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Đã có danh sách nghề</div>
            <div className="text-xs text-sky-500 mt-0.5">Tôi biết mình muốn gì</div>
          </div>
        </button>
        <button
          onClick={() => sendMessage('Chưa có, cần AI hỗ trợ phân tích')}
          className="flex items-center gap-3 p-4 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 hover:border-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 text-amber-700 dark:text-amber-300 transition-all text-sm font-medium group"
        >
          <Brain className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" />
          <div className="text-left">
            <div className="font-semibold">Chưa có, AI giúp tôi</div>
            <div className="text-xs text-amber-500 mt-0.5">Tôi cần định hướng từ đầu</div>
          </div>
        </button>
      </div>
    </div>
  );

  // 2. LISTING_CAREERS — input with validation
  const renderCareerListingWizard = () => {
    const currentList = careerInputText.split(/[,;\n]/).map(c => c.trim()).filter(c => c.length > 0);
    const isValid = currentList.length >= 1 && currentList.length <= 3;
    return (
      <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-primary-500" />
          Liệt kê 3 nghề nghiệp bạn quan tâm:
        </p>
        <textarea
          value={careerInputText}
          onChange={(e) => setCareerInputText(e.target.value)}
          placeholder="Ví dụ: Kỹ sư Phần mềm, Data Analyst, UX Designer"
          rows={3}
          className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100 resize-none"
        />
        <div className="flex items-center justify-between">
          <span className={`text-xs font-medium ${isValid ? 'text-emerald-500' : 'text-amber-500'}`}>
            {currentList.length > 3 
              ? `⚠️ Vượt quá số lượng cho phép (tối đa 3 nghề)` 
              : currentList.length > 0 
                ? `✅ Đã chọn ${currentList.length}/3 nghề`
                : ''}
          </span>
          <button
            disabled={!isValid}
            onClick={() => { sendMessage(careerInputText); setCareerInputText(''); }}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            Gửi danh sách <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {/* Also offer quick-select chips */}
        <div>
          <p className="text-xs text-slate-400 mb-2">Chọn nhanh:</p>
          <div className="flex flex-wrap gap-1.5">
            {suggestedCareers.map(career => {
              const selected = currentList.includes(career);
              const disabled = !selected && currentList.length >= 3;
              return (
                <button
                  key={career}
                  disabled={disabled}
                  onClick={() => {
                    const current = careerInputText ? careerInputText.split(',').map(c => c.trim()).filter(Boolean) : [];
                    if (!current.includes(career)) {
                      setCareerInputText([...current, career].join(', '));
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg transition-colors border ${
                    selected 
                      ? 'bg-primary-50 border-primary-300 text-primary-600 dark:bg-primary-950/20'
                      : disabled
                        ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  + {career}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // 3. PROFILE_GATHERING — multi-field form
  const renderProfileForm = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary-500" />
        Cung cấp thông tin để AI phân tích hồ sơ của bạn:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Sở thích cá nhân cốt lõi</label>
          <input
            value={profileInfo?.interests || ''}
            onChange={e => setProfileInfo(p => ({ ...p, interests: e.target.value }))}
            placeholder="VD: Lập trình, Vẽ tranh, Đọc sách..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Ngành học / Trình độ</label>
          <input
            value={profileInfo?.academic || ''}
            onChange={e => setProfileInfo(p => ({ ...p, academic: e.target.value }))}
            placeholder="VD: Sinh viên CNTT năm 3, Học sinh THPT..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Năng lực cá nhân (Sự sáng tạo, kỹ thuật...)</label>
          <input
            value={profileInfo?.capabilities || ''}
            onChange={e => setProfileInfo(p => ({ ...p, capabilities: e.target.value }))}
            placeholder="VD: Sáng tạo nội dung, Kỹ năng lập trình Python..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Mục tiêu nghề nghiệp</label>
          <input
            value={profileInfo?.goals || ''}
            onChange={e => setProfileInfo(p => ({ ...p, goals: e.target.value }))}
            placeholder="VD: Thu nhập 20tr+, làm việc tại TP.HCM..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Học lực / Kinh nghiệm</label>
          <input
            value={profileInfo?.experience || ''}
            onChange={e => setProfileInfo(p => ({ ...p, experience: e.target.value }))}
            placeholder="VD: Học lực Giỏi (GPA 3.5), có 6 tháng làm CTV Marketing..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-red-500 dark:text-red-400 mb-1">Những rào cản / hạn chế khách quan (VD: khuyết tật, sức khỏe, địa lý... Điền 'Không' nếu không có)</label>
          <input
            value={profileInfo?.barriers || ''}
            onChange={e => setProfileInfo(p => ({ ...p, barriers: e.target.value }))}
            placeholder="VD: Không có xe máy đi lại xa, Không thể đứng làm việc quá lâu, Hoặc điền 'Không'..."
            className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100"
          />
        </div>
      </div>
      <button
        disabled={
          !profileInfo?.interests?.trim() || 
          !profileInfo?.academic?.trim() || 
          !profileInfo?.capabilities?.trim() || 
          !profileInfo?.experience?.trim() || 
          !profileInfo?.goals?.trim() ||
          !profileInfo?.barriers?.trim()
        }
        onClick={() => {
          const summary = `Sở thích cá nhân cốt lõi: ${profileInfo?.interests || 'N/A'}. Ngành học/Trình độ: ${profileInfo?.academic || 'N/A'}. Năng lực cá nhân (Sáng tạo/Kỹ thuật): ${profileInfo?.capabilities || 'N/A'}. Học lực/Kinh nghiệm: ${profileInfo?.experience || 'N/A'}. Rào cản/Hạn chế khách quan: ${profileInfo?.barriers || 'N/A'}. Mục tiêu nghề nghiệp: ${profileInfo?.goals || 'N/A'}.`;
          sendMessage(summary);
        }}
        className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        Gửi hồ sơ cá nhân <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  // 4.1. Questionnaire Wizard sub-view
  const renderQuestionnaireView = () => {
    const currentCriteria = selectedCriteria[currentQuestionIdx];
    const qData = CRITERIA_QUESTIONS[currentCriteria] || { question: "Câu hỏi cho tiêu chí " + currentCriteria, options: [] };
    const currentAnswer = questionnaireAnswers[currentCriteria] || { selectedOption: '', customText: '', isCustom: false };
    
    const isAnswered = 
      (currentAnswer.selectedOption && currentAnswer.selectedOption !== 'custom') ||
      (currentAnswer.selectedOption === 'custom' && currentAnswer.customText?.trim());

    const handleSelectOption = (opt) => {
      setQuestionnaireAnswers(prev => ({
        ...prev,
        [currentCriteria]: {
          selectedOption: opt,
          customText: prev[currentCriteria]?.customText || '',
          isCustom: false
        }
      }));
    };

    const handleCustomTextChange = (text) => {
      setQuestionnaireAnswers(prev => ({
        ...prev,
        [currentCriteria]: {
          selectedOption: 'custom',
          customText: text,
          isCustom: true
        }
      }));
    };

    const isLast = currentQuestionIdx === selectedCriteria.length - 1;

    const handleNext = () => {
      if (isLast) {
        const compiledLines = selectedCriteria.map(item => {
          const score = criteriaScores[item] || 5;
          const ans = questionnaireAnswers[item];
          let detail = "N/A";
          if (ans) {
            detail = ans.selectedOption === 'custom' ? ans.customText : ans.selectedOption;
          }
          return `• **${item}** (Mức độ quan trọng: ${score}/10): ${detail}`;
        });
        
        const summaryMessage = `Đã hoàn thành khảo sát tiêu chí:\n\n${compiledLines.join('\n')}`;
        sendMessage(summaryMessage);
        
        // Reset states
        setIsQuestionnaireMode(false);
        setCurrentQuestionIdx(0);
        setQuestionnaireAnswers({});
      } else {
        setCurrentQuestionIdx(prev => prev + 1);
      }
    };

    const handleBack = () => {
      if (currentQuestionIdx === 0) {
        setIsQuestionnaireMode(false);
      } else {
        setCurrentQuestionIdx(prev => prev - 1);
      }
    };

    const progressPercent = Math.round(((currentQuestionIdx + 1) / selectedCriteria.length) * 100);

    return (
      <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        {/* Progress header */}
        <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-2">
          <span>Khảo sát chi tiết tiêu chí ({currentQuestionIdx + 1}/{selectedCriteria.length})</span>
          <span className="text-primary-500">{progressPercent}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-primary-500 transition-all duration-300" style={{ width: `${progressPercent}%` }} />
        </div>

        {/* Question body */}
        <div className="space-y-2">
          <h4 className="text-xs md:text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
            Tiêu chí: <span className="text-primary-600 dark:text-primary-400">{currentCriteria}</span>
          </h4>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-semibold">
            {qData.question}
          </p>

          {/* Options */}
          <div className="space-y-2 pt-1 max-h-60 overflow-y-auto pr-1">
            {qData.options.map((opt, oIdx) => {
              const selected = currentAnswer.selectedOption === opt;
              return (
                <div
                  key={oIdx}
                  onClick={() => handleSelectOption(opt)}
                  className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                    selected
                      ? 'bg-primary-50 border-primary-400 text-primary-700 dark:bg-primary-950/20 dark:border-primary-800 dark:text-primary-400 font-semibold'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${currentCriteria}`}
                    checked={selected}
                    onChange={() => {}} // handled by div click
                    className="mt-0.5 text-primary-600 focus:ring-primary-500"
                  />
                  <span>{opt}</span>
                </div>
              );
            })}

            {/* Custom option */}
            <div
              className={`w-full p-2.5 rounded-xl border text-xs transition-all ${
                currentAnswer.selectedOption === 'custom'
                  ? 'bg-primary-50 border-primary-400 dark:bg-primary-950/20 dark:border-primary-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
              }`}
            >
              <div 
                className="flex items-start gap-2.5 cursor-pointer mb-2"
                onClick={() => {
                  if (currentAnswer.selectedOption !== 'custom') {
                    setQuestionnaireAnswers(prev => ({
                      ...prev,
                      [currentCriteria]: {
                        selectedOption: 'custom',
                        customText: currentAnswer.customText || '',
                        isCustom: true
                      }
                    }));
                  }
                }}
              >
                <input
                  type="radio"
                  name={`q-${currentCriteria}`}
                  checked={currentAnswer.selectedOption === 'custom'}
                  onChange={() => {}}
                  className="mt-0.5 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">Ý kiến khác (Tự điền đáp án):</span>
              </div>

              {currentAnswer.selectedOption === 'custom' && (
                <textarea
                  value={currentAnswer.customText}
                  onChange={(e) => handleCustomTextChange(e.target.value)}
                  placeholder="Nhập câu trả lời cụ thể của bạn tại đây..."
                  rows={2}
                  className="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-slate-800 dark:text-slate-100 resize-none"
                />
              )}
            </div>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-all active:scale-95"
          >
            ← Quay lại
          </button>
          
          <button
            disabled={!isAnswered}
            onClick={handleNext}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-primary-500/10"
          >
            {isLast ? 'Tính toán ngành nghề ✓' : 'Tiếp theo →'}
          </button>
        </div>
      </div>
    );
  };

  // 4. CRITERIA_EVALUATION — priority selection chips & sliders
  const renderCriteriaWizard = () => {
    if (isQuestionnaireMode) {
      return renderQuestionnaireView();
    }

    return (
      <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            ⚖️ Chọn các tiêu chí nghề nghiệp quan trọng nhất với bạn:
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            (Nhấp chọn các tiêu chí để hiện thanh trượt điều chỉnh mức độ quan trọng)
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {availableCriteria.map(item => {
            const selected = selectedCriteria.includes(item);
            return (
              <button
                key={item}
                onClick={() => toggleCriteria(item)}
                className={`text-xs px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                  selected
                    ? 'bg-primary-600 text-white border-primary-600 scale-[1.02] shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {selected ? '✓ ' : ''}{item}
              </button>
            );
          })}
        </div>

        {selectedCriteria.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Chấm điểm mức độ Quan trọng (Importance) từ 1-10:
            </p>
            <div className="space-y-3">
              {selectedCriteria.map(item => (
                <div key={item} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                      ⚖️ {item}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-extrabold">{criteriaScores[item] || 5}/10</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold">1</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={criteriaScores[item] || 5}
                      onChange={(e) => handleSliderChange(item, parseInt(e.target.value))}
                      onMouseUp={(e) => handleSliderRelease(item, parseInt(e.target.value))}
                      onTouchEnd={(e) => handleSliderRelease(item, parseInt(e.target.value))}
                      onKeyUp={(e) => handleSliderRelease(item, parseInt(e.target.value))}
                      className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-primary-600 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400 font-bold">10</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500 font-medium">{selectedCriteria.length} tiêu chí đã chọn</span>
          <button
            disabled={selectedCriteria.length === 0}
            onClick={() => {
              setIsQuestionnaireMode(true);
              setCurrentQuestionIdx(0);
            }}
            className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-md shadow-primary-500/10"
          >
            Tiếp tục khảo sát tiêu chí <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // 5. SHORTLIST_CONFIRMATION — shortlist builder
  const renderShortlistWizard = () => {
    // Find matched pairs
    const matchedPairs = [];
    let colorIdx = 0;
    userProposedCareers.forEach(u => {
      const match = suggestedCareers.find(c => isSimilarCareer(u, c));
      if (match) {
        // Only add once if not already matched
        if (!matchedPairs.some(p => p.user === u)) {
          matchedPairs.push({ user: u, ai: match, colorIndex: colorIdx % 3 });
          colorIdx++;
        }
      }
    });

    const getMatchedPairColor = (career, isUserSection) => {
      const pair = matchedPairs.find(p => 
        isUserSection ? p.user === career : p.ai === career
      );
      return pair !== undefined ? pair.colorIndex : null;
    };

    const PAIR_THEMES = [
      // Theme 0: Emerald (Green)
      {
        selected: 'bg-emerald-600 text-white border-emerald-600 scale-105 shadow-sm',
        unselected: 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-400'
      },
      // Theme 1: Sky (Blue)
      {
        selected: 'bg-sky-600 text-white border-sky-600 scale-105 shadow-sm',
        unselected: 'bg-sky-50 hover:bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-950/20 dark:border-sky-900/40 dark:text-sky-400'
      },
      // Theme 2: Rose (Pink)
      {
        selected: 'bg-rose-600 text-white border-rose-600 scale-105 shadow-sm',
        unselected: 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400'
      }
    ];

    const aiSuggestedFiltered = suggestedCareers;

    return (
      <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-amber-500" />
            Chọn nghề vào danh sách rút gọn (Shortlist):
          </p>
          <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-950/20 px-2.5 py-1 rounded-lg border border-amber-200/50 dark:border-amber-900/40 select-none shadow-sm">(Tối đa 5 nghề)</span>
        </div>

        {userProposedCareers.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">
              💡 Ngành nghề do bạn tự đề xuất:
            </p>
            <div className="flex flex-wrap gap-2">
              {userProposedCareers.map(career => {
                const selected = shortlistedCareers.some(c => isSimilarCareer(c, career));
                const disabled = !selected && shortlistedCareers.length >= 5;
                const colorIdx = getMatchedPairColor(career, true);
                
                let themeClass = '';
                if (colorIdx !== null) {
                  themeClass = selected ? PAIR_THEMES[colorIdx].selected : PAIR_THEMES[colorIdx].unselected;
                } else {
                  themeClass = selected
                    ? 'bg-violet-600 text-white border-violet-600 scale-105 shadow-sm'
                    : disabled
                      ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                      : 'bg-violet-50 hover:bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/20 dark:border-violet-900/40 dark:text-violet-400';
                }

                return (
                  <button
                    key={career}
                    disabled={disabled}
                    onClick={() => toggleCareer(career)}
                    className={`text-sm px-3 py-2 rounded-lg font-semibold border transition-all ${themeClass}`}
                  >
                    {selected ? '✓ ' : ''}{career}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
            🤖 Ngành nghề do hệ thống (AI) gợi ý:
          </p>
          <div className="flex flex-wrap gap-2">
            {aiSuggestedFiltered.map(career => {
              const selected = shortlistedCareers.some(c => isSimilarCareer(c, career));
              const disabled = !selected && shortlistedCareers.length >= 5;
              const colorIdx = getMatchedPairColor(career, false);

              let themeClass = '';
              if (colorIdx !== null) {
                themeClass = selected ? PAIR_THEMES[colorIdx].selected : PAIR_THEMES[colorIdx].unselected;
              } else {
                themeClass = selected
                  ? 'bg-amber-500 text-white border-amber-500 scale-105 shadow-sm'
                  : disabled
                    ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400 dark:bg-slate-800 dark:border-slate-700'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
              }

              return (
                <button
                  key={career}
                  disabled={disabled}
                  onClick={() => toggleCareer(career)}
                  className={`text-sm px-3 py-2 rounded-lg font-medium border transition-all ${themeClass}`}
                >
                  {selected ? '✓ ' : ''}{career}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend note explaining matched pairs */}
        {matchedPairs.length > 0 && (
          <div className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2 bg-blue-50/70 dark:bg-blue-950/20 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/40 leading-relaxed shadow-sm">
            <span className="text-base select-none mt-0.5">💡</span>
            <div>
              <strong className="text-blue-800 dark:text-blue-200">Lưu ý trùng khớp:</strong> Các cặp ngành nghề có cùng màu nền đặc biệt (<span className="font-bold text-emerald-600 dark:text-emerald-400">Xanh lá</span>, <span className="font-bold text-sky-600 dark:text-sky-400">Xanh dương</span>, <span className="font-bold text-rose-600 dark:text-rose-400">Hồng</span>...) biểu thị sự trùng khớp/tương đồng cao giữa đề xuất của bạn và gợi ý từ hệ thống.
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <span className="text-xs text-slate-500">{shortlistedCareers.length}/5 nghề đã chọn</span>
          <button
            disabled={shortlistedCareers.length === 0 || shortlistedCareers.length > 5}
            onClick={() => sendMessage(`Xác nhận shortlist: ${shortlistedCareers.join(', ')}`)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl flex items-center gap-2 transition-colors"
          >
            Xác nhận Shortlist <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };


  // 6. SUGGEST_MORE_QUESTION — quick decision buttons
  const renderSuggestMoreWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Bạn có muốn AI gợi ý thêm nghề phù hợp với hồ sơ của bạn không?
      </p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => sendMessage('Có, gợi ý thêm nghề cho tôi')}
          className="py-3 bg-primary-50 dark:bg-primary-950/30 border-2 border-primary-200 dark:border-primary-700 hover:border-primary-400 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-semibold transition-all hover:bg-primary-100 dark:hover:bg-primary-900/30"
        >
          ✨ Có, gợi ý thêm
        </button>
        <button
          onClick={() => sendMessage('Không, tiến hành khám phá chuyên sâu')}
          className="py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-slate-400 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold transition-all"
        >
          ➡️ Không, tiếp tục
        </button>
      </div>
    </div>
  );

  // 7. IN_DEPTH_EXPLORATION — trigger button
  const renderInDepthWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-700 shadow-md space-y-3">
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
        🔍 Giai đoạn 2: Khám phá chuyên sâu
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        AI sẽ cung cấp phân tích đầy đủ về <strong>xu hướng tuyển dụng, mức lương, khoảng cách năng lực và ưu/nhược điểm</strong> của từng nghề trong danh sách của bạn.
      </p>
      {shortlistedCareers.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pb-1">
          {shortlistedCareers.map(c => (
            <span key={c} className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-700">
              {c}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={() => sendMessage('Xem chi tiết khám phá chuyên sâu')}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
      >
        🔍 Xem phân tích chuyên sâu <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  // 7.1. IN_DEPTH_CHAT — chat guide and transition button
  const renderInDepthChatWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-700 shadow-md space-y-3">
      <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
        💬 Hỏi đáp & Tìm hiểu chuyên sâu
      </p>
      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        Bạn có thể đặt câu hỏi tự luận vào ô chat phía dưới để tìm hiểu kỹ hơn về các khía cạnh nghề nghiệp (ví dụ: công việc hàng ngày, chứng chỉ cần thiết, rủi ro...). 
      </p>
      <button
        onClick={() => sendMessage('Chuyển sang Giai đoạn 3')}
        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-500/10 hover:scale-[1.01] active:scale-95"
      >
        ➡️ Chuyển sang Giai đoạn 3: Lựa chọn nghề <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  // Helper to get initial ratings
  const getInitialRatings = (careerName, idx) => {
    const cLower = careerName.toLowerCase();
    let fit = 4;
    let market = 4;
    if (cLower.includes('phần mềm') || cLower.includes('software')) {
      fit = 5;
      market = 5;
    } else if (cLower.includes('dữ liệu') || cLower.includes('data')) {
      fit = 5;
      market = 5;
    } else if (cLower.includes('marketing') || cLower.includes('marketer')) {
      fit = 4;
      market = 4;
    } else if (cLower.includes('thiết kế') || cLower.includes('designer') || cLower.includes('ux/ui')) {
      fit = 4;
      market = 4;
    } else if (cLower.includes('quản lý sản phẩm') || cLower.includes('product manager')) {
      fit = 4;
      market = 4;
    } else {
      fit = Math.max(3, 5 - idx);
      market = Math.max(3, 4 - idx);
    }
    return { fit, market };
  };

  // Helper to render stars
  const renderStars = (value, clickable = false, careerName = null) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const active = i <= value;
      stars.push(
        <span
          key={i}
          onClick={(e) => {
            if (clickable && careerName) {
              e.stopPropagation(); // prevent row click selection triggering
              setInterestScores(prev => ({
                ...prev,
                [careerName]: i
              }));
            }
          }}
          className={`text-[15px] leading-none transition-transform duration-105 ${clickable ? 'cursor-pointer hover:scale-125 px-0.5' : ''} ${
            active ? 'text-amber-500' : 'text-slate-200 dark:text-slate-700'
          }`}
          title={clickable ? `Đánh giá ${i} sao` : undefined}
        >
          ★
        </span>
      );
    }
    return <div className="flex items-center justify-center">{stars}</div>;
  };

  // 8. CHOICE_SELECTION — select target career with Decision Matrix
  const renderChoiceWizard = () => {
    const list = shortlistedCareers.length > 0 ? shortlistedCareers : ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];

    // Map careers with their respective scores
    const careersWithScores = list.map((career, index) => {
      const { fit, market } = getInitialRatings(career, index);
      const interest = interestScores[career] !== undefined ? interestScores[career] : 4;
      const totalScore = parseFloat(((fit + market + interest) / 15 * 10).toFixed(1));
      return { career, fit, market, interest, totalScore };
    });

    // Sort descending by total score
    const sortedCareers = [...careersWithScores].sort((a, b) => b.totalScore - a.totalScore);

    const getXAIExplanation = (c) => {
      if (!c) return '';
      const cLower = c.toLowerCase();
      if (cLower.includes('phần mềm') || cLower.includes('software')) {
        return "Phù hợp xuất sắc với năng lực kỹ thuật và giải quyết được rào cản thể chất (nhờ cơ chế làm việc remote). Đạt điểm tối đa về mức thu nhập cao và cơ hội việc làm rộng mở tại thị trường Việt Nam.";
      }
      if (cLower.includes('marketing') || cLower.includes('marketer')) {
        return "Tận dụng tối đa sở thích sáng tạo ý tưởng và kỹ năng giao tiếp xuất sắc của bạn. Cơ hội nghề nghiệp năng động, thích hợp cho người thích đổi mới liên tục, tuy nhiên mức độ cạnh tranh thị trường khá cao.";
      }
      if (cLower.includes('thiết kế') || cLower.includes('designer') || cLower.includes('ux/ui')) {
        return "Giao thoa hoàn hảo giữa năng lực sáng tạo mỹ thuật và khả năng ứng dụng kỹ thuật số. Thích hợp làm việc tự do (Freelance) hoặc Remote, giúp khắc phục tốt các rào cản di chuyển vật lý.";
      }
      if (cLower.includes('dữ liệu') || cLower.includes('data')) {
        return "Phù hợp vượt trội với tư duy phân tích, lập luận logic và kỹ năng làm việc với số liệu của bạn. Thu nhập ổn định và nhu cầu tuyển dụng từ các doanh nghiệp/ngân hàng luôn ở mức cao.";
      }
      if (cLower.includes('quản lý sản phẩm') || cLower.includes('product manager')) {
        return "Khai thác tối đa khả năng điều phối nhóm, kỹ năng giao tiếp và tư duy định hướng sản phẩm. Phù hợp cho những ai muốn thăng tiến nhanh lên các vị trí quản trị chiến lược.";
      }
      return "Khớp khá tốt với các tiêu chí ưu tiên của bạn, cung cấp lộ trình học tập và tích lũy năng lực vững chắc trong tương lai.";
    };

    return (
      <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-sky-700 shadow-lg space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
          <div>
            <p className="text-sm font-bold text-sky-700 dark:text-sky-300 flex items-center gap-2">
              <Target className="w-4 h-4 text-sky-500 animate-pulse" />
              🎯 Giai đoạn 3: Ma trận quyết định & Lựa chọn nghề đích
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Đối chiếu phân tích logic của AI với trực giác (Mức độ hứng thú) của bạn
            </p>
          </div>
          <span className="text-[10px] font-semibold bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 px-2.5 py-1 rounded-full border border-sky-200 dark:border-sky-800">
            PIC Model: Choice
          </span>
        </div>

        {/* Info banner */}
        <div className="text-xs bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 flex items-start gap-2 leading-relaxed">
          <span className="text-sm select-none">💡</span>
          <div>
            Hệ thống sắp xếp thứ tự dựa trên điểm số tổng hợp. Bạn hãy <strong>đánh giá mức độ hứng thú (Cột Hứng thú)</strong> theo trực giác của mình để cập nhật bảng xếp hạng trong thời gian thực!
          </div>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-950">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-xs">
            <thead className="bg-slate-50 dark:bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-3 py-2.5 text-center w-12">Chọn</th>
                <th className="px-3 py-2.5 text-center w-12">Hạng</th>
                <th className="px-3 py-2.5 text-left min-w-[140px]">Nghề nghiệp</th>
                <th className="px-3 py-2.5 text-center">Phù hợp (AI)</th>
                <th className="px-3 py-2.5 text-center">Thị trường (AI)</th>
                <th className="px-3 py-2.5 text-center">Hứng thú (Bạn)</th>
                <th className="px-3 py-2.5 text-center w-20">Điểm số</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {sortedCareers.map(({ career, fit, market, interest, totalScore }, idx) => {
                const isSelected = selectedCareer === career;
                
                // Color for total score badge
                let scoreBadgeClass = 'bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400 border-rose-100 dark:border-rose-900/30';
                if (totalScore >= 8.5) {
                  scoreBadgeClass = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30';
                } else if (totalScore >= 7.0) {
                  scoreBadgeClass = 'bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 border-amber-100 dark:border-amber-900/30';
                }

                return (
                  <tr
                    key={career}
                    onClick={() => setSelectedCareer(career)}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-900/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-sky-50/50 dark:bg-sky-950/20' : ''
                    }`}
                  >
                    <td className="px-3 py-3 text-center">
                      <input
                        type="radio"
                        name="selectedTargetCareer"
                        checked={isSelected}
                        onChange={() => setSelectedCareer(career)}
                        className="text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                      />
                    </td>
                    <td className="px-3 py-3 text-center font-bold text-slate-400 dark:text-slate-500">
                      #{idx + 1}
                    </td>
                    <td className="px-3 py-3 text-left font-bold text-slate-700 dark:text-slate-300">
                      {career}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex justify-center">{renderStars(fit)}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex justify-center">{renderStars(market)}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex justify-center">{renderStars(interest, true, career)}</div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <span className={`px-2 py-1 rounded-md text-[11px] font-extrabold border ${scoreBadgeClass}`}>
                        {totalScore.toFixed(1)}/10
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Explainable AI (XAI) Box */}
        {selectedCareer && (
          <div className="p-3.5 bg-sky-50/40 dark:bg-sky-950/15 border border-sky-100 dark:border-sky-900/30 rounded-xl space-y-1.5 transition-all animate-fade-in">
            <p className="text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              Giải thích logic từ AI cho nghề {selectedCareer}:
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {getXAIExplanation(selectedCareer)}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => {
              sendMessage(`Tôi chọn ${selectedCareer} làm nghề mục tiêu`);
              if (setActiveTab) setActiveTab('roadmap');
            }}
            disabled={!selectedCareer}
            className="w-full py-3 bg-gradient-to-r from-sky-600 to-primary-600 hover:from-sky-700 hover:to-primary-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/10 hover:scale-[1.01] active:scale-95"
          >
            🎯 Xác nhận & Lập lộ trình <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // 9. ROADMAP_DECISION — view roadmap only
  const renderRoadmapDecisionWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-sky-200 dark:border-sky-700 shadow-lg space-y-4 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center text-sky-600 dark:text-sky-400 flex-shrink-0 border border-sky-100 dark:border-sky-900/30">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            🗺️ Lộ trình 6-12 tháng đã sẵn sàng!
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
            Hệ thống đã thiết lập lộ trình học tập cá nhân hóa chi tiết dành riêng cho bạn.
          </p>
        </div>
      </div>
      <button
        onClick={() => setActiveTab('roadmap')}
        className="w-full py-3 bg-gradient-to-r from-sky-600 to-primary-600 hover:from-sky-700 hover:to-primary-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md shadow-sky-500/10 hover:scale-[1.01] active:scale-95"
      >
        📋 Xem Bảng lộ trình chi tiết
      </button>
    </div>
  );

  // 10. ROADMAP_ADJUSTMENT — confirm or re-loop
  const renderRoadmapAdjustmentWizard = () => (
    <div className="mx-4 mb-4 p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md space-y-3">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        Bạn muốn thực hiện điều gì tiếp theo?
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <button
          onClick={() => sendMessage('Xác nhận thực hiện lộ trình và cập nhật tiến độ')}
          className="py-3 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
        >
          <CheckCircle className="w-4 h-4" /> Xác nhận & Lưu lộ trình
        </button>
        <button
          onClick={() => sendMessage('Điều chỉnh lộ trình hoặc đổi nghề')}
          className="py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors"
        >
          ✏️ Điều chỉnh lại
        </button>
      </div>
    </div>
  );

  // Main wizard renderer based on subStage
  const renderWizardPanel = () => {
    if (isLoading) return null;
    
    let wizardContent = null;
    let title = "";

    if (subStage === 'WELCOME' || subStage === 'CLASSIFY_PATH') {
      wizardContent = renderWelcomeWizard();
      title = "Khởi đầu";
    } else if (subStage === 'LISTING_CAREERS' || subStage === 'EXPLAIN_INSUFFICIENT_CAREERS') {
      wizardContent = renderCareerListingWizard();
      title = "Nhập danh sách nghề";
    } else if (subStage === 'PROFILE_GATHERING') {
      wizardContent = renderProfileForm();
      title = "Thông tin cá nhân";
    } else if (subStage === 'CRITERIA_EVALUATION') {
      wizardContent = renderCriteriaWizard();
      title = "Sàng lọc tiêu chí";
    } else if (subStage === 'SHORTLIST_CONFIRMATION') {
      wizardContent = renderShortlistWizard();
      title = "Danh sách rút gọn";
    } else if (subStage === 'SUGGEST_MORE_QUESTION') {
      wizardContent = renderSuggestMoreWizard();
      title = "Gợi ý thêm nghề";
    } else if (subStage === 'IN_DEPTH_EXPLORATION') {
      wizardContent = renderInDepthWizard();
      title = "Khám phá chuyên sâu";
    } else if (subStage === 'IN_DEPTH_CHAT') {
      wizardContent = renderInDepthChatWizard();
      title = "Hỏi đáp chuyên sâu";
    } else if (subStage === 'CHOICE_SELECTION' || subStage === 'GENERATE_ROADMAP') {
      wizardContent = renderChoiceWizard();
      title = "Lựa chọn nghề đích";
    } else if (subStage === 'ROADMAP_DECISION') {
      wizardContent = renderRoadmapDecisionWizard();
      title = "Quyết định lộ trình";
    } else if (subStage === 'ROADMAP_ADJUSTMENT') {
      wizardContent = renderRoadmapAdjustmentWizard();
      title = "Điều chỉnh lộ trình";
    }

    if (!wizardContent) return null;

    if (isWizardCollapsed) {
      return (
        <div className="mx-4 mb-4 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-all">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-primary-500" />
            <span>Trạng thái bước: <strong className="text-slate-800 dark:text-slate-200">{title}</strong></span>
          </div>
          <button
            onClick={() => setIsWizardCollapsed(false)}
            className="text-xs px-3 py-1.5 bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 font-bold rounded-lg border border-primary-200 dark:border-primary-800 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all flex items-center gap-1 shadow-sm hover:scale-[1.02] active:scale-95"
          >
            Mở rộng ↑
          </button>
        </div>
      );
    }

    return (
      <div className="relative">
        {/* Collapse Toggle Button Toolbar */}
        <div className="flex justify-end px-4 mb-1">
          <button
            onClick={() => setIsWizardCollapsed(true)}
            className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 font-semibold rounded-md border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1 active:scale-95 shadow-sm"
            title="Ẩn bảng điều khiển để xem khung chat"
          >
            Thu gọn ↓
          </button>
        </div>
        {wizardContent}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 overflow-hidden relative">


      {/* Main Chat Stream */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {filteredHistory.length === 0 ? (
          renderEmptyHistoryPlaceholder()
        ) : (
          filteredHistory.map((msg, index) => {
            const isLastMessage = index === filteredHistory.length - 1;
            const isAI = msg.sender === 'ai';
            return (
              <div key={index} ref={isLastMessage && isAI ? lastAIMessageRef : null}>
                <MessageBubble message={msg} index={index} />
              </div>
            );
          })
        )}

        {isLoading && (
          <div className="flex justify-start mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-none p-4 shadow-sm">
              <div className="flex space-x-1.5 items-center h-5">
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2.5 h-2.5 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Interactive Wizard Panel — flex-shrink-0: pinned above quick replies */}
      <div className="flex-shrink-0">
        {renderWizardPanel()}
      </div>

      {/* Quick Replies — flex-shrink-0: always visible */}
      <div className="flex-shrink-0">
        <QuickReplies stage={stage} subStage={subStage} onSelect={selectQuickReply} />
      </div>
    </div>
  );
}
