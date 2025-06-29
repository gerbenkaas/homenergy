let pwrChart, gasChart, waterChart, solarChart; // Global variables to hold chart instances

const weatherCodeMap = {
    0: { text: "Clear sky", icon: "bi-sun" },
    1: { text: "Mainly clear", icon: "bi-sun" },
    2: { text: "Partly cloudy", icon: "bi-cloud-sun" },
    3: { text: "Overcast", icon: "bi-cloud" },
    45: { text: "Fog", icon: "bi-cloud-fog" },
    48: { text: "Rime fog", icon: "bi-cloud-fog" },
    51: { text: "Light drizzle", icon: "bi-cloud-drizzle" },
    53: { text: "Moderate drizzle", icon: "bi-cloud-drizzle" },
    55: { text: "Heavy drizzle", icon: "bi-cloud-drizzle" },
    56: { text: "Freezing drizzle", icon: "bi-cloud-drizzle" },
    57: { text: "Dense freezing drizzle", icon: "bi-cloud-drizzle" },
    61: { text: "Light rain", icon: "bi-cloud-rain" },
    63: { text: "Moderate rain", icon: "bi-cloud-rain" },
    65: { text: "Heavy rain", icon: "bi-cloud-rain-heavy" },
    66: { text: "Freezing rain", icon: "bi-cloud-rain" },
    67: { text: "Heavy freezing rain", icon: "bi-cloud-rain-heavy" },
    71: { text: "Light snow", icon: "bi-cloud-snow" },
    73: { text: "Moderate snow", icon: "bi-cloud-snow" },
    75: { text: "Heavy snow", icon: "bi-cloud-snow" },
    77: { text: "Snow grains", icon: "bi-cloud-snow" },
    80: { text: "Light showers", icon: "bi-cloud-drizzle" },
    81: { text: "Moderate showers", icon: "bi-cloud-rain" },
    82: { text: "Violent showers", icon: "bi-cloud-rain-heavy" },
    85: { text: "Light snow showers", icon: "bi-cloud-snow" },
    86: { text: "Heavy snow showers", icon: "bi-cloud-snow" },
    95: { text: "Thunderstorm", icon: "bi-cloud-lightning" },
    96: { text: "Thunderstorm with hail", icon: "bi-cloud-lightning-rain" },
    99: { text: "Severe thunderstorm with hail", icon: "bi-cloud-lightning-rain" }
};

var tariffWater = 1.0;
var tariffGas = 0.5;
var tariffImpT1 = 0.1;
var tariffImpT2 = 0.15;
var tariffExpT1 = 0.1;
var tariffExpT2 = 0.15;

async function fetchData() {
    const response = await fetch('http://192.168.1.3:8000/api/data');
    const data = await response.json();
    return data;
}

function getWeatherInfo(code) {
    return weatherCodeMap[code] || { text: "Unknown", icon: "bi-question-circle" };
}

