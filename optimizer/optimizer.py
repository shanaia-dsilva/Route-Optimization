import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def clean_column(col):
    return col.lower().replace(" ", "_").replace("/","_").replace("-","_")

def process_and_optimize(df, project_name):
    # Sanitize column names
    df.columns = [clean_column(c) for c in df.columns]

    # Sanitize table name
    table_name = f"project_{project_name.lower().trim().replace(' ', '_').replace('.','')}"

    conn = mysql.connector.connect(
        host=os.getenv("MYSQL_HOST"),
        user=os.getenv("MYSQL_USER"),
        password=os.getenv("MYSQL_PASSWORD"),
        database=os.getenv("MYSQL_DATABASE"),
        port=int(os.getenv("MYSQL_PORT", 3306))
    )
    cursor = conn.cursor()

    # Build table create SQL from dataframe
    columns = ", ".join([f"{col} TEXT" for col in df.columns])
    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS `{table_name}` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            {columns}
        )
    """)

    # Insert data
    placeholders = ", ".join(["%s"] * len(df.columns))
    column_names = ", ".join(df.columns)
    insert_sql = f"INSERT INTO `{table_name}` ({column_names}) VALUES ({placeholders})"

    for _, row in df.iterrows():
        cursor.execute(insert_sql, tuple(row))

    conn.commit()
    conn.close()
    return {"rows_inserted": len(df), "table": table_name}


# import requests
# import pandas as pd
# from scipy.optimize import linear_sum_assignment

# def get_distance(origin, destination):
#     url = f"http://localhost:5000/route/v1/driving/{origin};{destination}?overview=false"
#     res = requests.get(url).json()
#     return res["routes"][0]["distance"]

# def process_and_optimize(df):
#     buses = df[df["type"] == "bus"]["coords"].tolist()
#     routes = df[df["type"] == "route"]["coords"].tolist()

#     # distance matrix
#     matrix = [[get_distance(bus, route) for route in routes] for bus in buses]

#     row_ind, col_ind = linear_sum_assignment(matrix)

#     matches = [{"bus": buses[i], "route": routes[j], "distance": matrix[i][j]}
#                for i, j in zip(row_ind, col_ind)]
#     return matches