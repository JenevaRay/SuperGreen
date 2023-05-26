// need API for Trefle.io

// need API for 
API = {}
API.perenual = "sk-zrou646ebab236f671023"
API.trefle = "ZfBlNTHy7fc7eWQYcdcUOdMts9fDRXZQt2t3BcNDKU0"

trefleInfo = {}

function getPerenualSpeciesInfo() {    
    // cacheResults = lib.checkCache()
    gotPerenualInfo = false
    let url = `https://perenual.com/api/species/details/${plantID}?key=${API.perenual}`
    if (!perenualInfo[url]) {            
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
            console.log(jsonData)
            gotPerenualInfo = true;
            perenualInfo[url] = jsonData
            localStorage.setItem("PerenualInfo", JSON.stringify(perenualInfo))
            // console.log(jsonData)

        })
    } else {};
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



perenualInfo = {}
function getPerenualSearchByNameInfo(query) {    
    // cacheResults = lib.checkCache()
    gotPerenualInfo = false
    let queryString = ""
    if (query) {
        queryString = `&q=${query}`
    }
    let url = `https://perenual.com/api/species-list?key=${API.perenual}${queryString}`
    if (!perenualInfo[url]) {            
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
            console.log(jsonData)
            gotPerenualInfo = true;
            perenualInfo[url] = jsonData
            localStorage.setItem("PerenualInfo", JSON.stringify(perenualInfo))
            // console.log(jsonData)

        })
    } else {};
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

// getPerenualAllSpeciesInfo("Tomato")
getPerenualSearchByNameInfo("Cyphomandra betacea")
// getPerenualInfo()
// getTrefleInfo()