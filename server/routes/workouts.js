const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const verifyToken = require('../middleware/authMiddleware');

// Protect all workout routes with Firebase Auth middleware
router.use(verifyToken);

// Get all workouts for the logged in user
router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    let limit = parseInt(req.query.limit, 10) || 10;
    if (limit > 50) limit = 50;

    const skip = (page - 1) * limit;

    const [workouts, total] = await Promise.all([
      Workout.find({ userId: req.user.uid }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Workout.countDocuments({ userId: req.user.uid })
    ]);

    res.json({
      workouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new workout
router.post('/', async (req, res) => {
  try {
    const newWorkout = new Workout({
      ...req.body,
      userId: req.user.uid // Force the userId to be the logged-in user
    });
    const savedWorkout = await newWorkout.save();
    res.status(201).json(savedWorkout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a single workout
router.get('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    next(error);
  }
});

// Update a workout
router.put('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
      req.body,
      { new: true }
    );
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a workout
router.delete('/:id', async (req, res, next) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
