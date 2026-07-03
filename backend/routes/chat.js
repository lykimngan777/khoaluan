const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Initialize or get session
router.post('/session', chatController.initSession);

// Get session status/data
router.get('/session/:id', chatController.getSessionData);

// Send message to AI counselor
router.post('/message', chatController.sendMessage);

// Send message to AI expert counselor
router.post('/expert-message', chatController.sendExpertMessage);

// Update session manually (e.g. state transitions, chosen criteria, etc.)
router.put('/session/:id', chatController.updateSessionData);

// Sync session data (supports simple POST requests to bypass CORS preflight during unload)
router.post('/session/:id/sync', chatController.syncSessionData);

// Associate session with user
router.post('/session/:id/associate', chatController.associateSession);

// Get user consultation history list
router.get('/history/:userId', chatController.getUserConsultationHistory);

// Delete session from history
router.delete('/session/:id', chatController.deleteSession);

module.exports = router;
