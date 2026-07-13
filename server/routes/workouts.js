const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const verifyToken = require('../middleware/authMiddleware');

// Protect all workout routes with Firebase Auth middleware
router.use(verifyToken);

// Get all workouts for the logged in user
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.user.uid }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.get('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOne({ _id: req.params.id, userId: req.user.uid });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
router.delete('/:id', async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!workout) return res.status(404).json({ error: 'Workout not found' });
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
