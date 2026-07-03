require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');
const chatRoutes = require('./routes/chat');
const authRoutes = require('./routes/auth');
const expertRoutes = require('./routes/expert');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.text({ type: 'text/plain' }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/expert', expertRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({ message: "Welcome to CareerAI Counselor API Server" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(500).json({ error: "Có lỗi xảy ra từ máy chủ. Vui lòng thử lại sau." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
