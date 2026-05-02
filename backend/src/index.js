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

// Health check
app.get('/', (req, res) => res.json({ status: 'ok', message: 'Lung Cancer Backend API is running' }));
app.get('/health', (req, res) => res.json({ status: 'ok', message: 'Backend is running' }));

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
