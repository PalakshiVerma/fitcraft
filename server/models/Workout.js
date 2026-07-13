const mongoose = require('mongoose');

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
    type: mongoose.Schema.Types.Mixed, // Equivalent to JSONB in Postgres, stores anything
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

module.exports = mongoose.model('Workout', workoutSchema);
