const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const SESSIONS_FILE = path.join(__dirname, '../consulting-sessions.json');

function readSessions() {
  try {
    return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
  } catch { return []; }
}

function writeSessions(sessions) {
  fs.writeFileSync(SESSIONS_FILE, JSON.stringify(sessions, null, 2));
}

// GET /api/expert/sessions — lấy toàn bộ sessions (expert dùng)
router.get('/sessions', (req, res) => {
  console.log(`[EXPERT ROUTE] GET /sessions - Fetching all sessions`);
  const sessions = readSessions();
  res.json(sessions);
});

// POST /api/expert/sessions — user tạo yêu cầu tư vấn mới
router.post('/sessions', (req, res) => {
  const { userId, userName, careerName } = req.body;
  console.log(`[EXPERT ROUTE] POST /sessions - Create new session requested by user: ${userName} (ID: ${userId}) for career: ${careerName}`);
  
  if (!userId || !userName) {
    console.warn(`[EXPERT ROUTE] POST /sessions - Missing userId or userName!`);
    return res.status(400).json({ error: 'Thiếu thông tin userId hoặc userName' });
  }

  const sessions = readSessions();

  // Kiểm tra nếu user đã có session pending/active
  const existing = sessions.find(
    s => s.userId === userId && (s.status === 'pending' || s.status === 'active')
  );
  if (existing) {
    console.log(`[EXPERT ROUTE] POST /sessions - Found existing active/pending session: ${existing.id}`);
    return res.json(existing);
  }

  const newSession = {
    id: 'cs_' + Date.now(),
    userId,
    userName,
    careerName: careerName || 'Chưa xác định',
    status: 'pending', // pending | active | closed
    createdAt: new Date().toISOString(),
    acceptedAt: null,
    messages: [
      {
        id: 'msg_init',
        sender: 'user',
        senderName: userName,
        text: 'Tư vấn với chuyên gia',
        time: new Date().toISOString()
      },
      {
        id: 'msg_pending_notice',
        sender: 'expert',
        senderName: 'Hệ thống',
        text: 'Hệ thống đã gửi yêu cầu của bạn đến chuyên gia. Vui lòng chờ chuyên gia chấp nhận kết nối trong giây lát...',
        time: new Date().toISOString()
      }
    ]
  };

  sessions.push(newSession);
  writeSessions(sessions);
  console.log(`[EXPERT ROUTE] POST /sessions - Created new session successfully: ${newSession.id}`);
  res.json(newSession);
});

// GET /api/expert/sessions/:id — lấy 1 session (polling messages)
router.get('/sessions/:id', (req, res) => {
  console.log(`[EXPERT ROUTE] GET /sessions/${req.params.id} - Polling session`);
  const sessions = readSessions();
  const session = sessions.find(s => s.id === req.params.id);
  if (!session) {
    console.warn(`[EXPERT ROUTE] GET /sessions/${req.params.id} - Session not found!`);
    return res.status(404).json({ error: 'Không tìm thấy phiên tư vấn' });
  }
  res.json(session);
});

// PUT /api/expert/sessions/:id/accept — chuyên gia chấp nhận tư vấn
router.put('/sessions/:id/accept', (req, res) => {
  console.log(`[EXPERT ROUTE] PUT /sessions/${req.params.id}/accept - Accept requested`);
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy phiên tư vấn' });

  sessions[idx].status = 'active';
  sessions[idx].acceptedAt = new Date().toISOString();

  // Thêm tin nhắn chào từ chuyên gia
  const career = sessions[idx].careerName || 'nghề của em';
  sessions[idx].messages.push({
    id: 'msg_' + Date.now(),
    sender: 'expert',
    senderName: 'Chuyên gia Hướng nghiệp',
    text: `Chào em! Thầy là chuyên gia hướng nghiệp CareerAI. Thầy đã xem qua lộ trình **${career}** của em. Em có câu hỏi gì cần thầy tư vấn thêm không?`,
    time: new Date().toISOString()
  });

  writeSessions(sessions);
  res.json(sessions[idx]);
});

// PUT /api/expert/sessions/:id/close — đóng phiên tư vấn
router.put('/sessions/:id/close', (req, res) => {
  console.log(`[EXPERT ROUTE] PUT /sessions/${req.params.id}/close - Close requested`);
  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy phiên tư vấn' });

  sessions[idx].status = 'closed';
  sessions[idx].closedAt = new Date().toISOString();
  writeSessions(sessions);
  res.json(sessions[idx]);
});

// POST /api/expert/sessions/:id/message — gửi tin nhắn (user hoặc expert)
router.post('/sessions/:id/message', (req, res) => {
  const { sender, senderName, text } = req.body;
  console.log(`[EXPERT ROUTE] POST /sessions/${req.params.id}/message - New message from ${senderName} (${sender}): "${text}"`);
  
  if (!sender || !text) return res.status(400).json({ error: 'Thiếu sender hoặc text' });

  const sessions = readSessions();
  const idx = sessions.findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Không tìm thấy phiên tư vấn' });

  const msg = {
    id: 'msg_' + Date.now(),
    sender,
    senderName: senderName || sender,
    text,
    time: new Date().toISOString()
  };

  sessions[idx].messages.push(msg);
  writeSessions(sessions);
  res.json({ message: msg, session: sessions[idx] });
});

// DELETE /api/expert/sessions/:id — xóa phiên tư vấn
router.delete('/sessions/:id', (req, res) => {
  const sessions = readSessions();
  const filtered = sessions.filter(s => s.id !== req.params.id);
  writeSessions(filtered);
  res.json({ success: true, message: 'Đã xóa phiên tư vấn thành công' });
});

module.exports = router;
