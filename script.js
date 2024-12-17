import { fetchWeatherData, fetchForecastData } from './api.js';

const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-result');
const loader = document.getElementById('loader');
const errorMessage = document.getElementById('error-message');

searchButton.addEventListener('click', async (event) => {
    event.preventDefault();
    const city = cityInput.value.trim();
    const hours = parseInt(document.getElementById('hours-select').value);

    if (!city) return displayError('Please enter a city.');

    showLoader();
    try {
        const weatherData = await fetchWeatherData(city);
        const forecastData = await fetchForecastData(city);

        displayWeather(weatherData);
        displayForecast(forecastData, hours);
        updateBackground(weatherData.weather[0].main);
    } catch (error) {
        displayError(error.message);
    } finally {
        hideLoader();
    }
});

window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        console.log('Page restored from back-forward cache.');
    }
});


function displayWeather(data) {
    const iconURL = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    weatherContainer.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <img src="${iconURL}" alt="Weather Icon">
        <p><strong>${capitalizeFirstLetter(data.weather[0].description)}</strong></p>
        <p>Temperature: ${data.main.temp.toFixed(1)} °C</p>
        <p>Wind Speed: ${data.wind.speed} m/s</p>
        <h3>Forecast:</h3>
        <div id="forecast-container"></div> <!-- Här kommer prognosen läggas till -->
    `;
    weatherContainer.classList.remove('hidden');
}

function displayForecast(data, hours) {
    const forecastContainer = document.getElementById('forecast-container');
    forecastContainer.innerHTML = ''; 

    // Filtrera ut prognoser för de valda timmarna
    const forecasts = data.list.slice(0, hours / 3);

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const hours = date.getHours();
        const iconURL = `http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`;

        forecastContainer.innerHTML += `
            <div class="forecast-item">
                <p><strong>${hours}:00</strong></p>
                <img src="${iconURL}" alt="Weather Icon">
                <p>Temp: ${forecast.main.temp.toFixed(1)} °C</p>
                <p>${capitalizeFirstLetter(forecast.weather[0].description)}</p>
            </div>
        `;
    });
}

function updateBackground(weatherCondition) {
    const body = document.body;
    if (weatherCondition === 'Clear') {
        body.style.background = 'linear-gradient(135deg, #ffdd94, #ff9a9e)';
    } else if (weatherCondition === 'Rain') {
        body.style.background = 'linear-gradient(135deg, #00c6ff, #0072ff)';
    } else if (weatherCondition === 'Clouds') {
        body.style.background = 'linear-gradient(135deg, #d7d2cc, #304352)';
    } else {
        body.style.background = 'linear-gradient(135deg, #87e5f2, #6a85b6)';
    }
}

function displayError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
}

function showLoader() {
    loader.classList.remove('hidden');
    weatherContainer.classList.add('hidden');
    errorMessage.classList.add('hidden');
}

function hideLoader() {
    loader.classList.add('hidden');
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
