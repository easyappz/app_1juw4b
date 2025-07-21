const express = require('express');
const router = express.Router();

const authRoutes = require('./routes/auth');
const photoRoutes = require('./routes/photos');
const userRoutes = require('./routes/users');

// Delegate routes to respective routers
router.use('/auth', authRoutes);
router.use('/photos', photoRoutes);
router.use('/users', userRoutes);

// Default API routes for testing
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
