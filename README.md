# homenergy
This is a hobby project provides Python scripts that can be used to read the data from the HomeWizard P1 Meter, the HomeWizard Watermeter, the SolarEdge Cloud-Based Monitoring Platform and open-meteo.com (for a weather forecast). The retreived data is stored to a mysql database.

## Prerequisites
- Python 3, required packages: sqlalchemy, fastapi, requests, mysql.connector 
- MySQL database
- HomeWizard P1 Meter
- HomeWizard Watermeter
- API key for SolarEdge Cloud-Based Monitoring Platform

## Webapp
The front end is created with Bootstrap and Chart.js.

## Usage
Delete code you will not need...

### Connect HomeWizard devices
Setup the HomeWizard devices, add them to your network. 

### Create database
Create a MySQL database to store the data and create a user for the created database, with MariaDB for example. To create a database and add a user in MariaDB, use the following commands:

```sql
CREATE DATABASE your_database_name;
CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_username'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Install Python
Install Python (3.x). Next:

Modify <code>webapp/backend/settings.py</code> and enter your settings for the HomeWizard devices, your Solar Edge API information, the database configuration and the IP address of the host of the frontend. You should now be able to run the scripts below:
```bash
python -m homewizard.py
python -m solar_edge.py
python -m weather.py
```

For the HomeWizard devices, the SolarEdge Cloud-Monitoring and the weather forecast seperate scripts are available in the root folder. These script acquire data <strong>only once</strong>. Add them to a task scheduler to execute the scripts at configered intervals, for example: 
- <code>homewizard.py</code>: run every minute
- <code>solar_edge.py</code>: run every 15 minutes
- <code>weather.py</code>: run once a day, somewhere after midnight for example.

Or, modify the scripts so that they acquire data at the interval you require. Next, follow the steps below (Unix):

```bash
cd /path/to/this/project/webapp/backend
python -m venv venv
source venv/bin/activate
pip install requests fastapi sqlalchemy mysql.connector
deactivate
```

Next (make sure you have adapted <code>start.sh</code>):
```bash
cd /path/to/this/project/webapp
./start.sh
```

### Web application
Visit the web application in your browser by navigationg to http://[frontend_ip]:8080.

## Todo
Some ideas for further development...
- General improvements
- Graph data dessimation
- Daily / Monthly summaries

## Disclaimer
This project is currently under development. While I strive to provide a functional and reliable application, please be aware that it may contain bugs or incomplete features. Support is not provided, and by using this software, you acknowledge that you do so at your own risk. The developer is not liable for any issues that may arise from the use of this application.
