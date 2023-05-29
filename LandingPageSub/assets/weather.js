const apiKey = "93d36d5ed8f49e95ac5c409eb3d39964"
var currPrecip = document.getElementById("precip");
var currWeatherList = document.getElementById("currentWeatherList");

// function handleSearch(event) {
//     console.log(event);
//     event.preventDefault()
//     const searchWeather = document.getElementById("searchweather").value
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=40.76&lon=111.89&appid=${apiKey}`)
        .then((response) => {
            return response.json()
        })

        .then((jsonData) => {
        console.log(jsonData);
        currPrecip.textContent = "Precipitation: " + jsonData.rain['1h'] + " mm"

    })




document.getElementById("search").addEventListener("click", handleSearch);
