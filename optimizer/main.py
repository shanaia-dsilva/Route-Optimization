from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from optimizer import process_and_optimize

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize")
async def optimize(file: UploadFile = File(...), project_name: str = Query(...)):
    df = pd.read_csv(file.file)
    result = process_and_optimize(df, project_name)
    return {"message": "Optimization complete", "result": result}
