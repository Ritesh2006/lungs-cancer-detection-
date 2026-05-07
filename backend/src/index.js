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
            
            // Keep-alive logic for production (Render/Koyeb/Railway)
            const BACKEND_URL = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;
            if (BACKEND_URL) {
                console.log(`[Keep-Alive] Self-pinging enabled for: ${BACKEND_URL}`);
                setInterval(async () => {
                    try {
                        // Ping self
                        await axios.get(`${BACKEND_URL}/health`);
                        console.log('[Keep-Alive] Self-ping successful');
                        
                        // Ping ML Service if it's a different URL
                        if (ML_SERVICE_URL && !ML_SERVICE_URL.includes('localhost')) {
                            const mlHealthUrl = ML_SERVICE_URL.replace(/\/predict_risk$/, '') + '/health';
                            await axios.get(mlHealthUrl);
                            console.log('[Keep-Alive] ML Service ping successful');
                        }
                    } catch (err) {
                        console.error('[Keep-Alive] Ping failed:', err.message);
                    }
                }, 14 * 60 * 1000); // Ping every 14 minutes
            } else {
                console.log('[Keep-Alive] Not enabled (set RENDER_EXTERNAL_URL or BACKEND_URL in env)');
            }
        });
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        // Start server anyway for API testing even if DB fails initially
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} (without MongoDB)`);
        });
    });
