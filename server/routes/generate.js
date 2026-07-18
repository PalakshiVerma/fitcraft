const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { GoogleGenAI } = require('@google/genai');
const verifyToken = require('../middleware/authMiddleware');
const generationCache = require('../utils/generationCache');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many requests from this IP, please try again after an hour'
});

router.post('/', verifyToken, generateLimiter, async (req, res, next) => {
  try {
    const { goal, duration, equipment } = req.body;

    if (!goal || !duration) {
      return res.status(400).json({ message: 'goal and duration are required.' });
    }
    if (!Array.isArray(equipment)) {
      return res.status(400).json({ message: 'equipment must be an array.' });
    }

    const cachedPlan = generationCache.get(goal, duration, equipment);
    if (cachedPlan) {
      return res.json({ ...cachedPlan, cached: true });
    }

    const prompt = `Generate a workout plan for a user.
Goal: ${goal}
Duration: ${duration} minutes
Available Equipment: ${equipment.length > 0 ? equipment.join(', ') : 'None (bodyweight only)'}

Please provide 4-6 exercises appropriate for this duration and goal, using only the available equipment.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'OBJECT',
          properties: {
            name: { type: 'STRING' },
            exercises: {
              type: 'ARRAY',
              items: {
                type: 'OBJECT',
                properties: {
                  name: { type: 'STRING' },
                  sets: { type: 'NUMBER' },
                  reps: { type: 'STRING' },
                  rest: { type: 'STRING' },
                  notes: { type: 'STRING' }
                },
                required: ['name', 'sets', 'reps', 'rest', 'notes']
              }
            }
          },
          required: ['name', 'exercises']
        }
      }
    });

    const workoutPlan = JSON.parse(response.text);
    generationCache.set(goal, duration, equipment, workoutPlan);
    res.json(workoutPlan);

  } catch (error) {
    next(error);
  }
});

module.exports = router;
