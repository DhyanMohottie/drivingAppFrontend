import pickle
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    with open("model.pkl", "rb") as f:
        model = pickle.load(f)
except Exception as e:
    raise RuntimeError(f"Could not load model: {e}")

@app.get("/predict_attendance/")
async def predict_attendance(start_time: str):
    try:
       
        hour = pd.to_datetime(start_time, format='%H:%M').hour
        input_df = pd.DataFrame({'Time': [hour]})
        prediction = model.predict(input_df)[0]
        return {"predicted_attendance": int(round(prediction))}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
