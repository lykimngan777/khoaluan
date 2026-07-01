const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Initialize or get session
router.post('/session', chatController.initSession);

// Get session status/data
router.get('/session/:id', chatController.getSessionData);

// Send message to AI counselor
router.post('/message', chatController.sendMessage);

// Update session manually (e.g. state transitions, chosen criteria, etc.)
router.put('/session/:id', chatController.updateSessionData);

module.exports = router;
