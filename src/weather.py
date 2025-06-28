import requests
import time
from datetime import datetime

from db import Session
from models import WeatherData

OM_API_URL = 'https://api.open-meteo.com/v1/forecast?'
OM_LOCATION = 'latitude=51.4817&longitude=5.6611'
OM_PARAMS = '&daily=sunrise,sunset,sunshine_duration,temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum,precipitation_hours,wind_direction_10m_dominant'
OM_MODEL = '&models=knmi_seamless'
OM_TIMEZONE = '&timezone=Europe%2FBerlin'
OM_FC_DAYS = '&forecast_days=3'


def get_weather_data():
    try:
        response = requests.get(f"{OM_API_URL}{OM_LOCATION}{OM_PARAMS}{OM_MODEL}{OM_TIMEZONE}{OM_FC_DAYS}")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()  # Parse the JSON response
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from Open Meteo: {e}")
        return None

def store_weather_data(data):
    session = Session()
    try:
        # First delete current entries, we're not interested in the old forecast
        session.query(WeatherData).delete()
        session.commit()
        # Next, loop through the daily data and insert into the database
        for i in range(len(data['daily']['time'])):
            daily_record = WeatherData(
                date=datetime.fromisoformat(data['daily']['time'][i]),
                sunrise=datetime.fromisoformat(data['daily']['sunrise'][i]),
                sunset=datetime.fromisoformat(data['daily']['sunset'][i]),
                sunshine_duration=float(data['daily']['sunshine_duration'][i]) if data['daily']['sunshine_duration'][i] is not None else None,
                temperature_2m_max=float(data['daily']['temperature_2m_max'][i]),
                temperature_2m_min=float(data['daily']['temperature_2m_min'][i]),
                weather_code=int(data['daily']['weather_code'][i]),
                precipitation_sum=float(data['daily']['precipitation_sum'][i]),
                precipitation_hours=float(data['daily']['precipitation_hours'][i]),
                wind_direction_10m_dominant=int(data['daily']['wind_direction_10m_dominant'][i])
            )
            
            # Add the record to the session
            session.add(daily_record)
        
        # Add and commit the new entry to the database
        # session.add(solar_entry)
        session.commit()
        print("Weather data logged successfully to the database.")
    except Exception as e:
        print(f"Error logging weather data: {e}")
        session.rollback()  # Rollback in case of error
    finally:
        session.close()

def main():
    weather_data = get_weather_data()
    if weather_data:
        store_weather_data(weather_data)

if __name__ == "__main__":
    main()
