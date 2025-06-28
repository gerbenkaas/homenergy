import requests
import time
from datetime import datetime

from db import Session
from models import P1Data, H2OData
from webapp.backend.settings import ip_p1meter, ip_h2ometer

# HomeWizard P1 meter IP address
P1_ADDRESS = ip_p1meter
P1_FW = "v1"
P1_API_URL = f"http://{P1_ADDRESS}/api"

# HomeWizard Watermeter IP address
H2O_ADDRESS = ip_h2ometer
H2O_FW = "v1"
H2O_API_URL = f"http://{H2O_ADDRESS}/api"

def get_p1_data():
    try:
        response = requests.get(f"{P1_API_URL}/{P1_FW}/data")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()  # Parse the JSON response
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching P1 data: {e}")
        return None

def get_h2o_data():
    try:
        response = requests.get(f"{H2O_API_URL}/{H2O_FW}/data")
        response.raise_for_status()  # Raise an error for bad responses
        data = response.json()  # Parse the JSON response
        return data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching data: {e}")
        return None

def store_p1_data(data):
    session = Session()
    try:
        # Extract relevant data (adjust based on actual data structure)
        tariff = data.get("active_tariff")
        tot_pwr_import = float(data.get("total_power_import_kwh"))
        tot_pwr_import_t1 = float(data.get("total_power_import_t1_kwh"))
        tot_pwr_import_t2 = float(data.get("total_power_import_t2_kwh"))
        tot_pwr_export = float(data.get("total_power_export_kwh"))
        tot_pwr_export_t1 = float(data.get("total_power_export_t1_kwh"))
        tot_pwr_export_t2 = float(data.get("total_power_export_t2_kwh"))
        act_pwr = float(data.get("active_power_w"))
        act_pwr_l1 = float(data.get("active_power_l1_w"))
        act_volt_l1 = float(data.get("active_voltage_l1_v"))
        act_curr = float(data.get("active_current_a"))
        act_curr_l1 = float(data.get("active_current_l1_a"))
        volt_sag = float(data.get("voltage_sag_l1_count"))
        volt_swell = float(data.get("voltage_swell_l1_count"))
        any_pwr_fail = float(data.get("any_power_fail_count"))
        long_pwr_fail = float(data.get("long_power_fail_count"))
        tot_gas = float(data.get("total_gas_m3"))
        gas_time = float(data.get("gas_timestamp"))

        # Create a new P1Data instance
        p1_entry = P1Data(
            timestamp = datetime.now(),
            active_tariff = tariff,
            total_power_import_kwh = tot_pwr_import,
            total_power_import_t1_kwh = tot_pwr_import_t1,
            total_power_import_t2_kwh = tot_pwr_import_t2,
            total_power_export_kwh = tot_pwr_export,
            total_power_export_t1_kwh = tot_pwr_export_t1,
            total_power_export_t2_kwh = tot_pwr_export_t2,
            active_power_w = act_pwr,
            active_power_l1_w = act_pwr_l1,
            active_voltage_l1_v = act_volt_l1,
            active_current_a = act_curr,
            active_current_l1_a = act_curr_l1,
            voltage_sag_l1_count = volt_sag,
            voltage_swell_l1_count = volt_swell,
            any_power_fail_count = any_pwr_fail,
            long_power_fail_count = long_pwr_fail,
            total_gas_m3 = tot_gas,
            gas_timestamp = gas_time
        )
        
        # Add and commit the new entry to the database
        session.add(p1_entry)
        session.commit()
        print("P1 meter data logged successfully to the database.")
    except Exception as e:
        print(f"Error logging P1 meter data: {e}")
        session.rollback()  # Rollback in case of error
    finally:
        session.close()

def store_h2o_data(data):
    session = Session()
    try:
        # Extract relevant data (adjust based on actual data structure)
        total = float(data.get("total_liter_m3"))
        active = float(data.get("active_liter_lpm"))
        offset = float(data.get("total_liter_offset_m3"))
        
        # Create a new H2OData instance
        h2o_entry = H2OData(
            timestamp = datetime.now(),
            total_liter_m3 = total,
            active_liter_lpm = active,
            total_liter_offset_m3 = offset
        )
        
        # Add and commit the new entry to the database
        session.add(h2o_entry)
        session.commit()
        print("Water meter data logged successfully to the database.")
    except Exception as e:
        print(f"Error logging water meter data: {e}")
        session.rollback()  # Rollback in case of error
    finally:
        session.close()

def main():
    p1_data = get_p1_data()
    if p1_data:
        store_p1_data(p1_data)

    h2o_data = get_h2o_data()
    if h2o_data:
        store_h2o_data(h2o_data)

if __name__ == "__main__":
    main()
