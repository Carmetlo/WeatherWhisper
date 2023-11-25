const apiKey = 'Y6a6da27e7d121487b839ad8ea7dd1de0';
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