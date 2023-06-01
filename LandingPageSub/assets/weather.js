const apiKey = "ddc0245623a54454b6802208230106"
var currPrecip = document.getElementById("precip");
var currWeatherList = document.getElementById("currentWeatherList");

fetch(`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Salt Lake City&aqi=yes`)
    .then((response) => {
        return response.json()
    })

    .then((jsonData) => {
        console.log(jsonData);
        if (jsonData.current.precip_mm) {
            console.log(jsonData.current.precip_mm);
            currPrecip.textContent = "Precipitation: " + jsonData.current.precip_mm + " mm"

        } else {
            currPrecip.textContent = "Precipitation: None";
        }

        .then((jsonData) => {
            console.log(jsonData);
            const iconImg = document.createElement('img');
            iconImg.setAttribute('class', 'icon-span-styling');
            iconImg.setAttribute('src', `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=Salt Lake City&aqi=yes`);
            currWeatherList.append(iconImg);
        })

    });
