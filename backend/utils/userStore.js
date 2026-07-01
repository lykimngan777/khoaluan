const fs = require('fs');
const path = require('path');

const FILE_PATH = path.join(__dirname, '../users.json');

// Initialize file if not exists
if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2), 'utf8');
}

/**
 * Get all users from JSON file
 */
function getAllUsers() {
  try {
    const data = fs.readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
}

/**
 * Save users list to JSON file
 * @param {Array} users 
 */
function saveUsers(users) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(users, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error("Error writing users file:", error);
    return false;
  }
}

/**
 * Find user by email (case-insensitive)
 * @param {string} email 
 */
function findUserByEmail(email) {
  if (!email) return null;
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by id
 * @param {string} id 
 */
function findUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

/**
 * Create a new user
 * @param {object} userData 
 */
function createUser(userData) {
  const users = getAllUsers();
  const newUser = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password,
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  return newUser;
}

module.exports = {
  getAllUsers,
  findUserByEmail,
  findUserById,
  createUser
};
