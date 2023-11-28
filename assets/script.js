var apiKey = '1517baaf9a9a7ffd971be9a80da4eedb';

function getCoordinates(city) {
    const geocodeURL = 'http://api.openweathermap.org/geo/1.0/direct?q=' + encodeURIComponent(city) + '&limit=5&appid=' + apiKey;
    
    return new Promise((resolve, reject) => {
        if (!city) {
            console.error('City is undefined or null.');
            reject('No city provided');
            return;
        }

        let url = geocodeURL;
        console.log('Geocode URL:', url);

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
function getWeather(latitude, longitude, city) {
    const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

    fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // updateCurrentWeather(data);
            updateForecast(data, city);
            addToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data: ', error));
}

function updateForecast(data, city) {
    const forecastEL = document.getElementById('forecast');
    forecastEL.innerHTML = '<h2>5-Day Forecast:</h2>';

    for (let i = 0; i < data.list.length; i += 8) {
        const date = new Date(data.list[i].dt * 1000);
        const iconCode = data.list[i].weather[0].icon;
        const temperature = data.list[i].main.temp;
        const windSpeed = data.list[i].wind.speed;
        const humidity = data.list[i].main.humidity;

        forecastEL.innerHTML += `
            <div class="forecast-item">
                <p>Date: ${date.toDateString()}</p>
                <img src="https://openweathermap.org/img/wn/${iconCode}@2x.png" alt="Weather Icon">
                <p>temperature: ${temperature} &deg;F</p>
                <p>wind speed: ${windSpeed} MPH</p>
                <p>humidity: ${humidity} %</p>
            </div>
        `;
    }
}
const searchHistoryEL = document.getElementById('search-history');

function addToSearchHistory(city) {
    searchHistoryEL.innerHTML += `<p>${city}</p>`;
}

searchHistoryEL.addEventListener('click', async function (event) {
    if (event.target.tagName === 'P') {
        const clickedCity = event.target.textContent;
        console.log(`Clicked ${clickedCity}`);
        await getCoordinates(clickedCity);
    }
});

function updateCurrentWeather(data) {
    var card = $("<div>").addClass("card");
    var cardTitle = $("<h2>").addClass("card-title").text(data.name)
    var tempEl = $("<h3>").addClass("card-text").text("Temperature: " + Math.round(data.main.temp) + String.fromCharCode(186))
    var humidtyEl = $("<h3>").addClass("card-text").text("Humidity: " + data.main.humidity + String.fromCharCode(37))
    var windEl = $("<h3>").addClass("card-text").text("Wind Speed: " + data.wind.speed + " MPH")
    var icon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    $("#current-weather").append(card.append(cardTitle.append(icon), tempEl, humidtyEl, windEl))
}
document.getElementById('search').addEventListener("submit", function (event) {
    event.preventDefault()
    var cityName = document.getElementById("city-input").value
    getCoordinates(cityName)
})