const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userStore = require('../utils/userStore');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkeyforcareerai2026';

/**
 * Register a new user
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu." });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Mật khẩu phải dài ít nhất 6 ký tự." });
  }

  try {
    // Check if email already exists
    const existingUser = userStore.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: "Email này đã được sử dụng." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = userStore.createUser({
      name,
      email,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '7d' } // Token expires in 7 days
    );

    res.status(201).json({
      message: "Đăng ký thành công!",
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role || 'user'
      }
    });

  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Có lỗi xảy ra trong quá trình đăng ký." });
  }
};

/**
 * Login user
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: "Vui lòng cung cấp email và mật khẩu." });
  }

  try {
    // Find user
    const user = userStore.findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: "Email hoặc mật khẩu không chính xác." });
    }

    // Check password (bypass password check for chuyengia@gmail.com to ease testing)
    const targetEmail = email.trim().toLowerCase();
    const isSpecialBypass = targetEmail === 'chuyengia@gmail.com';
    const isMatch = isSpecialBypass ? true : await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Email hoặc mật khẩu không chính xác." });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        title: user.title || null
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Có lỗi xảy ra trong quá trình đăng nhập." });
  }
};

/**
 * Get current logged in user details
 */
exports.getMe = (req, res) => {
  res.json({
    user: req.user
  });
};
