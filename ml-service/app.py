from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
import os
import traceback

try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False

app = FastAPI(title="Lung Cancer Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_JSON_PATH = os.path.join(BASE_DIR, "model.json")

model = None
model_source = None

def load_model():
    global model, model_source
    if not XGB_AVAILABLE:
        print("CRITICAL: XGBoost library not found.")
        return

    # Load JSON model (more portable for production)
    if os.path.exists(MODEL_JSON_PATH):
        try:
            model = xgb.Booster()
            model.load_model(MODEL_JSON_PATH)
            model_source = "JSON"
            print(f"Successfully loaded model from {MODEL_JSON_PATH}")
            return
        except Exception as e:
            print(f"Error loading JSON model: {e}")

    print("Warning: model.json not found or failed to load. Running in simulated mode.")

# Load model on startup
load_model()

class PatientData(BaseModel):
    patient_id: float = 0
    age: float
    gender: float  # 1 for Male, 0 for Female
    smoking_history: float # pack-years
    chest_pain: float = 0 # 0 or 1
    shortness_of_breath: float = 0 # 0 or 1
    fatigue: float = 0 # 0 or 1
    weight_loss: float = 0 # 0 or 1
    radon_exposure: str = "Low" # Low, Medium, High
    asbestos_exposure: float = 0 # 0 or 1
    secondhand_smoke: float = 0 # 0 or 1
    copd_diagnosis: float = 0 # 0 or 1
    alcohol_consumption: str = "None" # None, Moderate, High
    family_history: float = 0 # 0 or 1

@app.post("/predict_risk")
async def predict_risk(data: PatientData):
    print(f"Prediction request for Patient ID: {data.patient_id}")
    
    if model is None or not XGB_AVAILABLE:
        import random
        base_risk = 0.15
        if data.smoking_history > 10: base_risk += 0.4
        if data.age > 60: base_risk += 0.2
        if data.chest_pain: base_risk += 0.1
        risk = min(0.95, base_risk + random.uniform(-0.05, 0.05))
        
        return {
            "risk_score": risk,
            "risk_level": "High" if risk > 0.6 else "Medium" if risk > 0.3 else "Low",
            "confidence": "Simulated",
            "explanation": "ML Service is running in diagnostic mode. This is a simulated result based on your inputs."
        }

    try:
        # Map radon_exposure
        radon_low = 1 if data.radon_exposure.lower() == "low" else 0
        radon_med = 1 if data.radon_exposure.lower() == "medium" else 0
        
        # Map alcohol_consumption
        alcohol_mod = 1 if data.alcohol_consumption.lower() == "moderate" else 0
        
        # Feature order must match exactly what the model was trained on
        feature_names = [
            "patient_id", "age", "pack_years", "gender_Male", 
            "radon_exposure_Low", "radon_exposure_Medium", 
            "asbestos_exposure_Yes", "secondhand_smoke_exposure_Yes", 
            "copd_diagnosis_Yes", "alcohol_consumption_Moderate", "family_history_Yes"
        ]
        
        input_values = [
            data.patient_id,            # patient_id
            data.age,                   # age
            data.smoking_history,       # pack_years
            data.gender,                # gender_Male
            radon_low,                  # radon_exposure_Low
            radon_med,                  # radon_exposure_Medium
            data.asbestos_exposure,     # asbestos_exposure_Yes
            data.secondhand_smoke,      # secondhand_smoke_exposure_Yes
            data.copd_diagnosis,        # copd_diagnosis_Yes
            alcohol_mod,                # alcohol_consumption_Moderate
            data.family_history         # family_history_Yes
        ]
        
        input_data = np.array([input_values])

        # Prediction logic based on model type
        if model_source == "JSON" or isinstance(model, xgb.Booster):
            dmatrix = xgb.DMatrix(input_data, feature_names=feature_names)
            prediction = model.predict(dmatrix)
        elif hasattr(model, 'predict_proba'):
            # Sklearn-style
            prediction = model.predict_proba(input_data)[:, 1]
        else:
            # Fallback
            prediction = model.predict(input_data)
        
        # Ensure we have a scalar probability
        if isinstance(prediction, (np.ndarray, list)):
            prediction_prob = float(prediction[0])
        else:
            prediction_prob = float(prediction)
            
        # Calibration (Base score in model.json was ~0.68)
        if prediction_prob > 0.85:
            risk_level = "High"
        elif prediction_prob > 0.70:
            risk_level = "Medium"
        else:
            risk_level = "Low"
        
        return {
            "risk_score": prediction_prob,
            "risk_level": risk_level,
            "confidence": f"{prediction_prob * 100:.1f}%",
            "explanation": f"Based on the provided factors, the model indicates a {risk_level.lower()} risk level."
        }
    except Exception as e:
        print(f"Prediction Error: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Internal prediction error: {str(e)}")

@app.get("/health")
async def health():
    return {
        "status": "ok", 
        "model_loaded": model is not None, 
        "model_source": model_source,
        "xgboost_available": XGB_AVAILABLE
    }

@app.get("/")
async def root():
    return {"message": "Lung Cancer Prediction ML Service is running."}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
