require('dotenv').config();
const express = require('express');
const cors = require('cors'); // ✅ Import CORS
const connectDB = require('../config/db'); 
const usersRouter = require('../routes/users');
const classRouter = require('../routes/class');
const attendanceRouter = require('../routes/attendance');

const app = express();
const port = process.env.PORT || 3000;

connectDB(); 

// ✅ Enable CORS for all origins (or specify just localhost for dev)
app.use(cors({
  origin: "http://localhost:5173", // ✅ Use your frontend dev URL
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

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Node.js application!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
