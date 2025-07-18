from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
import pandas as pd
import requests, io, time

app = FastAPI()

@app.post("/calculate")
async def calculate(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        raw_data = pd.read_csv(io.StringIO(contents.decode("utf-8")))

        # Basic cleaning
        raw_data.columns = raw_data.columns.str.strip()
        raw_data['Point 1 geocode'] = raw_data['Point 1 geocode'].str.strip()
        raw_data['Point 2 geocode'] = raw_data['Point 2 geocode'].str.strip()

        # Filter valid rows
        raw_data.dropna(subset=['Point 1 geocode', 'Point 2 geocode'], inplace=True)
        raw_data = raw_data[raw_data['Point 1 geocode'].str.contains(',')]
        raw_data = raw_data[raw_data['Point 2 geocode'].str.contains(',')]

        # Split coordinates
        raw_data[['lat1', 'lon1']] = raw_data['Point 1 geocode'].str.split(',', expand=True).astype(float)
        raw_data[['lat2', 'lon2']] = raw_data['Point 2 geocode'].str.split(',', expand=True).astype(float)

        base_url = "http://localhost:5000/route/v1/driving"
        forward_dists, reverse_dists = [], []

        for _, row in raw_data.iterrows():
            src = f"{row['lon1']},{row['lat1']};{row['lon2']},{row['lat2']}"
            rev = f"{row['lon2']},{row['lat2']};{row['lon1']},{row['lat1']}"
            try:
                f_resp = requests.get(f"{base_url}/{src}?overview=false")
                f_resp.raise_for_status()
                forward = f_resp.json()['routes'][0]['distance'] / 1000
            except Exception as e:
                forward = None
                print(f"Forward request failed: {e}")

            try:
                r_resp = requests.get(f"{base_url}/{rev}?overview=false")
                r_resp.raise_for_status()
                reverse = r_resp.json()['routes'][0]['distance'] / 1000
            except Exception as e:
                reverse = None
                print(f"Reverse request failed: {e}")

            forward_dists.append(forward)
            reverse_dists.append(reverse)
            time.sleep(0.1)

        raw_data['distance_1_to_2'] = forward_dists
        raw_data['distance_2_to_1'] = reverse_dists

        output = io.StringIO()
        raw_data.to_csv(output, index=False)
        output.seek(0)

        return StreamingResponse(output, media_type="text/csv", headers={
            "Content-Disposition": "attachment; filename=result.csv"
        })

    except Exception as e:
        print(f"Error in calculate endpoint: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})
