import requests
import time
from datetime import datetime

from db import Session
from models import SolarData

from webapp.backend.settings import site_id, site_api

SE_API_URL = 'https://monitoringapi.solaredge.com/'
SE_SITE_ID = f"site/{site_id}"
SE_SITE_API = f"?api_key={site_api}"

def get_solar_data():
    try:
        response = requests.get(f"{SE_API_URL}/{SE_SITE_ID}/overview.json{SE_SITE_API}")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()  # Parse the JSON response
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data from SolarEdge: {e}")
        return None

def store_solar_data(data):
    session = Session()
    try:
        # Extract relevant data (adjust based on actual data structure)
        last_update_time = datetime.strptime(data.get('overview', {}).get('lastUpdateTime'), '%Y-%m-%d %H:%M:%S')
        last_year_energy = float(data.get('overview', {}).get('lastYearData', {}).get('energy'))
        last_month_energy = float(data.get('overview', {}).get('lastMonthData', {}).get('energy'))
        last_day_energy = float(data.get('overview', {}).get('lastDayData', {}).get('energy'))
        current_power = float(data.get('overview', {}).get('currentPower', {}).get('power'))
        
        # Create a new SolarData instance
        solar_entry = SolarData(
            timestamp = datetime.now(),
            lastUpdateTime = last_update_time,
            lastYearData = last_year_energy,
            lastMonthData = last_month_energy,
            lastDayData = last_day_energy,
            currentPower = current_power
        )
        
        # Add and commit the new entry to the database
        session.add(solar_entry)
        session.commit()
        print("SolarEdge data logged successfully to the database.")
    except Exception as e:
        print(f"Error logging SolarEdge data: {e}")
        session.rollback()  # Rollback in case of error
    finally:
        session.close()

def main():
    se_data = get_solar_data()
    if se_data:
        store_solar_data(se_data)

if __name__ == "__main__":
    main()
