from fastapi import FastAPI, UploadFile, File
from fastapi.responses import StreamingResponse
import pandas as pd
import requests, time, io

app = FastAPI()

@app.post("/calculate")
async def calculate(file: UploadFile = File(...)):
    # Decode and load CSV
    contents = await file.read()
    raw_data = pd.read_csv(io.StringIO(contents.decode('utf-8')))
    raw_data.columns = raw_data.columns.str.strip()

    print("📄 Columns:", raw_data.columns.tolist())
    print("🧪 Sample Rows:\n", raw_data.head(3).to_string())

    # raw_data.columns = raw_data.columns.str.strip()
    # raw_data['Point 1 geocode'] = raw_data['Point 1 geocode'].str.strip()
    # raw_data['Point 2 geocode'] = raw_data['Point 2 geocode'].str.strip()
    
    # raw_data[['lat1', 'lon1']] = raw_data['Point 1 geocode'].str.split(',', expand=True).astype(float)
    # raw_data[['lat2', 'lon2']] = raw_data['Point 2 geocode'].str.split(',', expand=True).astype(float)

    # base_url = "http://localhost:5000/route/v1/driving"
    # fwd, rev = [], []

    # for _, row in raw_data.iterrows():
    #     src = f"{row['lon1']},{row['lat1']};{row['lon2']},{row['lat2']}"
    #     rev_url = f"{row['lon2']},{row['lat2']};{row['lon1']},{row['lat1']}"
        
    #     d1 = d2 = None
    #     try:
    #         r1 = requests.get(f"{base_url}/{src}?overview=false").json()
    #         d1 = r1.get("routes", [{}])[0].get("distance", None) / 1000
    #     except: pass
    #     try:
    #         r2 = requests.get(f"{base_url}/{rev_url}?overview=false").json()
    #         d2 = r2.get("routes", [{}])[0].get("distance", None) / 1000
    #     except: pass

    #     fwd.append(d1)
    #     rev.append(d2)
    #     time.sleep(0.3)

    # raw_data['distance_1_to_2'] = fwd
    # raw_data['distance_2_to_1'] = rev

    # out_csv = io.StringIO()
    # raw_data.to_csv(out_csv, index=False)
    # out_csv.seek(0)

    # return StreamingResponse(out_csv, media_type="text/csv", headers={
    #     "Content-Disposition": "attachment; filename=result.csv"
    # })
