const apiKey = "ddc0245623a54454b6802208230106"
var currPrecip = document.getElementById("precip");
var currWeatherList = document.getElementById("currentWeatherList");
var precipIcon = document.getElementById("icon");

fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Salt Lake City&aqi=yes`)
    .then((response) => {
        return response.json()
    })

    .then((jsonData) => {
        console.log(jsonData);
        if (jsonData.current.condition.icon) {
            console.log(jsonData.current.condition.icon)
           precipIcon.src = "https:" + jsonData.current.condition.icon
        }
        console.log(jsonData);
        if (jsonData.current.precip_in) {
            console.log(jsonData.current.precip_in);
            currPrecip.textContent = "Precipitation: " + jsonData.current.precip_in + " in"

        } else {
            currPrecip.textContent = "Precipitation: None";
        }
    })
        



    
