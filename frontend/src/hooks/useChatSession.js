import { useState, useEffect } from 'react';

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
      replyText = "Bạn có thể đặt câu hỏi tự do cho AI về các phân tích trên. Khi đã sẵn sàng, hãy bấm nút 'Chuyển sang Giai đoạn 3' nhé!";
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
    updateSession
  };
}
