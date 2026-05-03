require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const chatRoutes = require('./routes/chat');
const predictRoutes = require('./routes/predict');

const app = express();

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: function (origin, callback) {
        // Allow any origin for ease of deployment, or fallback to localhost
        callback(null, origin || '*');
    },
    credentials: true
}));
app.use(express.json());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/predict', predictRoutes);

// Fallback for when frontend has VITE_API_URL set to root domain instead of /api
app.use('/chat', chatRoutes);
app.use('/predict', predictRoutes);

// Health checks
const axios = require('axios');
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

app.get('/api/status', async (req, res) => {
    const status = {
        backend: 'ok',
        ml_service: 'offline',
        model_loaded: false,
        db_connection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };

    try {
        // Try to reach ML service health endpoint
        let targetUrl = ML_SERVICE_URL;
        if (!targetUrl.endsWith('/health')) {
            targetUrl = targetUrl.replace(/\/$/, '') + '/health';
        }
        
        const mlRes = await axios.get(targetUrl, { timeout: 5000 });
        status.ml_service = 'online';
        status.model_loaded = mlRes.data.model_loaded || false;
    } catch (err) {
        console.error('[Status Check] ML Service unreachable:', err.message);
    }

    res.json(status);
});

// Fallback for /status
app.get('/status', (req, res) => res.redirect('/api/status'));

app.get('/', (req, res) => res.json({ status: 'ok', message: 'Lung Cancer Backend API is running' }));
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running', db: mongoose.connection.readyState }));

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/lung-cancer-db')
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        // Start server anyway for API testing even if DB fails initially
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (without MongoDB)`);
        });
    });
