const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '../consultation-history.json');

// Ensure file exists
if (!fs.existsSync(HISTORY_FILE)) {
  fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2), 'utf8');
}

function readHistory() {
  try {
    return JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
  } catch (err) {
    console.error("Error reading history file:", err);
    return [];
  }
}

function writeHistory(historyList) {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(historyList, null, 2), 'utf8');
  } catch (err) {
    console.error("Error writing history file:", err);
  }
}

/**
 * Save or update a session in the persistent history file
 */
function saveToHistory(session) {
  if (!session.userId) return; // Only persist history for logged-in users

  const historyList = readHistory();
  const idx = historyList.findIndex(h => h.id === session.id);

  const historyEntry = {
    id: session.id,
    userId: session.userId,
    userName: session.userName || 'User',
    stage: session.stage,
    subStage: session.subStage,
    history: session.history,
    selectedCriteria: session.selectedCriteria || [],
    shortlistedCareers: session.shortlistedCareers || [],
    selectedCareer: session.selectedCareer || null,
    profileInfo: session.profileInfo || {},
    finalRoadmap: session.finalRoadmap || null,
    updatedAt: new Date().toISOString()
  };

  if (idx !== -1) {
    historyList[idx] = historyEntry;
  } else {
    historyList.push(historyEntry);
  }

  writeHistory(historyList);
}

/**
 * Get all history entries for a specific user
 */
function getUserHistory(userId) {
  const historyList = readHistory();
  return historyList
    .filter(h => h.userId === userId)
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Newest first
}

/**
 * Delete a session from persistent history
 */
function deleteSessionFromHistory(sessionId) {
  const historyList = readHistory();
  const filteredList = historyList.filter(h => h.id !== sessionId);
  writeHistory(filteredList);
}

module.exports = {
  saveToHistory,
  getUserHistory,
  deleteSessionFromHistory
};
