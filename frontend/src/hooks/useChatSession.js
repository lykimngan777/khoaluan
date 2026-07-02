import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/chat` 
  : '/api/chat';

export function useChatSession() {
  const [sessionId, setSessionId] = useState('');
  const [stage, setStage] = useState('PRESCREENING');
  const [subStage, setSubStage] = useState('PROFILE_GATHERING');
  const [furthestSubStage, setFurthestSubStage] = useState('PROFILE_GATHERING');
  
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

  useEffect(() => {
    const currentIdx = SUBSTAGE_ORDER.indexOf(subStage);
    const furthestIdx = SUBSTAGE_ORDER.indexOf(furthestSubStage);
    if (currentIdx > furthestIdx) {
      setFurthestSubStage(subStage);
    }
  }, [subStage, furthestSubStage]);

  const [history, setHistory] = useState([
    {
      sender: 'ai',
      text: "Chào bạn! Mình là CareerAI, trợ lý hướng nghiệp cá nhân của bạn. Rất vui được đồng hành cùng bạn trên hành trình định hình tương lai theo mô hình PIC (Sàng lọc - Khám phá - Lựa chọn).\n\nĐể bắt đầu, **vui lòng nhập thông tin hồ sơ học tập và kinh nghiệm của bạn** ở bảng điều khiển bên dưới để mình có cơ sở phân tích và tư vấn chính xác nhất nhé!",
      timestamp: new Date(),
      stage: 'PRESCREENING'
    }
  ]);
  const [selectedCriteria, setSelectedCriteria] = useState([]);
  const [shortlistedCareers, setShortlistedCareers] = useState([]);
  const [userProposedCareers, setUserProposedCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [profileInfo, setProfileInfo] = useState({
    interests: '',
    academic: '',
    skills: '',
    experience: '',
    goals: ''
  });
  const [expertConsulted, setExpertConsulted] = useState(false);
  const [finalRoadmap, setFinalRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();

  // Associate session when user logs in
  useEffect(() => {
    if (user && sessionId) {
      fetch(`${API_BASE}/session/${sessionId}/associate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, userName: user.name })
      }).catch(err => console.warn("Failed to associate session with user:", err));
    }
  }, [user, sessionId]);

  // Initialize session ID
  useEffect(() => {
    let id = localStorage.getItem('careerai_session_id');
    if (!id) {
      id = 'sess_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('careerai_session_id', id);
    }
    setSessionId(id);
    loadSessionData(id);
  }, []);

  // Fetch session data from backend (or fallback to localStorage if offline)
  const loadSessionData = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/session/${id}`);
      if (res.ok) {
        const data = await res.json();
        
        // If the server restarted/wiped but localStorage has our progress, restore it!
        const localSaved = localStorage.getItem('careerai_state');
        if (localSaved && (!data.history || data.history.length <= 1)) {
          try {
            const parsed = JSON.parse(localSaved);
            if (parsed.history && parsed.history.length > 1) {
              console.log("Restoring session from local storage after server restart...");
              updateSession(parsed);
              return;
            }
          } catch (e) {
            // ignore
          }
        }

        setStage(data.stage || 'PRESCREENING');
        setSubStage(data.subStage || 'WELCOME');
        setFurthestSubStage(data.furthestSubStage || data.subStage || 'PROFILE_GATHERING');
        setHistory(data.history || []);
        setSelectedCriteria(data.selectedCriteria || []);
        setShortlistedCareers(data.shortlistedCareers || []);
        setUserProposedCareers(data.userProposedCareers || []);
        setSelectedCareer(data.selectedCareer || null);
        setProfileInfo(data.profileInfo || { interests: '', academic: '', skills: '', experience: '', goals: '' });
        setExpertConsulted(data.expertConsulted || false);
        setFinalRoadmap(data.finalRoadmap || null);
      } else {
        loadFromLocalStorage();
      }
    } catch (err) {
      console.warn("Could not connect to API Server. Operating in offline/local prototype mode.");
      loadFromLocalStorage();
    }
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('careerai_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStage(parsed.stage || 'PRESCREENING');
        setSubStage(parsed.subStage || 'WELCOME');
        setFurthestSubStage(parsed.furthestSubStage || parsed.subStage || 'PROFILE_GATHERING');
        setHistory(parsed.history || []);
        setSelectedCriteria(parsed.selectedCriteria || []);
        setShortlistedCareers(parsed.shortlistedCareers || []);
        setUserProposedCareers(parsed.userProposedCareers || []);
        setSelectedCareer(parsed.selectedCareer || null);
        setProfileInfo(parsed.profileInfo || { interests: '', academic: '', skills: '', goals: '' });
        setExpertConsulted(parsed.expertConsulted || false);
        setFinalRoadmap(parsed.finalRoadmap || null);
      } catch (e) {
        console.error("Error parsing local state", e);
      }
    }
  };

  // Sync state to local storage as fallback
  useEffect(() => {
    if (sessionId) {
      const stateToSave = { 
        stage, 
        subStage, 
        furthestSubStage,
        history, 
        selectedCriteria, 
        shortlistedCareers, 
        userProposedCareers,
        selectedCareer,
        profileInfo,
        expertConsulted,
        finalRoadmap
      };
      localStorage.setItem('careerai_state', JSON.stringify(stateToSave));
    }
  }, [stage, subStage, furthestSubStage, history, selectedCriteria, shortlistedCareers, userProposedCareers, selectedCareer, profileInfo, expertConsulted, finalRoadmap, sessionId]);

  // Send a message
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    const userMsg = { sender: 'user', text: messageText, timestamp: new Date(), stage: stage };
    setHistory(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: messageText,
          stage,
          subStage,
          furthestSubStage,
          userProposedCareers,
          selectedCriteria,
          shortlistedCareers,
          selectedCareer,
          profileInfo,
          expertConsulted,
          finalRoadmap
        })
      });

      if (res.ok) {
        const data = await res.json();
        setHistory(data.history);
        setStage(data.stage);
        setSubStage(data.subStage);
        if (data.furthestSubStage) setFurthestSubStage(data.furthestSubStage);
        if (data.userProposedCareers) setUserProposedCareers(data.userProposedCareers);
        if (data.shortlistedCareers) setShortlistedCareers(data.shortlistedCareers);
        if (data.finalRoadmap) setFinalRoadmap(data.finalRoadmap);
      } else {
        handleLocalFallback(messageText);
      }
    } catch (err) {
      console.warn("API Server offline. Simulating counselor response client-side.", err);
      handleLocalFallback(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  // Update session on server manually
  const updateSession = async (updates) => {
    // Apply updates locally first
    if (updates.stage) setStage(updates.stage);
    if (updates.subStage) setSubStage(updates.subStage);
    if (updates.furthestSubStage) setFurthestSubStage(updates.furthestSubStage);
    if (updates.selectedCriteria) setSelectedCriteria(updates.selectedCriteria);
    if (updates.shortlistedCareers) setShortlistedCareers(updates.shortlistedCareers);
    if (updates.userProposedCareers) setUserProposedCareers(updates.userProposedCareers);
    if (updates.selectedCareer !== undefined) setSelectedCareer(updates.selectedCareer);
    if (updates.profileInfo) setProfileInfo(updates.profileInfo);
    if (updates.expertConsulted !== undefined) setExpertConsulted(updates.expertConsulted);
    if (updates.finalRoadmap) setFinalRoadmap(updates.finalRoadmap);
    if (updates.history) setHistory(updates.history);

    try {
      await fetch(`${API_BASE}/session/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ furthestSubStage, userProposedCareers, ...updates })
      });
    } catch (err) {
      console.warn("Failed to update session on server, applied locally");
    }
  };

  // Offline/simulation fallback logic
  const handleLocalFallback = (messageText) => {
    const msgLower = messageText.toLowerCase();
    let replyText = '';
    let isAnxiety = false;
    let nextStage = stage;
    let nextSubStage = subStage;

    if (subStage === 'WELCOME') {
      replyText = "Chào bạn! Mình là CareerAI. Để bắt đầu, bạn đã có sẵn danh sách các ngành nghề mình quan tâm chưa?";
      nextSubStage = 'CLASSIFY_PATH';
    } else if (subStage === 'CLASSIFY_PATH') {
      if (msgLower.includes('có') || msgLower.includes('yes')) {
        replyText = "Tuyệt! Hãy liệt kê 3 nghề bạn quan tâm nhất (phân cách bằng dấu phẩy).\n\n*(Lưu ý: Bạn nên liệt kê đủ 3 nghề để sàng lọc PIC hiệu quả nhất. Nếu bạn có ít hơn 3 nghề (1 hoặc 2), hệ thống vẫn hỗ trợ chuyển tiếp trực tiếp sang khảo sát tiêu chí sàng lọc và giữ các nghề này ở mục \"Nghề tự đề xuất\" riêng biệt).*";
        nextSubStage = 'LISTING_CAREERS';
      } else {
        replyText = "Không sao. Hãy cung cấp sở thích, học lực, kĩ năng và mục tiêu của bạn nhé.";
        nextSubStage = 'PROFILE_GATHERING';
      }
    } else if (subStage === 'LISTING_CAREERS') {
      replyText = "Cảm ơn bạn. Danh sách nghề của bạn đã được ghi nhận. Bạn có muốn AI gợi ý thêm nghề nào khác dựa trên hồ sơ của bạn không?";
      nextSubStage = 'SUGGEST_MORE_QUESTION';
    } else if (subStage === 'PROFILE_GATHERING') {
      replyText = "Cảm ơn bạn. Bước tiếp theo, hãy đánh giá các tiêu chí nghề nghiệp bạn mong muốn ở Bảng tiêu chí và nhắn 'Đã chọn xong'.";
      nextSubStage = 'CRITERIA_EVALUATION';
    } else if (subStage === 'CRITERIA_EVALUATION') {
      replyText = "AI đề xuất các nghề phù hợp: Kỹ sư Phần mềm, Digital Marketer, UX/UI Designer. Bạn hãy chọn chúng vào shortlist và nhắn xác nhận.";
      nextSubStage = 'SHORTLIST_CONFIRMATION';
    } else if (subStage === 'SHORTLIST_CONFIRMATION') {
      replyText = "Đã chuyển sang Giai đoạn 2: Khám phá chuyên sâu. Bạn hãy xem bảng phân tích xu hướng, lương và khoảng cách năng lực của các nghề.";
      nextStage = 'IN_DEPTH';
      nextSubStage = 'IN_DEPTH_EXPLORATION';
    } else if (subStage === 'IN_DEPTH_EXPLORATION') {
      const list = shortlistedCareers.length > 0 ? shortlistedCareers : ['Kỹ sư Phần mềm', 'Digital Marketer', 'UX/UI Designer'];
      const capLower = (profileInfo?.skills || profileInfo?.capabilities || '').toLowerCase();
      
      const matchSkill = (cap, keywords, partialKeywords = []) => {
        for (const kw of keywords) {
          if (cap.includes(kw.toLowerCase())) return 10;
        }
        for (const kw of partialKeywords) {
          if (cap.includes(kw.toLowerCase())) return 5;
        }
        return 0;
      };

      const getCareerDetail = (c) => {
        const cLower = c.toLowerCase();
        if (cLower.includes('phần mềm') || cLower.includes('software')) {
          return {
            description: "Lập trình, thiết kế và bảo trì các hệ thống phần mềm từ ứng dụng web, mobile đến hệ thống backend.",
            typicalDay: "Sáng: standup meeting (15 phút), code feature mới. Chiều: review code, họp kỹ thuật.",
            coreAspects: "Ngồi làm việc với máy tính 8-10h/ngày, áp lực tiến độ (deadline) và OT cao.",
            salary: "15 - 35 triệu VNĐ/tháng (khởi điểm), Tech Lead có thể lên tới 50+ triệu VNĐ/tháng.",
            prospects: "Lộ trình: Junior → Senior → Tech Lead/Architect → CTO hoặc Product Manager.",
            skillGapLine: `SKILLGAP::Python:${matchSkill(capLower, ['python'])}|JavaScript:${matchSkill(capLower, ['javascript', 'js'], ['html', 'web'])}|SQL:${matchSkill(capLower, ['sql', 'mysql'], ['database'])}|React/Node.js:${matchSkill(capLower, ['react', 'node'])}|DevOps:${matchSkill(capLower, ['devops', 'docker'])}`,
            skillGap: "Cần tích lũy thêm các dự án thực tế trên GitHub và làm quen với React, Node.js.",
            jobOpportunities: "Nhu cầu rất cao tại TP.HCM và Hà Nội, hơn 15.000 việc làm mới mỗi tháng.",
            feasibility: "Khá cao. Khớp với năng lực kỹ thuật và hỗ trợ làm việc remote linh hoạt."
          };
        }
        if (cLower.includes('marketing') || cLower.includes('marketer')) {
          return {
            description: "Lập kế hoạch và triển khai các chiến dịch marketing trên nền tảng số (Facebook, Google, TikTok, Email...).",
            typicalDay: "Sáng: kiểm tra chỉ số quảng cáo (CTR, CPC). Chiều: họp lên ý tưởng nội dung, viết báo cáo tuần.",
            coreAspects: "Chịu áp lực KPI doanh số/traffic khắt khe, thị trường biến động nhanh.",
            salary: "12 - 25 triệu VNĐ/tháng, tăng theo năng lực quảng lý ngân sách.",
            prospects: "Lộ trình: Executive → Senior → Marketing Manager → CMO hoặc Agency Owner.",
            skillGapLine: `SKILLGAP::Facebook Ads:${matchSkill(capLower, ['facebook', 'fb'])}|Google Ads:${matchSkill(capLower, ['google ads', 'adwords'])}|SEO/SEM:${matchSkill(capLower, ['seo', 'sem'])}|Content Writing:${matchSkill(capLower, ['content', 'copywriting'])}|Google Analytics:${matchSkill(capLower, ['analytics', 'ga4'])}`,
            skillGap: "Cần cải thiện tư duy tối ưu chi phí quảng cáo (A/B testing) và kỹ năng phân tích số liệu.",
            jobOpportunities: "Nhu cầu tuyển dụng ổn định, khoảng 8.000 tin tuyển dụng mới mỗi tháng.",
            feasibility: "Tốt. Phù hợp với sở thích sáng tạo và khả năng giao tiếp của bạn."
          };
        }
        if (cLower.includes('thiết kế') || cLower.includes('designer') || cLower.includes('ux/ui')) {
          return {
            description: "Nghiên cứu hành vi người dùng, thiết kế giao diện (UI) và trải nghiệm sử dụng (UX) cho các sản phẩm số.",
            typicalDay: "Sáng: phỏng vấn người dùng, vẽ wireframe. Chiều: thiết kế UI trên Figma, họp với Dev.",
            coreAspects: "Cân bằng giữa thẩm mỹ cá nhân và trải nghiệm của người dùng thực tế.",
            salary: "14 - 28 triệu VNĐ/tháng.",
            prospects: "Lộ trình: Junior Designer → Senior UX/UI → Lead Designer → UX Director/Product Designer.",
            skillGapLine: `SKILLGAP::Figma:${matchSkill(capLower, ['figma'])}|Adobe XD:${matchSkill(capLower, ['xd'])}|User Research:${matchSkill(capLower, ['research', 'nghiên cứu user'])}|Wireframing:${matchSkill(capLower, ['wireframe', 'prototype'])}|Design System:${matchSkill(capLower, ['design system'])}`,
            skillGap: "Cần xây dựng Portfolio dự án thực tế và bổ sung kiến thức cơ bản về HTML/CSS.",
            jobOpportunities: "Nhu cầu tăng nhanh, khoảng 5.000 việc làm mới mỗi tháng tại các công ty công nghệ.",
            feasibility: "Cao. Phát huy tốt sự sáng tạo và năng lực thiết kế của bạn."
          };
        }
        // Fallback default
        return {
          description: "Thực hiện chuyên môn theo kế hoạch, phối hợp với các bộ phận liên quan và đóng góp vào mục tiêu chung.",
          typicalDay: "Xử lý công việc hàng ngày, họp nhóm báo cáo tiến độ và thảo luận phương án giải quyết.",
          coreAspects: "Yêu cầu tính kiên trì học hỏi công cụ chuyên ngành và phối hợp làm việc nhóm tốt.",
          salary: "12 - 22 triệu VNĐ/tháng.",
          prospects: "Phát triển từ vị trí nhân viên lên chuyên viên, senior và quản lý sau 4-6 năm.",
          skillGapLine: `SKILLGAP::Chuyên môn:5|Giao tiếp:5|Ngoại ngữ:5|Tin học:5|Tự học:5`,
          skillGap: "Cần bồi dưỡng portfolio dự án cá nhân thực tế để chứng minh năng lực.",
          jobOpportunities: "Nhu cầu tuyển dụng ổn định theo sự phát triển kinh tế tại Việt Nam.",
          feasibility: "Khá khả thi. Khớp với mục tiêu phát triển của bạn."
        };
      };

      const intro = `## 🔍 Giai đoạn 2: Khám phá chuyên sâu (In-depth Exploration)

Chào bạn, tại giai đoạn này chúng ta sẽ **"phóng to" (Zoom-in)** vào từng nghề nghiệp thuộc danh sách rút gọn để kiểm chứng thông qua **2 tiêu chuẩn bắt buộc**: **Tính phù hợp (Fit)** và **Tính khả thi (Feasibility & Skill Gap)**.`;

      const careerBlocks = list.map((c, i) => {
        const d = getCareerDetail(c);
        return `### 💼 Nghề nghiệp thứ ${i+1}: **${c}**

#### 📋 1. Mô tả công việc:
${d.description}

#### 🌅 2. Một ngày làm việc điển hình:
${d.typicalDay}

#### 💰 3. Mức lương tham khảo:
${d.salary}

#### 🚀 4. Triển vọng nghề nghiệp:
${d.prospects}

#### 🛠️ 5. Kỹ năng cần có:
${d.skillGapLine}
* **Ghi chú:** Năng lực hiện tại của bạn: *"${profileInfo?.skills || profileInfo?.capabilities || 'Chưa rõ'}"*.
* **Khoảng cách kỹ năng cần bù đắp:** ${d.skillGap}

#### 🏢 6. Cơ hội việc làm tại Việt Nam:
${d.jobOpportunities}

#### 📌 7. Khía cạnh cốt lõi của nghề (Core aspects):
* **Đặc thù bắt buộc:** ${d.coreAspects}
* **Đánh giá rào cản:** Nghề này được đánh giá là ít bị ảnh hưởng bởi rào cản vật lý.

⚖️ **Phán quyết sơ bộ:** **${d.feasibility}**`;
      }).join('\n\n---\n\n');

      const outro = `Bạn có thể đặt thêm câu hỏi tự do cho AI về các phân tích trên. Khi đã sẵn sàng, hãy bấm nút **"Chuyển sang Giai đoạn 3"** ở bảng điều khiển bên dưới để lập Ma trận quyết định nhé!`;

      replyText = `${intro}\n\n---\n\n${careerBlocks}\n\n---\n\n${outro}`;
      nextStage = 'IN_DEPTH';
      nextSubStage = 'IN_DEPTH_CHAT';
    } else if (subStage === 'IN_DEPTH_CHAT') {
      replyText = "Chào mừng bạn đến với Giai đoạn 3: Lựa chọn. Dưới đây là Ma trận quyết định giúp bạn so sánh trực quan các nghề nghiệp và đưa ra quyết định.";
      nextStage = 'CHOICE';
      nextSubStage = 'CHOICE_SELECTION';
    } else {
      replyText = "Tuyệt vời! Lộ trình của bạn đã được cập nhật thành công.";
    }

    setSubStage(nextSubStage);
    setStage(nextStage);
    const aiMsg = { sender: 'ai', text: replyText, timestamp: new Date(), stage: stage };
    setHistory(prev => [...prev, aiMsg]);
  };

  // Reset session
  const resetSession = async () => {
    localStorage.removeItem('careerai_state');
    setStage('PRESCREENING');
    setSubStage('PROFILE_GATHERING');
    setFurthestSubStage('PROFILE_GATHERING');
    const initialHistory = [
      {
        sender: 'ai',
        text: "Chào bạn! Mình là CareerAI, trợ lý hướng nghiệp cá nhân của bạn. Rất vui được đồng hành cùng bạn trên hành trình định hình tương lai theo mô hình PIC (Sàng lọc - Khám phá - Lựa chọn).\n\nĐể bắt đầu, **vui lòng nhập thông tin hồ sơ học tập và kinh nghiệm của bạn** ở bảng điều khiển bên dưới để mình có cơ sở phân tích và tư vấn chính xác nhất nhé!",
        timestamp: new Date(),
        stage: 'PRESCREENING'
      }
    ];
    setHistory(initialHistory);
    setSelectedCriteria([]);
    setShortlistedCareers([]);
    setUserProposedCareers([]);
    setSelectedCareer(null);
    setProfileInfo({ interests: '', academic: '', skills: '', experience: '', goals: '' });
    setExpertConsulted(false);
    setFinalRoadmap(null);

    try {
      await fetch(`${API_BASE}/session/${sessionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stage: 'PRESCREENING',
          subStage: 'PROFILE_GATHERING',
          furthestSubStage: 'PROFILE_GATHERING',
          userProposedCareers: [],
          history: initialHistory,
          selectedCriteria: [],
          shortlistedCareers: [],
          selectedCareer: null,
          profileInfo: { interests: '', academic: '', skills: '', experience: '', goals: '' },
          expertConsulted: false,
          finalRoadmap: null
        })
      });
    } catch (e) {
      // ignore
    }
  };

  // Load a historical session to active session (for viewing/resuming)
  const loadHistoricalSession = (sessionData) => {
    setStage(sessionData.stage || 'PRESCREENING');
    setSubStage(sessionData.subStage || 'WELCOME');
    setFurthestSubStage(sessionData.furthestSubStage || sessionData.subStage || 'PROFILE_GATHERING');
    setHistory(sessionData.history || []);
    setSelectedCriteria(sessionData.selectedCriteria || []);
    setShortlistedCareers(sessionData.shortlistedCareers || []);
    setUserProposedCareers(sessionData.userProposedCareers || []);
    setSelectedCareer(sessionData.selectedCareer || null);
    setProfileInfo(sessionData.profileInfo || { interests: '', academic: '', skills: '', experience: '', goals: '' });
    setExpertConsulted(sessionData.expertConsulted || false);
    setFinalRoadmap(sessionData.finalRoadmap || null);

    setSessionId(sessionData.id);
    localStorage.setItem('careerai_session_id', sessionData.id);
  };

  // Fetch consultation history from backend for a specific user
  const fetchUserHistory = async (userId) => {
    try {
      const res = await fetch(`${API_BASE}/history/${userId}`);
      if (res.ok) {
        return await res.json();
      }
      return [];
    } catch (err) {
      console.error("Error fetching user consultation history:", err);
      return [];
    }
  };

  // Delete a session from history
  const deleteSession = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/session/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        if (id === sessionId) {
          resetSession();
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error deleting session:", err);
      return false;
    }
  };

  return {
    stage,
    setStage,
    subStage,
    setSubStage,
    furthestSubStage,
    setFurthestSubStage,
    history,
    setHistory,
    sendMessage,
    selectedCriteria,
    setSelectedCriteria,
    shortlistedCareers,
    setShortlistedCareers,
    userProposedCareers,
    setUserProposedCareers,
    selectedCareer,
    setSelectedCareer,
    profileInfo,
    setProfileInfo,
    expertConsulted,
    setExpertConsulted,
    finalRoadmap,
    setFinalRoadmap,
    isLoading,
    resetSession,
    updateSession,
    loadHistoricalSession,
    fetchUserHistory,
    deleteSession
  };
}
