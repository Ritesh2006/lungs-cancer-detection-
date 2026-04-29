const express = require('express');
const axios = require('axios');
const router = express.Router();

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/predict_risk';

// POST /api/predict
router.post('/', async (req, res) => {
    try {
        const patientData = req.body;
        
        // Basic validation
        if (!patientData || Object.keys(patientData).length === 0) {
            return res.status(400).json({ error: 'Patient data is required' });
        }

        // Forward request to Python ML Microservice
        const response = await axios.post(ML_SERVICE_URL, patientData);

        // Here you would typically save the prediction to MongoDB

        res.json({
            risk_score: response.data.risk_score,
            risk_level: response.data.risk_level,
            confidence: response.data.confidence,
            explanation: response.data.explanation
        });

    } catch (error) {
        console.error('Prediction API error:', error.response?.data || error.message);
        // If ML service is down, provide a mock response for frontend development
        if (error.code === 'ECONNREFUSED') {
            console.error('ML Service is offline.');
            return res.status(503).json({ error: 'ML Prediction Service is currently offline. Please start the Python service.' });
        }
        res.status(500).json({ error: 'Failed to generate prediction: ' + error.message });
    }
});

module.exports = router;
