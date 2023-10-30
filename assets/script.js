// var baseURL = 'api.openweathermap.org/data/2.5/forecast?q={city name},{state code},{country code}&appid={API key}'

document.getElementById("searchForm").addEventListener("submit", function(event) {
    event.preventDefault();
    var cityName = document.getElementById("cityInput").value;
    var apiKey = "cf71d792d9799c0f07c3a9fe4e06d1c1"; 
    if (cityName) {
        getWeatherData(cityName, apiKey, function(data) {
            displayWeatherData(data, cityName);
            saveToHistory(cityName);
            updateHistoryUI();
        });
    }
});

function getWeatherData(cityName, apiKey, callback) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=' + apiKey;
    fetch(apiUrl)
        .then(function(response) { 
            return response.json(); 
        })
        .then(callback)
}
function displayWeatherData(data, cityName) {
    if (!data || !data.list) {
        console.error("Invalid weather data");
        return;
    }

   

    // Clear previous data
    document.getElementById("currentWeather").innerHTML = '';
    document.getElementById("forecastWeather").innerHTML = '';

    // Displays as the first element being the current weather
    var currentWeather = data.list[0]; 
    document.getElementById("currentWeather").innerHTML = 
        "<h2>Current Weather in " + cityName + "</h2>" +
        "<p>Date: " + new Date(currentWeather.dt * 1000).toLocaleDateString() + "</p>" +
        "<p>Temperature: " + currentWeather.main.temp + "°K</p>" +
        "<p>Wind Speed: " + currentWeather.wind.speed + " m/s</p>" +
        "<p>Humidity: " + currentWeather.main.humidity + "%</p>" +
        "<img src='http://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png' alt='Weather icon'>";

    // Displays 5-day forecast, skipping every 8 to get daily data (3 hour forecast)
    var forecastHTML = "<h2>5-Day Forecast</h2>";
    for (var i = 0; i < data.list.length; i += 8) {
        var dayData = data.list[i];
        forecastHTML += 
            "<div>" +
            "<p>Date: " + new Date(dayData.dt * 1000).toLocaleDateString() + "</p>" +
            "<p>Temperature: " + kelvinToFahrenheit(dayData.main.temp) + "°F</p>" +
            "<p>Wind Speed: " + dayData.wind.speed + " m/s</p>" +
            "<p>Humidity: " + dayData.main.humidity + "%</p>" +
            "<img src='http://openweathermap.org/img/wn/" + dayData.weather[0].icon + ".png' alt='Weather icon'>" +
            "</div>";
    }
    document.getElementById("forecastWeather").innerHTML = forecastHTML;
}


function saveToHistory() {
    
}

function updateHistoryUI() {
 
}




