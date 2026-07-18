const { z } = require('zod');

const workoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  goal: z.string().min(1, "Goal is required"),
  duration_minutes: z.number().positive("Duration must be positive"),
  equipment: z.array(z.string()).optional(),
  exercises: z.array(z.object({
    name: z.string(),
    sets: z.number().optional(),
    reps: z.number().optional(),
    duration_seconds: z.number().optional(),
    notes: z.string().optional()
  })).optional(),
  notes: z.string().optional()
});

const validateWorkout = (req, res, next) => {
  try {
    const validatedData = workoutSchema.parse(req.body);
    req.body = validatedData;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Validation Error', details: error.errors });
  }
};

module.exports = { validateWorkout };
