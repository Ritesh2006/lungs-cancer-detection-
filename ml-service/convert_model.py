import pickle
import xgboost as xgb

with open('best_xgb_model (1).pkl', 'rb') as f:
    model = pickle.load(f)

# model is an XGBClassifier
print("Model loaded")
model.save_model('best_xgb_model.json')
print("Model saved to best_xgb_model.json")
