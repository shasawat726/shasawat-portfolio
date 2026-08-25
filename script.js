async function getWeather() {
    document.getElementById("loading").style.display = "block";

    const city = document.getElementById("cityInput").value.trim();

    if (city === "") {
        alert("Please enter a city name");
        return;
    }

    try {

        // Find city
        const geoResponse = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
        );

        const geoData = await geoResponse.json();

        if (!geoData.results) {
            alert("City not found");
            return;
        }

        const location = geoData.results[0];

        // Get current + 5 day forecast
        const weatherResponse = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`
        );

        const weatherData = await weatherResponse.json();

        const current = weatherData.current;
        document.getElementById("loading").style.display = "none";

        // Current weather
        document.getElementById("cityName").textContent =
            `${location.name}, ${location.country}`;

        document.getElementById("temperature").textContent =
            `${Math.round(current.temperature_2m)}°C`;

        document.getElementById("humidity").textContent =
            `${current.relative_humidity_2m}%`;

        document.getElementById("wind").textContent =
            `${Math.round(current.wind_speed_10m)} km/h`;

        document.getElementById("condition").textContent =
            getWeatherCondition(current.weather_code);

        document.getElementById("weatherIcon").textContent =
            getWeatherIcon(current.weather_code);

        // 5 day forecast
        const forecast = document.getElementById("forecast");

        forecast.innerHTML = "";

        for (let i = 0; i < 5; i++) {

            const date = new Date(weatherData.daily.time[i]);

            const dayName = date.toLocaleDateString("en-US", {
                weekday: "short"
            });

            const maxTemp =
                Math.round(weatherData.daily.temperature_2m_max[i]);

            const minTemp =
                Math.round(weatherData.daily.temperature_2m_min[i]);

            const icon =
                getWeatherIcon(weatherData.daily.weather_code[i]);

            forecast.innerHTML += `
                <div class="forecast-card">

                    <h3>${dayName}</h3>

                    <div class="forecast-icon">
                        ${icon}
                    </div>

                    <p>${maxTemp}°C / ${minTemp}°C</p>

                </div>
            `;
        }
        document.getElementById("loading").style.display = "none";

    } catch (error) {

        console.error(error);
        alert("Something went wrong");

    }
}


// Weather condition
function getWeatherCondition(code) {

    if (code === 0) return "Clear Sky";

    if (code >= 1 && code <= 3) return "Partly Cloudy";

    if (code >= 45 && code <= 48) return "Foggy";

    if (code >= 51 && code <= 67) return "Rainy";

    if (code >= 71 && code <= 77) return "Snowy";

    if (code >= 80 && code <= 82) return "Rain Showers";

    if (code >= 95) return "Thunderstorm";

    return "Unknown";
}


// Weather icon
function getWeatherIcon(code) {

    if (code === 0) return "☀️";

    if (code >= 1 && code <= 3) return "⛅";

    if (code >= 45 && code <= 48) return "🌫️";

    if (code >= 51 && code <= 67) return "🌧️";

    if (code >= 71 && code <= 77) return "❄️";

    if (code >= 80 && code <= 82) return "🌦️";

    if (code >= 95) return "⛈️";

    return "🌍";
}


// Press Enter to search
document.getElementById("cityInput").addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        getWeather();
    }

});
function getMyLocation() {

    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
    }

    navigator.geolocation.getCurrentPosition(

        async function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=celsius&wind_speed_unit=kmh`
                );

                const data = await response.json();

                const current = data.current;

                document.getElementById("cityName").textContent =
                    "📍 Your Location";

                document.getElementById("temperature").textContent =
                    `${Math.round(current.temperature_2m)}°C`;

                document.getElementById("humidity").textContent =
                    `${current.relative_humidity_2m}%`;

                document.getElementById("wind").textContent =
                    `${Math.round(current.wind_speed_10m)} km/h`;

                document.getElementById("condition").textContent =
                    getWeatherCondition(current.weather_code);

                document.getElementById("weatherIcon").textContent =
                    getWeatherIcon(current.weather_code);

            } catch (error) {

                alert("Unable to get weather data.");

            }
        },

        function() {
            alert("Please allow location access to use this feature.");
        }
    );
}
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
