const apiKey = 'YOUR_API_KEY';
const apiUrl = 'https://api.openweathermap.org/data/2.5/forecast';

document.addEventListener('DOMContentLoaded', function () {

    function getWeather(city) {
        fetch(`{apiUrl}?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                updateCurrentWeather(data);
                updateForecast(data);
                addToSearchHistory(city);
            })
            .catch(error => console.error('Error fetching data: ', error));
    })