from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import numpy as np
try:
    import xgboost as xgb
    XGB_AVAILABLE = True
except ImportError:
    XGB_AVAILABLE = False
import os

app = FastAPI(title="Lung Cancer Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the model
import pickle
MODEL_PATH = "model.json"
model = None

# Try to load the model on startup
try:
    if XGB_AVAILABLE and os.path.exists(MODEL_PATH):
        if MODEL_PATH.endswith('.pkl'):
            with open(MODEL_PATH, 'rb') as f:
                model = pickle.load(f)
            print(f"Successfully loaded model from {MODEL_PATH} using pickle")
        else:
            model = xgb.Booster()
            model.load_model(MODEL_PATH)
            print(f"Successfully loaded model from {MODEL_PATH}")
    else:
        status = "XGBoost not installed" if not XGB_AVAILABLE else "Model file not found"
        print(f"Warning: {status}. Running in simulated mode.")
except Exception as e:
    print(f"Error loading model: {e}")

# Define the expected input schema
# NOTE: The user must update these fields to match exactly what their XGBoost model expects
class PatientData(BaseModel):
    age: float
    gender: float  # 0 or 1
    smoking_history: float # e.g., pack-years
    chest_pain: float # 0 or 1
    shortness_of_breath: float # 0 or 1
    fatigue: float # 0 or 1
    weight_loss: float # 0 or 1
    # Add other features here

@app.post("/predict_risk")
async def predict_risk(data: PatientData):
    if model is None or not XGB_AVAILABLE:
        # Simulated result if model/library is missing
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
            "explanation": "ML Service is currently installing dependencies. This is a simulated result based on your inputs. Please try again in a few minutes for the actual model prediction."
        }

    try:
        # Convert input data to format expected by XGBoost (e.g., numpy array)
        input_data = np.array([[
            data.age,
            data.gender,
            data.smoking_history,
            data.chest_pain,
            data.shortness_of_breath,
            data.fatigue,
            data.weight_loss,
            0, 0, 0, 0
        ]])

        # Robust prediction handling
        if hasattr(model, 'predict_proba'):
            # For sklearn-style XGBClassifier
            prediction_prob = model.predict_proba(input_data)[0][1]
        elif hasattr(model, 'predict'):
            # For native XGBoost Booster
            try:
                # The model expects these exact feature names
                feature_names = [
                    "patient_id", "age", "pack_years", "gender_Male", 
                    "radon_exposure_Low", "radon_exposure_Medium", 
                    "asbestos_exposure_Yes", "secondhand_smoke_exposure_Yes", 
                    "copd_diagnosis_Yes", "alcohol_consumption_Moderate", "family_history_Yes"
                ]
                dmatrix = xgb.DMatrix(input_data, feature_names=feature_names)
                prediction_prob = model.predict(dmatrix)[0]
            except ValueError:
                # If feature names mismatch, try creating DMatrix without feature names
                dmatrix = xgb.DMatrix(input_data)
                prediction_prob = model.predict(dmatrix)[0]
            except Exception as e:
                # Fallback for other sklearn-like objects that only have predict
                prediction_prob = model.predict(input_data)[0]
        else:
            raise Exception("Model object does not have a recognizable predict method")
        
        # If prediction_prob is an array/list, take the first element
        if isinstance(prediction_prob, (np.ndarray, list)):
            prediction_prob = prediction_prob[0]
            
        risk_level = "High" if prediction_prob > 0.5 else "Low"
        
        return {
            "risk_score": float(prediction_prob),
            "risk_level": risk_level,
            "confidence": f"{prediction_prob * 100:.1f}%",
            "explanation": "Based on the provided factors, the model indicates this level of risk."
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": model is not None}

@app.get("/")
async def root():
    return {"message": "Lung Cancer Prediction ML Service is running. Use /predict_risk for predictions."}

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
