const jwt = require('jsonwebtoken');
const userStore = require('../utils/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforcareerai2026';

/**
 * Middleware to verify JWT token
 */
function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({ error: "Không tìm thấy token xác thực." });
  }

  // Token format: "Bearer <token>"
  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: "Định dạng token không hợp lệ. Vui lòng gửi dạng Bearer <token>" });
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user to make sure they still exist
    const user = userStore.findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Người dùng không tồn tại hoặc đã bị xóa." });
    }

    // Attach user information to request object
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };
    
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại." });
    }
    return res.status(401).json({ error: "Mã token không hợp lệ hoặc đã bị thay đổi." });
  }
}

module.exports = {
  verifyToken
};
