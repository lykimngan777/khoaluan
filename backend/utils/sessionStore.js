// In-memory store for session data
const sessions = new Map();

/**
 * Get or initialize a session
 * @param {string} sessionId 
 */
function getSession(sessionId) {
  if (!sessionId) return null;
  
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, {
      id: sessionId,
      stage: 'PRESCREENING',
      subStage: 'PROFILE_GATHERING',
      history: [
        {
          sender: 'ai',
          text: "Chào bạn! Mình là CareerAI, trợ lý hướng nghiệp cá nhân của bạn. Rất vui được đồng hành cùng bạn trên hành trình định hình tương lai theo mô hình PIC (Sàng lọc - Khám phá - Lựa chọn).\n\nĐể bắt đầu, **vui lòng nhập thông tin hồ sơ học tập và kinh nghiệm của bạn** ở bảng điều khiển bên dưới để mình có cơ sở phân tích và tư vấn chính xác nhất nhé!",
          timestamp: new Date(),
          stage: 'PRESCREENING'
        }
      ],
      userInfo: {},
      profileInfo: {},
      selectedCriteria: [],
      shortlistedCareers: [],
      selectedCareer: null,
      expertConsulted: false,
      finalRoadmap: null,
      furthestSubStage: 'PROFILE_GATHERING',
      userProposedCareers: [],
      updatedAt: new Date()
    });
  }
  
  const session = sessions.get(sessionId);
  session.updatedAt = new Date();
  return session;
}

/**
 * Update session state
 * @param {string} sessionId 
 * @param {object} updates 
 */
function updateSession(sessionId, updates) {
  const session = getSession(sessionId);
  if (!session) return null;
  
  Object.assign(session, updates);
  session.updatedAt = new Date();
  return session;
}

/**
 * Clean up old sessions (> 24 hours inactive)
 */
function cleanupSessions() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  for (const [id, session] of sessions.entries()) {
    if (session.updatedAt < oneDayAgo) {
      sessions.delete(id);
    }
  }
}

// Run cleanup every 1 hour
setInterval(cleanupSessions, 60 * 60 * 1000);

module.exports = {
  getSession,
  updateSession
};
