const apiKey = "93d36d5ed8f49e95ac5c409eb3d39964"
var currWind = document.getElementById("wind");
var currTemp = document.getElementById("temp");
var currHumidity = document.getElementById("humidity");
var currWeatherList = document.getElementById("currentWeatherList");

function handleSearch(event) {
    console.log(event);
    event.preventDefault()
    const searchWeather = document.getElementById("searchweather").value
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchWeather}&units=imperial&appid=${apiKey}`) 
            .then(function (response) {
                return response.json()
            
            })

            .then(function (data) {
                console.log(data);
                // const iconImg = document.createElement('img');
                // iconImg.setAttribute('class', 'icon-span-styling');
                // iconImg.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png`);
                // currWeatherList.append(iconImg);
                currWind.textContent = "Wind: " + data.wind.speed + " m/h";
                currTemp.textContent = "Temp: " + data.main.temp + " F";
                currHumidity.textContent = "Humidity " + data.main.humidity + "%";
            
            })
    }



document.getElementById("search").addEventListener("click", handleSearch);
