const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");

const weather = document.getElementById("weather");
const message = document.getElementById("message");

const cityName = document.getElementById("cityName");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");

// Get weather using city name
async function getWeather(city) {
  try {
    message.textContent = "Loading...";

    // Find city coordinates
    const locationResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`
    );

    if (!locationResponse.ok) {
      throw new Error("Unable to find city.");
    }

    const locationData = await locationResponse.json();

    if (!locationData.results || locationData.results.length === 0) {
      throw new Error("City not found. Please enter a valid city.");
    }

    const location = locationData.results[0];

    // Get weather data
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=celsius&wind_speed_unit=kmh`
    );

    if (!weatherResponse.ok) {
      throw new Error("Unable to fetch weather data.");
    }

    const weatherData = await weatherResponse.json();

    // Display JSON data dynamically
    cityName.textContent = `${location.name}, ${location.country}`;
    temperature.textContent = `${weatherData.current.temperature_2m} °C`;
    humidity.textContent = `${weatherData.current.relative_humidity_2m}%`;
    windSpeed.textContent = `${weatherData.current.wind_speed_10m} km/h`;

    message.textContent = "";
    weather.style.display = "block";

  } catch (error) {
    weather.style.display = "none";
    message.textContent = error.message;
  }
}

// Search button
searchBtn.addEventListener("click", function () {
  const city = cityInput.value.trim();

  if (city === "") {
    message.textContent = "Please enter a city name.";
    return;
  }

  getWeather(city);
});

// Press Enter to search
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
