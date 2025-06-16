from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from optimizer import process_and_optimize

app = FastAPI()

# Allow frontend to talk to backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize")
async def optimize(file: UploadFile = File(...)):
    df = pd.read_csv(file.file)
    result = process_and_optimize(df)
    return {"message": "Optimization complete", "result": result}
