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
        .then(function(response) { return response.json(); })
        .then(callback)
        .catch(function(error) {
            console.error("Error fetching weather data:", error);
        });
}
