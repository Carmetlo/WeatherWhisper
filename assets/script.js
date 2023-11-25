var apiKey = '1517baaf9a9a7ffd971be9a80da4eedb';
const geocodeURL = 'http://api.openweathermap.org/geo/1.0/direct?q={city name}&limit=5&appid={API key}'

function getCoordinates(city) {
    let url = geocodeURL.replace('{city name}', city).replace('{API key}', apiKey);
    console.log(url);
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const latitude = data[0].lat;
                const longitude = data[0].lon;
                console.log(`Coordinates for ${city}: Latitude ${latitude}, Longitude ${longitude}`);
                getWeather(latitude, longitude);
            } else {
                console.error('No results found for this $(city)');
            }
        })
        .catch(error => console.error('Error fetching coordinates: ', error));
}
function getWeather(latitude, longitude) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/weather';

    fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateCurrentWeather(data);
            // updateForecast(data);
            // addToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data: ', error));
}
function updateCurrentWeather (data) {
    var card = $("<div>").addClass ("card");
    var cardTitle = $("<h2>").addClass("card-title").text(data.name)
    var tempEl = $("<h3>").addClass("card-text").text("Temperature: "+Math.round(data.main.temp)+String.fromCharCode(186))
    var humidtyEl = $("<h3>").addClass("card-text").text("Humidity: "+data.main.humidity+String.fromCharCode(37))
    var windEl = $("<h3>").addClass("card-text").text("Wind Speed: "+data.wind.speed+" MPH")
    var icon = $("<img>").attr("src",`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $("#current-weather").append(card.append(cardTitle.append(icon),tempEl,humidtyEl,windEl))
}
document.getElementById('search').addEventListener("submit", function (event){
    event.preventDefault()
    var cityName = document.getElementById("city-input").value
    getCoordinates (cityName)
})