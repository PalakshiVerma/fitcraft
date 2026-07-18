const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true },
  rest: { type: String, required: true },
  notes: { type: String }
}, { _id: false });

const workoutSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true // Indexing by Firebase UID for fast lookups
  },
  name: {
    type: String,
    required: true
  },
  goal: {
    type: String,
    required: true
  },
  duration_minutes: {
    type: Number,
    required: true
  },
  equipment: {
    type: [String],
    default: []
  },
  exercises: {
    type: [exerciseSchema],
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Workout', workoutSchema);
