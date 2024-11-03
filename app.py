from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import onnxruntime as ort
import pandas as pd
import numpy as np
import time
from io import StringIO

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the ONNX model once
session = ort.InferenceSession("models/parkinsons_prediction_model.onnx")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Read the uploaded CSV file
    contents = await file.read()
    df = pd.read_csv(StringIO(contents.decode("utf-8")), header=0)

    # Extract individual profile features and movement data
    age = float(df.iloc[0, 1])
    rem_sleep_percentage = float(df.iloc[0, 2])
    deep_sleep_percentage = float(df.iloc[0, 3])
    exercise_frequency = float(df.iloc[0, 4])
    
    movement_data = df.iloc[:, 6].values.astype(np.float32).tolist()  # List of movement values for 24 time steps

    # Prepare inputs for ONNX model
    profile_tensor = np.array([age, rem_sleep_percentage, deep_sleep_percentage, exercise_frequency], dtype=np.float32).reshape(1, -1)
    movement_tensor = np.array(movement_data, dtype=np.float32).reshape(1, 24, 1)

    # Run model inference
    outputs = session.run(None, {
        "profile_input": profile_tensor,
        "movement_input": movement_tensor,
    })

    # Extract prediction
    prediction = float(outputs[0][0])
    prediction_class = "Parkinson" if prediction > 0.5 else "No Parkinson"
    time.sleep(1)
    # Return structured JSON with each feature and the prediction results
    return {
        "Age": age,
        "REM Sleep Percentage": rem_sleep_percentage,
        "Deep Sleep Percentage": deep_sleep_percentage,
        "Exercise Frequency": exercise_frequency,
        "Movement Time Series": movement_data,
        "Parkinsons_Likelihood": prediction,
        "Prediction": prediction_class,
    }
