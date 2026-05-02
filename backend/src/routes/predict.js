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

        // Ensure the URL ends with /predict_risk
        let targetUrl = ML_SERVICE_URL;
        if (!targetUrl.endsWith('/predict_risk')) {
            targetUrl = targetUrl.replace(/\/$/, '') + '/predict_risk';
        }

        console.log(`[Backend] Calling ML Service at: ${targetUrl}`);
        
        // Forward request to Python ML Microservice
        const response = await axios.post(targetUrl, patientData, {
            timeout: 25000 // 25s timeout to stay within Render's 30s limit
        });

        // Here you would typically save the prediction to MongoDB

        res.json({
            risk_score: response.data.risk_score,
            risk_level: response.data.risk_level,
            confidence: response.data.confidence,
            explanation: response.data.explanation
        });

    } catch (error) {
        console.error('Prediction API error:', error.response?.data || error.message);
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.error('ML Service is offline or unreachable.');
            return res.status(503).json({ error: 'Cannot reach the Python ML Service. If in production, please ensure ML_SERVICE_URL is set correctly in your environment variables.' });
        }
        res.status(500).json({ error: 'Failed to generate prediction. If in production, check if the ML service is running and ML_SERVICE_URL is correct. Detail: ' + error.message });
    }
});

module.exports = router;
