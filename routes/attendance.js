const express = require('express');
const Attendance = require('../models/attendance');
const Class = require('../models/class');
const { protectStudent, protectAdmin } = require('../middleware/middleware'); // Auth middleware   

const router = express.Router();

// POST /classes/:classId/attend
router.post('/:classId/attend', protectStudent, async (req, res) => {
  const { classId } = req.params;
  const studentId = req.user.id; // Set by middleware after verifying JWT
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Strip time part for date comparison

  try {
    // Check if class exists
    const klass = await Class.findById(classId);
    if (!klass) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Check if student is part of the class
    if (!klass.students.includes(studentId)) {
      return res.status(403).json({ message: 'You are not enrolled in this class' });
    }

    // Check if attendance already exists for today
    let attendance = await Attendance.findOne({ classId, date: today });

    if (attendance) {
      const alreadyMarked = attendance.records.find(
        record => record.student.toString() === studentId.toString()
      );

      if (alreadyMarked) {
        return res.status(400).json({ message: 'You have already marked attendance for today' });
      }

      // Append to records
      attendance.records.push({ student: studentId, present: true });
    } else {
      // Create new attendance record for today
      attendance = new Attendance({
        classId,
        date: today,
        records: [{ student: studentId, present: true }]
      });
    }

    await attendance.save();
    res.status(200).json({ message: 'Attendance marked successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /attendance/class/:classId?date=YYYY-MM-DD
router.get('/class/:classId', protectAdmin, async (req, res) => {
    const { classId } = req.params;
    const { date } = req.query;
  
    try {
      const filterDate = new Date(date);
      filterDate.setHours(0, 0, 0, 0);
  
      const attendance = await Attendance.findOne({
        classId,
        date: filterDate,
      }).populate('records.student', 'username');
  
      if (!attendance) {
        return res.status(404).json({ message: 'No attendance record found for this date' });
      }
  
      res.json(attendance);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
// GET /attendance/student/:studentId
router.get('/student/:studentId', protectAdmin, async (req, res) => {
    const { studentId } = req.params;
  
    try {
      // Find all attendance records for the student
      const attendanceRecords = await Attendance.find({
        'records.student': studentId
      }).populate('classId', 'name subject');
  
      // Extract relevant info
      const summary = attendanceRecords.map((record) => {
        const studentRecord = record.records.find(
          (r) => r.student.toString() === studentId
        );
  
        return {
          className: record.classId.name,
          subject: record.classId.subject,
          date: record.date,
          present: studentRecord?.present ?? false
        };
      });
  
      res.json(summary);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  
module.exports = router;