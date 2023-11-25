const apiKey = 'Y6a6da27e7d121487b839ad8ea7dd1de0';
const geocodeURL = 'https://api.openweathermap.org/geo/1.0/direct?q='
const apiUrl = 'https://api.openweathermap.org/data/2.5/';
const latitude = data{ 0}.lat;
const longitude = data{ 0}.lon;

document.addEventListener('DOMContentLoaded', function () {

    function getCoordinates(city) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    console.log(`Coordinates for ${city}: Latitude ${latitude}, Longitude ${longitude}`);
                    getWeather(latitude, longitude);
                } else {
                    console.error('No results found for this $(city)');
                }
            })
            .catch(error => console.error('Error fetching coordinates: ', error));
    }
    function getWeather(latitude, longitude) {
            .then(response => response.json())
            .then(data => {
                console.log(data);
                updateCurrentWeather(data);
                updateForecast(data);
                addToSearchHistory(city);
            })
            .catch(error => console.error('Error fetching data: ', error));
    })