import urllib.request
import json

data = {
    "age": 50,
    "gender": 1,
    "smoking_history": 20,
    "chest_pain": 1,
    "shortness_of_breath": 1,
    "fatigue": 1,
    "weight_loss": 0
}

req = urllib.request.Request("http://localhost:8000/predict_risk", data=json.dumps(data).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(response.getcode())
        print(response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode('utf-8'))
