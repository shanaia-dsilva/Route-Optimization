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
    table_name = f"project_{project_name.lower().replace(' ', '_')}"

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
