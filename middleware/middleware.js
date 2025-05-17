const jwt = require('jsonwebtoken');
require('dotenv').config();

const  JWT_SECRET  = process.env.JWT_SECRET;

const protectAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);

        if (verified.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
          }

        req.user = verified;
        next();
      } catch (error) {
        res.status(400).json({ error: 'Invalid Token' });
      }
};

const protectStudent = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const verified = jwt.verify(token, JWT_SECRET);
  
      if (verified.role !== 'Student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
      }
  
      req.user = verified;
      next();
    } catch (error) {
      res.status(400).json({ message: 'Invalid token' });
    }
  };

module.exports = { protectAdmin, protectStudent };
