const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3';

const SYSTEM_PROMPT = `You are a helpful, medically knowledgeable AI assistant specializing in answering questions about lung cancer. 
IMPORTANT RULES:
1. You must ONLY answer questions related to lung cancer, risk factors, symptoms, general prevention, and general medical knowledge about the respiratory system.
2. If the user asks about an unrelated topic, politely refuse to answer and steer the conversation back to lung cancer.
3. You are NOT a doctor. You cannot diagnose conditions.
4. Always include a disclaimer at the end of your response stating: "Disclaimer: This information is for educational purposes only. Always consult a doctor or qualified healthcare provider for medical advice and diagnosis."`;

const generateChatResponse = async (prompt, history = []) => {
    try {
        // Construct the full prompt including history and system prompt
        // For simple generate API, we combine them. For chat API we'd use roles.
        // Let's use the chat API which is better for memory
        const CHAT_URL = 'http://localhost:11434/api/chat';
        
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...history,
            { role: 'user', content: prompt }
        ];

        const response = await axios.post(CHAT_URL, {
            model: OLLAMA_MODEL,
            messages: messages,
            stream: false // Set to true if you want to implement streaming later
        });

        return response.data.message.content;
    } catch (error) {
        console.error('Error connecting to Ollama:', error.message);
        throw new Error('Failed to generate response from AI model.');
    }
};

module.exports = {
    generateChatResponse
};
