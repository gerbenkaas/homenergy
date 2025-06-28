from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from settings import frontend_ip, db_host, db_name, db_user, db_pass

app = FastAPI()

# Specify allowed origins
allowed_origins = [
    f"{frontend_ip}:8080",     # Replace with your frontend's URL
    "http://localhost:8080",   # Allow localhost for development
    # Add more origins as needed
]

# Allow CORS for your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection
def get_db_connection():
    return mysql.connector.connect(
        host=db_host,
        user=db_user,
        password=db_pass,
        database=db_name
    )

@app.get("/api/data")
def read_data():
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    # SQL query to get today's data from the power meter
    query_power = """
    SELECT 
        timestamp,
        active_tariff,
        total_power_import_kwh,
        total_power_import_t1_kwh,
        total_power_import_t2_kwh,
        total_power_export_kwh,
        total_power_export_t1_kwh,
        total_power_export_t2_kwh,
        active_power_w,
        total_gas_m3 
    FROM 
        homewizard.p1_data 
    WHERE 
        DATE(timestamp) = CURDATE();
    """

    # SQL query to get today's data from the water meter
    query_water = """
    SELECT 
        timestamp,
        total_liter_m3,
        active_liter_lpm
    FROM 
        homewizard.h2o_data 
    WHERE 
        DATE(timestamp) = CURDATE();
    """
    
    # SQL query to get today's data from the solar edge invertor
    query_solar = """
    SELECT 
        timestamp,
        lastUpdateTime,
        lastYearData,
        lastMonthData,
        lastDayData,
        currentPower
    FROM 
        homewizard.solar_data 
    WHERE 
        DATE(lastUpdateTime) = CURDATE();
    """
    
    # SQL query to get today's weather forecast
    query_weather = """
    SELECT 
        *
    FROM 
        homewizard.weather_data 
    WHERE 
        DATE(date) >= CURDATE();
    """

    # Execute the power meter query
    cursor.execute(query_power)
    power_data = cursor.fetchall()

    # Execute the water meter query
    cursor.execute(query_water)
    water_data = cursor.fetchall()
    
    # Execute the solar data query
    cursor.execute(query_solar)
    solar_data = cursor.fetchall()

    # Execute the weather data query
    cursor.execute(query_weather)
    weather_data = cursor.fetchall()
    
    cursor.close()
    conn.close()

    # Return both datasets as separate keys in a JSON response
    return {
        "power_data": power_data,
        "water_data": water_data,
        "solar_data": solar_data,
        "weather_data": weather_data
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
