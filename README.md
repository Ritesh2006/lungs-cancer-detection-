# PulmoAI - Lung Cancer Prediction & Assistant

This is a full-stack application containing a React Frontend, a Node.js Backend, and a Python FastAPI microservice for the ML model.

## Prerequisites

To run this project, you MUST install the following on your Windows machine:
1. **Node.js** (v18+) - Required for Frontend and Backend (`npm` command). Download from [nodejs.org](https://nodejs.org/).
2. **Python** (v3.10+) - Required for the ML microservice. Download from [python.org](https://www.python.org/). Check the box "Add Python to PATH" during installation.
3. **Ollama** - Required for the LLaMA 3 chatbot. Download from [ollama.com](https://ollama.com/) and run `ollama run llama3` in your terminal to download the model.

## Setup Instructions

### 1. ML Microservice (Python)
Navigate to the `ml-service` folder:
```bash
cd ml-service
# Place your trained XGBoost model here and name it 'model.json'
pip install -r requirements.txt
python app.py
```
*Note: Make sure to edit `app.py` line 25 to match the exact input features your specific XGBoost model was trained on.*

### 2. Backend (Node.js)
Navigate to the `backend` folder:
```bash
cd backend
npm install
# Make sure Ollama is running in the background before starting
npm run dev
```

### 3. Frontend (React)
Navigate to the `frontend` folder:
```bash
cd frontend
npm install
npm run dev
```

## Keep Awake (24/7 Production)

Free hosting services like Render or Koyeb put services to "sleep" after inactivity. To keep PulmoAI awake 24/7:

1. **Self-Pinging (Automatic)**:
   - The backend now includes a self-pinging mechanism.
   - In your Render/Railway dashboard, add an environment variable:
     - `RENDER_EXTERNAL_URL`: `https://your-backend-app-name.onrender.com`
   - This will make the backend ping itself every 14 minutes, preventing it from sleeping.

2. **External Uptime Monitor (Recommended)**:
   - Use a service like **[UptimeRobot](https://uptimerobot.com/)** or **[Cron-job.org](https://cron-job.org/)**.
   - Create a monitor to ping: `https://your-backend-app-name.onrender.com/health`
   - Set the interval to **every 5-10 minutes**.
   - This ensures the model is always loaded and ready for users.
