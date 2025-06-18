from fastapi import FastAPI, UploadFile, File, Query
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from optimizer.optimizer import process_and_optimize

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import HTTPException

@app.post("/optimize")
async def optimize(file: UploadFile = File(...), project_name: str = Query(...)):
    try:
        df = pd.read_csv(file.file)
        result = process_and_optimize(df, project_name)
        return {
            "message": "Optimization complete",
            "project": project_name,
            "head": df.head().to_dict(orient="records"),  # ✅ Moved here
            "result": result
        }
    except Exception as e:
        print("❌ ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))
