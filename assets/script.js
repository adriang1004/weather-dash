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

function kelvinToFahrenheit(kelvin) {
    var fahrenheit = (kelvin - 273.15) * 9/5 + 32;
    return Math.round(fahrenheit);
}

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
        // returns an error if city input is invalid
        console.error("Invalid weather data");
        return;
    }
    // clear previous data
    document.getElementById("currentWeather").innerHTML = '';
    document.getElementById("forecastWeather").innerHTML = '';
    // displays as the first element being the current weather
    var currentWeather = data.list[0]; 
    document.getElementById("currentWeather").innerHTML = 
        "<div class='weather-container'>" +
        "<h3>Current Weather in " + cityName + "</h3>" +
        "<p>Date: " + new Date(currentWeather.dt * 1000).toLocaleDateString() + "</p>" +
        "<p>Temperature: " + kelvinToFahrenheit(currentWeather.main.temp) + "°F</p>" +
        "<p>Wind Speed: " + currentWeather.wind.speed + " m/s</p>" +
        "<p>Humidity: " + currentWeather.main.humidity + "%</p>" +
        "<img src='http://openweathermap.org/img/wn/" + currentWeather.weather[0].icon + ".png' alt='Weather icon'>" +
        "</div>";

    // displays 5-day forecast, skipping every 8 to get daily data (3 hour forecast)
    var forecastHTML = "<h4>5-Day Forecast</h4>";
    for (var i = 0; i < data.list.length; i += 8) {
        var dayData = data.list[i];
        forecastHTML += 
            "<div class='forecast-container'>" +
            "<p class='forecast-item'>Date: " + new Date(dayData.dt * 1000).toLocaleDateString() + "</p>" +
            "<p class='forecast-item'>Temperature: " + kelvinToFahrenheit(dayData.main.temp) + "°F</p>" +
            "<p class='forecast-item'>Wind Speed: " + dayData.wind.speed + " m/s</p>" +
            "<p class='forecast-item'>Humidity: " + dayData.main.humidity + "%</p>" +
            "<img src='http://openweathermap.org/img/wn/" + dayData.weather[0].icon + ".png' alt='Weather icon'>" +
            "</div>";
    }
    document.getElementById("forecastWeather").innerHTML = forecastHTML;
}
// saves searches into local storage
function saveToHistory(cityName) {
    // added an or condition to remove error when there is no search history
    var history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || []; 
    if (!history.includes(cityName)) {
        history.push(cityName);
        localStorage.setItem('weatherSearchHistory', JSON.stringify(history));
    }
}

function updateHistoryUI() {
    var history = JSON.parse(localStorage.getItem('weatherSearchHistory')) || [];
    var historyHTML = "<h5>Search History</h5>";
    // creates onclick buttons for each search
    for (let i = 0; i < history.length; i++) {
        // backslashes needed here to separate the quotes to be added to the string as they are inside quotes already
        historyHTML += '<button type="button" onclick="searchAgain(\'' + history[i] + '\')">' + history[i] + '</button>';
    }

    document.getElementById("searchHistory").innerHTML = historyHTML;
}

function searchAgain(cityName) {
    document.getElementById("cityInput").value = cityName;
    // creates an event object; triggers the submit event of the form as if the user had clicked a submit button [dispatchEvent] 
    document.getElementById("searchForm").dispatchEvent(new Event("submit"));
}

// search history persists on page load
updateHistoryUI();