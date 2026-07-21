const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
const allowedOrigins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',');
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fitcraft')
  .then(() => logger.info('MongoDB connected'))
  .catch(err => { logger.error({ err }, 'MongoDB connection error'); process.exit(1); });
}

// Swagger Docs
try {
  const swaggerDocument = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
} catch (error) {
  logger.warn('Failed to load swagger document - ignoring for now');
}

// Routes
const workoutRoutes = require('./routes/workouts');
const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
app.use('/api/workouts', workoutRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/generate', generateRoutes);

// Centralized Error Handling
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
}

module.exports = app;