function createPowerChart(powerData) {
    const ctx = document.getElementById('powerChart').getContext('2d');
    const labels = powerData.map(item => item.timestamp);
    const activePowerData = powerData.map(item => item.active_power_w);

    pwrChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Power Consumption (today)',
                    data: activePowerData,
                    borderColor: 'rgba(153, 102, 255,1)',
                    backgroundColor: 'rgba(153, 102, 255,.5)',
                    borderWidth: 1,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 0,
                    pointHoverRadius: 15,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (HH:MM)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    ticks: {
                        callback: function(val, index) {
                            return index % 2 === 0 ? this.getLabelForValue(val).slice(11, 16) : '';
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (W)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createSolarChart(solarData) {
    const ctx = document.getElementById('solarChart').getContext('2d');
    const labels = solarData.map(item => item.lastUpdateTime);
    const activeSolarData = solarData.map(item => item.currentPower);

    solarChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Solar Power Production (today)',
                    data: activeSolarData,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64,.5)',
                    borderWidth: 1,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 0,
                    pointHoverRadius: 15,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (HH:MM)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    ticks: {
                        callback: function(val, index) {
                            return index % 2 === 0 ? this.getLabelForValue(val).slice(11, 16) : '';
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Power (W)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createGasChart(gasData) {
    const ctx = document.getElementById('gasChart').getContext('2d');
    const labels = gasData.map(item => item.timestamp);
    const gasConsumedData = gasData.map(item => item.total_gas_m3);
    const offset = gasConsumedData[1];
    const todayGasData = gasConsumedData.map(value => value - offset);
    const gasUsagePerMinute = todayGasData.map((usage, index) => {
        if (index === 0) return 0; // First minute has no previous data to compare
        return usage - todayGasData[index - 1]; // Calculate the difference
    });

    gasChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Gas Consumption (today)',
                    data: gasUsagePerMinute,
                    borderColor: 'rgba(255, 99, 133, 1)',
                    backgroundColor: 'rgba(255, 99, 133, .5)',
                    borderWidth: 1,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 0,
                    pointHoverRadius: 15,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (HH:MM)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    ticks: {
                        callback: function(val, index) {
                            return index % 2 === 0 ? this.getLabelForValue(val).slice(11, 16) : '';
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Gas (m3/min)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createWaterChart(waterData) {
    const ctx = document.getElementById('waterChart').getContext('2d');
    const labels = waterData.map(item => item.timestamp);
    const waterActiveData = waterData.map(item => item.active_liter_lpm);
    //const offset = waterConsumedData[1];
    //const todayWaterData = waterActiveData.map(value => value - offset);

    waterChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Water Consumption (today)',
                    data: waterActiveData,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, .5)',
                    borderWidth: 1,
                    fill: false,
                    pointStyle: 'circle',
                    pointRadius: 0,
                    pointHoverRadius: 15,
                },
            ],
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: 'Time (HH:MM)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    ticks: {
                        callback: function(val, index) {
                            return index % 2 === 0 ? this.getLabelForValue(val).slice(11, 16) : '';
                        },
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: 'Water (lpm)',
                        font: {
                            weight: 'bold',
                        },
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to update charts and display data
function updateCharts() {
    fetchData().then(data => {
        
        // Display of some summarized power data
        if (data.power_data.length > 1) {
            const lastPwrIndex = data.power_data.length - 1;
            const lastTimestamp = data.power_data[lastPwrIndex].timestamp; // Get the last timestamp
            var activeTariff = data.power_data[lastPwrIndex].active_tariff; // Get the last tariff 
            document.getElementById('lastTimestamp').innerText = `${lastTimestamp}`;
            document.getElementById('activeTariff').innerText = `${activeTariff}`;
            // Summary of total
            const totalPwrImport = data.power_data[lastPwrIndex].total_power_import_kwh; // Get the last power import
            const totalPwrImportT1 = data.power_data[lastPwrIndex].total_power_import_t1_kwh; // Get the last power import T1
            const totalPwrImportT2 = data.power_data[lastPwrIndex].total_power_import_t2_kwh; // Get the last power import T2
            const totalPwrExport = data.power_data[lastPwrIndex].total_power_export_kwh; // Get the last power export 
            const totalPwrExportT1 = data.power_data[lastPwrIndex].total_power_export_t1_kwh; // Get the last power export T1
            const totalPwrExportT2 = data.power_data[lastPwrIndex].total_power_export_t2_kwh; // Get the last power export T2
            const totalGas = data.power_data[lastPwrIndex].total_gas_m3; // Get the last gas
            //document.getElementById('totalGas').innerText = `${totalGas.toFixed(1)}`;
            // Summary of today
            const todayImportT1 = totalPwrImportT1 - data.power_data[0].total_power_import_t1_kwh;
            const todayImportT2 = totalPwrImportT2 - data.power_data[0].total_power_import_t2_kwh; 
            var todayExportT1 = totalPwrExportT1 - data.power_data[0].total_power_export_t1_kwh;
            var todayExportT2 = totalPwrExportT2 - data.power_data[0].total_power_export_t2_kwh; 
            const todayGas = totalGas - data.power_data[0].total_gas_m3;
            document.getElementById('pwrImportT1').innerText = `${todayImportT1.toFixed(1)} kWh`;
            document.getElementById('pwrImportT2').innerText = `${todayImportT2.toFixed(1)} kWh`;
            document.getElementById('pwrExportT1').innerText = `${todayExportT1.toFixed(1)} kWh`;
            document.getElementById('pwrExportT2').innerText = `${todayExportT2.toFixed(1)} kWh`;
            document.getElementById('todayGas').innerText = `${todayGas.toFixed(2)}`;
            // Summary of now
            const activePower = data.power_data[lastPwrIndex].active_power_w; // Get the active power use
            document.getElementById('activePower').innerText = `${activePower} W`;
            // Costs
            const todayGasCost = todayGas * tariffGas;
            document.getElementById('todayGasCost').innerText = `${todayGasCost.toFixed(2)}`;
            const todayImportT1Cost = todayImportT1 * tariffImpT1;
            const todayImportT2Cost = todayImportT2 * tariffImpT2;
            const todayExportT1Rev = todayExportT1 * tariffExpT1;
            const todayExportT2Rev = todayExportT2 * tariffExpT2;
            document.getElementById('pwrImportT1Cost').innerText = `${todayImportT1Cost.toFixed(2)}`;
            document.getElementById('pwrImportT2Cost').innerText = `${todayImportT2Cost.toFixed(2)}`;
            document.getElementById('pwrExportT1Rev').innerText = `${todayExportT1Rev.toFixed(2)}`;
            document.getElementById('pwrExportT2Rev').innerText = `${todayExportT2Rev.toFixed(2)}`;
            
        } else {
            document.getElementById('lastTimestamp').innerText = 'No data available for today.';
        }
        
        if (data.water_data.length > 1) {
            const lastWaterIndex = data.water_data.length - 1;
            const totalWater = data.water_data[lastWaterIndex].total_liter_m3; // Get the last liters
            //document.getElementById('totalWater').innerText = `${totalWater.toFixed(1)}`;
            const todayWater = totalWater - data.water_data[0].total_liter_m3;
            document.getElementById('todayWater').innerText = `${(todayWater * 1000).toFixed(0)}`;
            const activeWater = data.water_data[lastWaterIndex].active_liter_lpm; // Get the active flow
            document.getElementById('activeWater').innerText = `${activeWater.toFixed(1)} l/m`;
            const todayWaterCost = todayWater * tariffWater;
            document.getElementById('todayWaterCost').innerText = `${todayWaterCost.toFixed(2)}`;
        }
        
        if (data.solar_data.length > 0) {
            const lastSolarIndex = data.solar_data.length - 1;
            const todaySolar = data.solar_data[lastSolarIndex].lastDayData; // Get the last production
            document.getElementById('todaySolar').innerText = `${(todaySolar / 1000).toFixed(1)} kWh`;
            const activeSolar = data.solar_data[lastSolarIndex].currentPower; // Get the last power
            document.getElementById('activeSolar').innerText = `${activeSolar.toFixed(1)} W`;
            const usageSolar = (todaySolar / 1000) - (todayExportT1 + todayExportT2); // Solar power used
            document.getElementById('usageSolar').innerText = `${(usageSolar).toFixed(1)} kWh`;
        }
        
        if (data.weather_data.length > 0) {
            console.log(data.weather_data);
            for (let i = 0; i < data.weather_data.length; i++) {
                let weather_forecast = data.weather_data[i];
                document.getElementById(`forecastDay${(i + 1)}`).innerText = weather_forecast.date.slice(5, 10);
                document.getElementById(`forecastTmin${(i + 1)}`).innerText = weather_forecast.temperature_2m_min;
                document.getElementById(`forecastTmax${(i + 1)}`).innerText = weather_forecast.temperature_2m_max;
                document.getElementById(`forecastSunrise${(i + 1)}`).innerText = weather_forecast.sunrise.slice(11, 16);
                document.getElementById(`forecastSunset${(i + 1)}`).innerText = weather_forecast.sunset.slice(11, 16);
                document.getElementById(`forecastSunshine${(i + 1)}`).innerText = `${(weather_forecast.sunshine_duration / 3600).toFixed(1)} hrs`;
                const weatherCode = getWeatherInfo(weather_forecast.weather_code);
                const weatherIcon = `<i class="bi ${weatherCode.icon}"></i>`;
                document.getElementById(`forecastCode${(i + 1)}`).innerHTML = weatherIcon;
            }
        }
        
        // Update existing charts with new data
        if (pwrChart) {
            const labels = data.power_data.map(item => item.timestamp);
            const activePowerData = data.power_data.map(item => item.active_power_w);
            pwrChart.data.labels = labels;
            pwrChart.data.datasets[0].data = activePowerData;
            pwrChart.update();
        } else {
            createPowerChart(data.power_data); // Create chart if it doesn't exist
        }
        
        if (solarChart) {
            const labels = data.solar_data.map(item => item.lastUpdateTime);
            const activeSolarData = data.solar_data.map(item => item.currentPower);
            solarChart.data.labels = labels;
            solarChart.data.datasets[0].data = activeSolarData;
            solarChart.update();
        } else {
            createSolarChart(data.solar_data); // Create chart if it doesn't exist
        }

        if (gasChart) {
            const labels = data.power_data.map(item => item.timestamp);
            const gasConsumedData = data.power_data.map(item => item.total_gas_m3);
            const offset = gasConsumedData[1];
            const todayGasData = gasConsumedData.map(value => value - offset);
            const gasUsagePerMinute = todayGasData.map((usage, index) => {
                if (index === 0) return 0; // First minute has no previous data to compare
                return usage - todayGasData[index - 1]; // Calculate the difference
            });
            gasChart.data.labels = labels;
            gasChart.data.datasets[0].data = gasUsagePerMinute;
            gasChart.update();
        } else {
            createGasChart(data.power_data); // Create chart if it doesn't exist
        }

        if (waterChart) {
            const labels = data.water_data.map(item => item.timestamp);
            const waterActiveData = data.water_data.map(item => item.active_liter_lpm);
            //const offset = waterConsumedData[1];
            //const todayWaterData = waterConsumedData.map(value => value - offset);
            waterChart.data.labels = labels;
            waterChart.data.datasets[0].data = waterActiveData;
            waterChart.update();
        } else {
            createWaterChart(data.water_data); // Create chart if it doesn't exist
        }

    });
}

// Initial chart update
updateCharts();

// Set interval to refresh the charts every minute (60000 milliseconds)
setInterval(updateCharts, 60000);
