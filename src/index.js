require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');

// Route files
const usersRouter = require('../routes/users');
const classRouter = require('../routes/class');
const attendanceRouter = require('../routes/attendance');

const app = express();
const port = process.env.PORT || 3000;

// Connect to database
connectDB();

// ✅ CORS Setup (for local dev and deployed frontend)
const allowedOrigins = [
  "http://localhost:5173", // Local dev
  "https://attendence-management-system-teuy.onrender.com" // Deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', usersRouter);
app.use('/api/class', classRouter);
app.use('/api/attendance', attendanceRouter);

// Root route
app.get('/', (req, res) => {
  res.json({ message: '✅ Backend API is up and running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
