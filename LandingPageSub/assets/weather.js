const apiKey = "93d36d5ed8f49e95ac5c409eb3d39964"
var currPrecip = document.getElementById("precip");
var currWeatherList = document.getElementById("currentWeatherList");

function handleSearch(event) {
    console.log(event);
    event.preventDefault()
    const searchWeather = document.getElementById("searchweather").value
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchWeather}&appid=${apiKey}`)
        .then((response) => {
            return response.json()
        })

        .then((jsonData) => {
        console.log(jsonData.rain);
        currPrecip.textContent = "Precipitation: " + jsonData.rain + " mm"

    })
}



document.getElementById("search").addEventListener("click", handleSearch);
