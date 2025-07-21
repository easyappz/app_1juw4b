const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Photo = require('../models/Photo');
const User = require('../models/User');
const Rating = require('../models/Rating');
const authMiddleware = require('../middleware/auth');

// Multer setup for file upload
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Upload photo
router.post('/upload', authMiddleware, upload.single('photo'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const photo = new Photo({
      userId: req.user.id,
      url: `/uploads/${req.file.filename}`,
      gender: user.gender,
      age: user.age,
    });
    await photo.save();

    res.status(201).json({ message: 'Photo uploaded', photo });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading photo', error: error.message });
  }
});

// Get photos for rating (filtered by gender and age)
router.get('/for-rating', authMiddleware, async (req, res) => {
  try {
    const { gender, minAge, maxAge } = req.query;
    const query = { userId: { $ne: req.user.id }, isActive: true };

    if (gender) query.gender = gender;
    if (minAge) query.age = { ...query.age, $gte: Number(minAge) };
    if (maxAge) query.age = { ...query.age, $lte: Number(maxAge) };

    const photos = await Photo.find(query).populate('userId', 'name');
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching photos', error: error.message });
  }
});

// Rate a photo
router.post('/rate/:photoId', authMiddleware, async (req, res) => {
  try {
    const { score } = req.body;
    const photoId = req.params.photoId;

    if (!score || score < 1 || score > 5) {
      return res.status(400).json({ message: 'Invalid score' });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    if (photo.userId.toString() === req.user.id) {
      return res.status(400).json({ message: 'Cannot rate your own photo' });
    }

    const existingRating = await Rating.findOne({ photoId, userId: req.user.id });
    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this photo' });
    }

    const rating = new Rating({ photoId, userId: req.user.id, score });
    await rating.save();

    photo.ratings.push(rating._id);
    await photo.save();

    // Update points: +1 for rater, -1 for photo owner
    await User.findByIdAndUpdate(req.user.id, { $inc: { points: 1 } });
    await User.findByIdAndUpdate(photo.userId, { $inc: { points: -1 } });

    res.json({ message: 'Photo rated', rating });
  } catch (error) {
    res.status(500).json({ message: 'Error rating photo', error: error.message });
  }
});

// Toggle photo active status
router.put('/toggle-active/:photoId', authMiddleware, async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ message: 'Photo not found' });
    }
    if (photo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to modify this photo' });
    }

    const user = await User.findById(req.user.id);
    if (user.points <= 0 && !photo.isActive) {
      return res.status(400).json({ message: 'Not enough points to activate photo' });
    }

    photo.isActive = !photo.isActive;
    await photo.save();

    res.json({ message: `Photo ${photo.isActive ? 'activated' : 'deactivated'}`, photo });
  } catch (error) {
    res.status(500).json({ message: 'Error toggling photo status', error: error.message });
  }
});

// Get user's photos
router.get('/my-photos', authMiddleware, async (req, res) => {
  try {
    const photos = await Photo.find({ userId: req.user.id });
    res.json({ photos });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user photos', error: error.message });
  }
});

module.exports = router;
