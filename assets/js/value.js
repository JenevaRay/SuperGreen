// need API for Trefle.io

// need API for 
API = {}
API.perenual = "sk-zrou646ebab236f671023"
API.trefle = "ZfBlNTHy7fc7eWQYcdcUOdMts9fDRXZQt2t3BcNDKU0"

var cache = {}
cache = JSON.parse(localStorage.getItem("cache"))

function displayPerenualInfo(div, perenualInfoObject) {
    console.log(perenualInfoObject)
    
    let sunlightHeader = $("<h2>").text("Sunlight").appendTo(div)
    let plantIDs = Object.keys(perenualInfoObject)
    for (plantID in plantIDs) {
        // console.log(plantIDs[plantID])
        let ID = plantIDs[plantID]
        // if this is an array, which right now the only example we have is...
        if (Array.isArray(perenualInfoObject[ID].sunlight)) {
            for (level in perenualInfoObject[ID].sunlight) {
                let p = $("<p>").text(perenualInfoObject[ID].sunlight[level]).appendTo(div)
            }
        }
    }
}

function getPerenualSpeciesInfoByID(plantID) {    
    // cacheResults = lib.checkCache()
    gotPerenualInfo = false
    // let plantID = 2292
    desiredPerenualInfo = {}
    let url = `https://perenual.com/api/species/details/${plantID}?key=${API.perenual}`
    if (!cache[url]) {            
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log("Network response was not OK")
                console.log(response)
                // throw new Error("City not found!")
            }
            if (response.status === 200) {
                return response.json();
            }
        }).then((jsonData) => {
            // if (jsonData == "error") {
            //     return "error"
            // }
            desiredPerenualInfo[plantID] = {
                sunlight: jsonData.sunlight,
                watering: jsonData.watering
            }
            console.log("fetching ${info} from perenual")
            console.log(jsonData)
            gotPerenualInfo = true;
            cache[url] = jsonData
            localStorage.setItem("PerenualInfo", JSON.stringify(cache))
            // console.log(jsonData)
        })
    } else {
        desiredPerenualInfo[plantID] = {
            sunlight: cache[url].sunlight,
            watering: cache[url].watering
        }
        gotPerenualInfo = true;
        console.log("using cache")
    };
    function checkPerenualInfo() {
        setTimeout(() => {
            if (gotPerenualInfo) {
                displayPerenualInfo($("#PerenualSearchInfo"), desiredPerenualInfo)
                // apis.getOWMCurrentbyLL(lat, long)
                // apis.getOWMForecastbyLL(lat, long)            
            } else {
                checkPerenualInfo()
            }
        },50)
    }
    checkPerenualInfo()
}




function getPerenualSearchByNameInfoForPerenualSpeciesID(query) {    
    // cacheResults = lib.checkCache()
    gotPerenualInfo = false
    let queryString = ""
    if (query) {
        queryString = `&q=${query}`
    }
    let url = `https://perenual.com/api/species-list?key=${API.perenual}${queryString}`
    if (cache === null) {
        cache = {}
    }

    if (!cache[url]) {            
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log("Network response was not OK")
                console.log(response)
                // throw new Error("City not found!")
            }
            if (response.status === 200) {
                return response.json();
            }
        }).then((jsonData) => {
            // if (jsonData == "error") {
            //     return "error"
            // }
            let info = ""
            console.log("fetching ${info} from perenual")
            console.log(jsonData.data[0])
            gotPerenualInfo = true;
            cache[url] = jsonData
            localStorage.setItem("cache", JSON.stringify(cache))
            // console.log(jsonData)

        })
    } else {
        console.log(`using cache for ${url}`)
        console.log(cache[url])
    };
    function checkPerenualInfo() {
        setTimeout(() => {
            if (gotPerenualInfo) {
                // apis.getOWMCurrentbyLL(lat, long)
                // apis.getOWMForecastbyLL(lat, long)            
            } else {
                checkPerenualInfo()
            }
        },50)
    }
    checkPerenualInfo()
}
function getTrefleInfo() {    
    // cacheResults = lib.checkCache()
    gotTrefleInfo = false
    let url = 'http://trefle.io/api/auth/claim'
    // let url = `https://trefle.io/api/v1/plants?token=${API.trefle}`
    if (!trefleInfo[url]) {
        payload = {
            "origin": "http://127.0.0.1:5500",
            "ip": "127.0.0.1",
            "token": API.trefle
          }            
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            // 'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            // 'mode': "cors"
        }).then((response) => {
            console.log("a word")
            if (!response.ok) {
                console.log("Network response was not OK")
                console.log(response)
                // throw new Error("City not found!")
            }
            if (response.status === 200) {
                return response.json();
            }
        }).then((jsonData) => {
            // if (jsonData == "error") {
            //     return "error"
            // }
            let info = ""
            console.log("fetching ${info} from trefle.io")
            console.log(jsonData)
            gotTrefleInfo = true;
            trefleInfo[url] = jsonData
            localStorage.setItem("WeatherDashboardCache", JSON.stringify(trefleInfo))
            // console.log(jsonData)

        })
    } else {};
    function checkTrefleInfo() {
        setTimeout(() => {
            if (gotTrefleInfo) {
            } else {
                checkTrefleInfo()
            }
        },50)
    }
    checkTrefleInfo()
}
// console.log(Object.keys(cache))
// getPerenualAllSpeciesInfo("Tomato")
getPerenualSearchByNameInfoForPerenualSpeciesID("tomato")
getPerenualSpeciesInfoByID(2292)
// getPerenualInfo()
// getTrefleInfo()