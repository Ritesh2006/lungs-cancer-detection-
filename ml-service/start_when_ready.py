import time
import subprocess
import sys

print("Waiting for dependencies to finish installing...")
while True:
    try:
        import xgboost
        import fastapi
        import uvicorn
        break
    except ImportError:
        time.sleep(5)

print("Dependencies are ready. Starting ML service...")
subprocess.run([sys.executable, "app.py"])
