// API key for OpenWeatherMap API
//There were some issues with my original idea of how to get the API key to work. I was able to get it to work by using the following code. I also had to change the API key to the one I was given.
//The main problem I had was making sure everything functioned properly.
//I learned how to coordinate my css to communicate with the js elements that were created
var apiKey = '1517baaf9a9a7ffd971be9a80da4eedb';
// Function to get coordinates for a city
function getCoordinates(city) {
    const geocodeURL = 'https://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(city) + '&limit=5&appid=' + apiKey;
    
    return new Promise((resolve, reject) => {
        if (!city) {
            console.error('City is undefined or null.');
            reject('No city provided');
            return;
        }
        // Build URL for geocoding API
        let url = geocodeURL;
        console.log('Geocode URL:', url);
        // Fetch coordinates for city
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            
            .then(data => {
                console.log('Geocode Response:', data);
                if (data.length > 0) {
                    const latitude = data[0].lat;
                    const longitude = data[0].lon;
                    console.log(`Coordinates for ${city}: Latitude ${latitude}, Longitude ${longitude}`);
                    getWeather(latitude, longitude, city);
                    resolve();
                } else {
                    console.error(`No results found for ${city}`);
                    reject('No results');
                }
            })
            .catch(error => {
                console.error('Error fetching coordinates: ', error);
                reject(error);
            });
    });
}
// Function to get weather data for a city
function getWeather(latitude, longitude, city) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';
    // Build URL for weather API
    fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateCurrentWeather(data);
            updateForecast(data, city);
            addToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data: ', error));
}
// Function to update current weather
function updateCurrentWeather(data) {
    console.log('Current Weather Data:', data);

    if (data.city && data.list && data.list.length > 0) {
        var card = $("<div>").addClass("card");
        var date = new Date(data.list[0].dt * 1000);
        var formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        var cardTitle = $("<h2>").addClass("card-title").text(`${data.city.name} ${formattedDate}`)
        var tempEl = $("<h3>").addClass("card-text").text("Temperature: " + Math.round(data.list[0].main.temp) + String.fromCharCode(186))
        var humidtyEl = $("<h3>").addClass("card-text").text("Humidity: " + data.list[0].main.humidity + String.fromCharCode(37));
        var windEl = $("<h3>").addClass("card-text").text("Wind Speed: " + data.list[0].wind.speed + " MPH");
        var icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png`);
        $("#current-weather").empty().append(card.append(cardTitle.append(icon), tempEl, humidtyEl, windEl));
    } else {
        console.error('invalid data format for current weather:', data);
    }
}
// Function to update forecast
function updateForecast(data, city) {
    const forecastEL = document.getElementById('forecast');
    forecastEL.innerHTML = '';
    
    forecastEL.innerHTML += '<h4>5-Day Forecast:</h4>';

    for (let i = 0; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt * 1000);
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        const iconCode = data.list[i].weather[0].icon;
        const temperature = data.list[i].main.temp;
        const windSpeed = data.list[i].wind.speed;
        const humidity = data.list[i].main.humidity;

        forecastEL.innerHTML += `
            <div class="forecast-item">
                <p> ${formattedDate}</p>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">
                <p>Temperature: ${temperature} &deg;F</p>
                <p>Wind speed: ${windSpeed} MPH</p>
                <p>Humidity: ${humidity} %</p>
            </div>
        `;
    }
}
// Function to add city to search history
const searchHistoryEL = document.getElementById('search-history');
function addToSearchHistory(city) {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    city = city.toLowerCase();
    if (!cities.map(city => city.toLowerCase()).includes(city)) {
        cities.push(city);
        localStorage.setItem('cities', JSON.stringify(cities));
        searchHistoryEL.innerHTML += `<button class="city-button">${city}</button>`;
    }
    
}
// Function to load search history from local storage
function loadSearchHistory() {
    let cities = JSON.parse(localStorage.getItem('cities')) || [];
    for (let city of cities) {
        searchHistoryEL.innerHTML += `<button class="city-button">${city}</button>`;
    }
}

document.addEventListener('DOMContentLoaded', loadSearchHistory);
// Event listener for search history buttons
searchHistoryEL.addEventListener('click', async function (event) {
    if (event.target.tagName === 'BUTTON') {
        const clickedCity = event.target.textContent;
        console.log(`Clicked ${clickedCity}`);
        await getCoordinates(clickedCity);
    }
});
// Event listener for search form
document.getElementById('search').addEventListener("submit", function (event) {
    event.preventDefault()
    var cityName = document.getElementById("city-input").value
    getCoordinates(cityName)
})
// Event listener for clear history button
document.getElementById('clear-history').addEventListener('click', function () {
    localStorage.removeItem('cities');

    let cityButtons = document.querySelectorAll('.city-button');
    cityButtons.forEach(button => button.remove());
});