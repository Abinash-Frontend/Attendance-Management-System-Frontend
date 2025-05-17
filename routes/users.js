const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { protectAdmin } = require('../middleware/middleware');
const router = express.Router();

const loginHandler = async (req, res, expectedRole) => {
    const { username, password } = req.body;
  
    try {
      const user = await User.findOne({ username });
  
      if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid username or password' });
      }
  
      if (user.role !== expectedRole) {
        return res.status(403).json({ message: `Access denied for ${user.role}` });
      }
  
      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.json({
        message: `${expectedRole} login successful`,
        token,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  };

  router.post('/register', protectAdmin, async (req, res) => {
    const { username, password, role } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    try {
      // Check if user already exists
      const userExists = await User.findOne({ username });
      if (userExists) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Create user
      const user = new User({ username, password, role });
      await user.save();
  
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (err) {
      res.status(500).json({ message: 'Server error', error: err.message });
    }
  });
  
// POST /login/student
router.post('/login/student', async (req, res) => {
    loginHandler(req, res, 'Student');
  });
  
  // POST /login/admin
  router.post('/login/admin', async (req, res) => {
    loginHandler(req, res, 'Admin');
  });

  // GET /students
router.get('/', protectAdmin, async (req, res) => {
    try {
      const students = await User.find({ role: 'Student' }).select('username role');
      res.json(students);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  module.exports = router;