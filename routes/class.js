const express = require('express');
const Class = require('../models/class');
const User = require('../models/users');
const Attendance = require('../models/attendance');
const { protectAdmin } = require('../middleware/middleware');

const router = express.Router();

router.post('/create', protectAdmin, async (req, res) => {
    const { name, subject } = req.body;
    try {
      const newClass = await Class.create({ name, subject });
      res.status(201).json(newClass);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  
  router.post('/:classId/add-student', protectAdmin, async (req, res) => {
    const { studentId } = req.body;
    const { classId } = req.params;
  
    try {
      const klass = await Class.findById(classId);
      if (!klass) return res.status(404).json({ message: 'Class not found' });
  
      if (!klass.students.includes(studentId)) {
        klass.students.push(studentId);
        await klass.save();
      }
  
      res.status(200).json({ message: 'Student added to class' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  // Get all classes
router.get('/', protectAdmin, async (req, res) => {
    try {
      const classes = await Class.find().populate('students', 'username role'); // Optional: populate student info
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.get('/student/:studentId', async (req, res) => {
    const { studentId } = req.params;
  
    try {
      const classes = await Class.find({ students: studentId }).select('name subject');
  
      res.status(200).json(classes);
    } catch (err) {
      res.status(500).json({ message: 'Failed to fetch classes', error: err.message });
    }
  });

  module.exports = router;