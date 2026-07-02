const sessionStore = require('../utils/sessionStore');
const openaiService = require('../services/openaiService');
const historyStore = require('../utils/historyStore');

/**
 * Initialize a new session or get an existing one
 */
exports.initSession = (req, res) => {
  const { sessionId } = req.body;
  if (!sessionId) {
    return res.status(400).json({ error: "Yêu cầu cung cấp sessionId" });
  }

  const session = sessionStore.getSession(sessionId);
  res.json(session);
};

/**
 * Get data for a session
 */
exports.getSessionData = (req, res) => {
  const { id } = req.params;
  const session = sessionStore.getSession(id);
  if (!session) {
    return res.status(404).json({ error: "Không tìm thấy phiên làm việc" });
  }
  res.json(session);
};

/**
 * Send user message and get AI response
 */
exports.sendMessage = async (req, res) => {
  const { 
    sessionId, 
    message, 
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
  } = req.body;

  if (!sessionId || !message) {
    return res.status(400).json({ error: "Thiếu thông tin sessionId hoặc message" });
  }

  try {
    // 1. Get or initialize session
    const session = sessionStore.getSession(sessionId);
    
    // 2. Sync metadata from frontend if provided
    if (stage) session.stage = stage;
    if (subStage) session.subStage = subStage;
    if (furthestSubStage) session.furthestSubStage = furthestSubStage;
    if (userProposedCareers) session.userProposedCareers = userProposedCareers;
    if (selectedCriteria) session.selectedCriteria = selectedCriteria;
    if (shortlistedCareers) session.shortlistedCareers = shortlistedCareers;
    if (selectedCareer) session.selectedCareer = selectedCareer;
    if (profileInfo) session.profileInfo = profileInfo;
    if (expertConsulted !== undefined) session.expertConsulted = expertConsulted;
    if (finalRoadmap) session.finalRoadmap = finalRoadmap;

    // 3. Add user message to history
    session.history.push({
      sender: 'user',
      text: message,
      timestamp: new Date(),
      stage: session.stage
    });

    // 4. Request AI Response
    const aiResponse = await openaiService.getAICounselorResponse(
      session.stage,
      session.history.slice(0, -1), // Exclude the message we just added to send as current query
      message,
      session
    );

    // Update session state from AI response if returned (like automatic stage/subStage progression)
    // Capture the stage at which the response was generated
    const responseStage = session.stage;

    if (aiResponse.stage) session.stage = aiResponse.stage;
    if (aiResponse.subStage) session.subStage = aiResponse.subStage;
    if (aiResponse.shortlistedCareers) session.shortlistedCareers = aiResponse.shortlistedCareers;
    if (aiResponse.finalRoadmap) session.finalRoadmap = aiResponse.finalRoadmap;

    // 5. Save AI response to history
    session.history.push({
      sender: 'ai',
      text: aiResponse.text,
      timestamp: new Date(),
      stage: session.stage
    });

    // 6. Update session
    sessionStore.updateSession(sessionId, {
      history: session.history,
      stage: session.stage,
      subStage: session.subStage,
      furthestSubStage: session.furthestSubStage,
      userProposedCareers: session.userProposedCareers,
      shortlistedCareers: session.shortlistedCareers,
      finalRoadmap: session.finalRoadmap
    });

    // 7. Save to persistent history if user is logged in
    historyStore.saveToHistory(session);

    res.json({
      reply: aiResponse.text,
      stage: session.stage,
      subStage: session.subStage,
      furthestSubStage: session.furthestSubStage,
      userProposedCareers: session.userProposedCareers,
      shortlistedCareers: session.shortlistedCareers,
      finalRoadmap: session.finalRoadmap,
      isAnxietyIntervention: aiResponse.isAnxietyIntervention || false,
      history: session.history
    });

  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý tin nhắn của bạn." });
  }
};

/**
 * Update session state details
 */
exports.updateSessionData = (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const updatedSession = sessionStore.updateSession(id, updates);
    if (!updatedSession) {
      return res.status(404).json({ error: "Không thể cập nhật, không tìm thấy phiên" });
    }
    
    // Save to persistent history if user is logged in
    historyStore.saveToHistory(updatedSession);

    res.json(updatedSession);
  } catch (error) {
    console.error("Error in updateSessionData:", error);
    res.status(500).json({ error: "Không thể cập nhật phiên làm việc" });
  }
};

/**
 * Associate session with a logged-in user
 */
exports.associateSession = (req, res) => {
  const { id } = req.params;
  const { userId, userName } = req.body;

  if (!userId) {
    return res.status(400).json({ error: "Yêu cầu cung cấp userId" });
  }

  try {
    const session = sessionStore.getSession(id);
    if (!session) {
      return res.status(404).json({ error: "Không tìm thấy phiên làm việc" });
    }

    session.userId = userId;
    session.userName = userName || 'User';

    // Persist to history immediately
    historyStore.saveToHistory(session);

    res.json({ success: true, session });
  } catch (error) {
    console.error("Error in associateSession:", error);
    res.status(500).json({ error: "Không thể liên kết tài khoản với phiên làm việc" });
  }
};

/**
 * Get consultation history for a user
 */
exports.getUserConsultationHistory = (req, res) => {
  const { userId } = req.params;
  try {
    const historyList = historyStore.getUserHistory(userId);
    res.json(historyList);
  } catch (error) {
    console.error("Error in getUserConsultationHistory:", error);
    res.status(500).json({ error: "Không thể lấy lịch sử tư vấn" });
  }
};

/**
 * Send message to expert AI counselor and get response
 */
exports.sendExpertMessage = async (req, res) => {
  const { message, career, history } = req.body;

  if (!message || !career) {
    return res.status(400).json({ error: "Thiếu thông tin message hoặc career" });
  }

  try {
    const replyText = await openaiService.getAIExpertResponse(message, career, history);
    res.json({ reply: replyText });
  } catch (error) {
    console.error("Error in sendExpertMessage controller:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý tin nhắn của bạn." });
  }
};

/**
 * Delete a session from history
 */
exports.deleteSession = (req, res) => {
  const { id } = req.params;
  try {
    historyStore.deleteSessionFromHistory(id);
    res.json({ success: true, message: "Đã xóa phiên tư vấn thành công" });
  } catch (error) {
    console.error("Error in deleteSession:", error);
    res.status(500).json({ error: "Không thể xóa phiên tư vấn này" });
  }
};
