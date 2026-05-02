const express = require('express');
const router = express.Router();
const { generateChatResponse } = require('../services/groqService');

// POST /api/chat
router.post('/', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        // Sanitize history to only include user and assistant roles
        const validHistory = Array.isArray(history) 
            ? history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'assistant',
                content: msg.content
              }))
            : [];

        const reply = await generateChatResponse(message, validHistory);

        res.json({ reply });
    } catch (error) {
        console.error('Chat endpoint error:', error);
        res.status(500).json({ error: 'Failed to process chat message. Please ensure your Groq API key is valid.' });
    }
});

module.exports = router;
