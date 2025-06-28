from sqlalchemy import create_engine, Column, Float, DateTime, Integer
from sqlalchemy.orm import declarative_base

# SQLAlchemy setup
Base = declarative_base()

class P1Data(Base):
    __tablename__ = 'p1_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    active_tariff = Column(Integer)
    total_power_import_kwh = Column(Float)
    total_power_import_t1_kwh = Column(Float)
    total_power_import_t2_kwh = Column(Float)
    total_power_export_kwh = Column(Float)
    total_power_export_t1_kwh = Column(Float)
    total_power_export_t2_kwh = Column(Float)
    active_power_w = Column(Float)
    active_power_l1_w = Column(Float)
    active_voltage_l1_v = Column(Float)
    active_current_a = Column(Float)
    active_current_l1_a = Column(Float)
    voltage_sag_l1_count = Column(Float)
    voltage_swell_l1_count = Column(Float)
    any_power_fail_count = Column(Float)
    long_power_fail_count = Column(Float)
    total_gas_m3 = Column(Float)
    gas_timestamp = Column(Float)

class H2OData(Base):
    __tablename__ = 'h2o_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    total_liter_m3 = Column(Float)
    active_liter_lpm = Column(Float)
    total_liter_offset_m3 = Column(Float)

class SolarData(Base):
    __tablename__ = 'solar_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    lastUpdateTime = Column(DateTime, nullable=False)
    lastYearData = Column(Float)
    lastMonthData = Column(Float)
    lastDayData = Column(Float)
    currentPower = Column(Float)

class WeatherData(Base):
    __tablename__ = 'weather_data'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    date = Column(DateTime, nullable=False)
    sunrise = Column(DateTime, nullable=False)
    sunset = Column(DateTime, nullable=False)
    sunshine_duration = Column(Float, nullable=True)
    temperature_2m_max = Column(Float, nullable=False)
    temperature_2m_min = Column(Float, nullable=False)
    weather_code = Column(Integer, nullable=False)
    precipitation_sum = Column(Float, nullable=False)
    precipitation_hours = Column(Float, nullable=False)
    wind_direction_10m_dominant = Column(Integer, nullable=False)
