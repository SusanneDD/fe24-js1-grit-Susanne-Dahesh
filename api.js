const apiKey = 'fa21b7486125bb7443047d0f48b81942';

export async function fetchWeatherData(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('City not found. Please try again.');
    return await response.json();
}

export async function fetchForecastData(city) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch forecast data.');
    return await response.json();
}
