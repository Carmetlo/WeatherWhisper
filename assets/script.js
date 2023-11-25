var apiKey = '1517baaf9a9a7ffd971be9a80da4eedb';
const geocodeURL = 'https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}'

function getCoordinates(city) {
    fetch(geocodeURL)
    let url = geocodeURL.replace('{city name}', city).replace('{API key}', apiKey);
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
    const apiUrl = 'https://api.openweathermap.org/data/2.5/';

    fetch(`${apiUrl}?lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            updateCurrentWeather(data);
            updateForecast(data);
            addToSearchHistory(city);
        })
        .catch(error => console.error('Error fetching data: ', error));
}