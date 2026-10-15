
const form = document.getElementById("weatherForm");
const cityInput = document.getElementById("city");
const message = document.getElementById("message");
const weatherCard = document.getElementById("weatherCard");

form.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) return;

    message.textContent = "Loading weather...";
    weatherCard.hidden = true;

    try {
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        if (!geoResponse.ok) {
            throw new Error("Unable to find the city.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please try another name.");
        }

        const place = geoData.results[0];

        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`
        );

        if (!weatherResponse.ok) {
            throw new Error("Unable to get weather data.");
        }

        const weatherData = await weatherResponse.json();
        const current = weatherData.current;

        const weatherTypes = {
            0: ["Clear sky", "☀️"],
            1: ["Mainly clear", "🌤️"],
            2: ["Partly cloudy", "⛅"],
            3: ["Overcast", "☁️"],
            45: ["Foggy", "🌫️"],
            48: ["Foggy", "🌫️"],
            51: ["Light drizzle", "🌦️"],
            53: ["Drizzle", "🌦️"],
            55: ["Heavy drizzle", "🌧️"],
            61: ["Light rain", "🌧️"],
            63: ["Rain", "🌧️"],
            65: ["Heavy rain", "🌧️"],
            71: ["Light snow", "🌨️"],
            73: ["Snow", "❄️"],
            75: ["Heavy snow", "❄️"],
            80: ["Rain showers", "🌦️"],
            81: ["Rain showers", "🌧️"],
            82: ["Heavy showers", "⛈️"],
            95: ["Thunderstorm", "⛈️"]
        };

        const [description, icon] =
            weatherTypes[current.weather_code] || ["Weather unavailable", "🌡️"];

        document.getElementById("cityName").textContent =
            `${place.name}, ${place.country}`;

        document.getElementById("weatherIcon").textContent = icon;

        document.getElementById("temperature").textContent =
            `${current.temperature_2m}°C`;

        document.getElementById("description").textContent = description;

        document.getElementById("humidity").textContent =
            `Humidity: ${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `Wind Speed: ${current.wind_speed_10m} km/h`;

        message.textContent = "";
        weatherCard.hidden = false;

    } catch (error) {
        message.textContent = error.message ||
            "Something went wrong. Please try again.";
    }
});
