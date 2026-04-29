const axios = require('axios');

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.1-8b-instant';

const SYSTEM_PROMPT = `You are a helpful, medically knowledgeable AI assistant specializing in answering questions about lung cancer. 
IMPORTANT RULES:
1. You must ONLY answer questions related to lung cancer, risk factors, symptoms, general prevention, and general medical knowledge about the respiratory system.
2. If the user asks about an unrelated topic, politely refuse to answer and steer the conversation back to lung cancer.
3. You are NOT a doctor. You cannot diagnose conditions.
4. Always include a disclaimer at the end of your response stating: "Disclaimer: This information is for educational purposes only. Always consult a doctor or qualified healthcare provider for medical advice and diagnosis."`;

const generateChatResponse = async (prompt, history = []) => {
    try {
        if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_api_key_here') {
            throw new Error('Groq API Key is missing. Please set it in backend/.env');
        }

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: prompt }
        ];

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: GROQ_MODEL,
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error connecting to Groq:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error?.message || 'Failed to generate response from Groq API.');
    }
};

module.exports = {
    generateChatResponse
};
