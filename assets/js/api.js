// need API for Trefle.io

// need API for 
API = {}
API.perenual = "sk-zrou646ebab236f671023"

var cache = {}
cache = JSON.parse(localStorage.getItem("cache"))

var debug = {
    cache: true,
    dataToBeDisplayed: true,
}

function showPerenualSpeciesInfo(perenualApiKey, jQueryEl, infoToShow) {    
    /* perenualApiKey:  API key 
    **  such as     sk-zrou646ebab236f671020
    ** jQueryDiv:       a jQuery element to attach data to with the perenual plant ID written in
    **  such as     $('<div data-plant-perenual="2292">')
    ** infoToShow:      one of ["sunlight", "watering"] to display info in the div.
    **  such as     "sunlight"
    */

    // get the info from the HTML element itself (makes it easy to create the element with the data parameter already set, so it shows precisely what is intended)
    plantID = jQueryEl.data().plantPerenual

    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    gotPerenualInfo = false

    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    let url = `https://perenual.com/api/species/details/${plantID}?key=${perenualApiKey}`
    if (!cache[url]) {            
        // since it's not in the cache, fetch it.
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log("Network response was not OK")
                // show all the request/response info
                console.log(response)
            }
            if (response.status === 200) {
                // pass on the parsed json to the next then
                return response.json();
            }
        }).then((jsonData) => {
            if (debug.cache) {console.log("fetching info");}
            // we'll put the fetched info into cache
            cache[url] = jsonData
            // say that we got the information...
            gotPerenualInfo = true;
            // then store the info in localstorage for quick access (this info doesn't change much, so it's a great option!)
            localStorage.setItem("PerenualInfo", JSON.stringify(cache))
        })
    } else {
        if (debug.cache) {console.log("using cache");}
        // since the info is in cache, then say we got it
        gotPerenualInfo = true;
    };
    function checkPerenualInfo() {
        setTimeout(() => {
            // if we have the info in memory, and the information matches the information we can display:
            if (gotPerenualInfo && Object.keys(cache[url]).includes(infoToShow)) {
                // if we're debugging, show the source information to be shown
                if (debug.dataToBeDisplayed) {
                    console.log(`${infoToShow}: ${JSON.stringify(cache[url][infoToShow])} from object:`);
                    console.log(cache[url])
                }
                if (infoToShow === "common_name") {
                    jQueryEl.text(cache[url][infoToShow])
                } else if (infoToShow === "scientific_name") {
                    jQueryEl.text(cache[url][infoToShow])
                } else {
                    // please feel free to edit this for your needs, so you can get the appearance you want.
                    // works for reference      let header = $("<h2>").text(infoToShow).appendTo(jQueryDiv)
                    let header = $("<h2>").text(infoToShow).appendTo(jQueryEl)
                    // if it's an array, then we'll iterate through it..
                    if (Array.isArray(cache[url][infoToShow])) {
                        for (index in cache[url][infoToShow]) {
                            // ..and for each entry in the array, display it.
                            // please feel free to edit this for your needs, so you can get the appearance you want.
                            // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
                            let p = $("<p>").text(cache[url][infoToShow][index]).insertAfter(header)
                        }
                    } else {
                        // if it's not an array, display the string.
                        // please feel free to edit this for your needs, so you can get the appearance you want.
                        // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
                        let p = $("<p>").text(cache[url][infoToShow]).insertAfter(header)
                    }
                }
            } else {
                // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                checkPerenualInfo()
            }
        // 50 ms isn't a lot, but it's enough to not bog down the CPU on old phones, and it's small enough to be very responsive.
        },50)
    }
    checkPerenualInfo()
}

function showPerenualSearch(perenualApiKey, jQueryDiv, query, imgSize) {    
    /* perenualApiKey:  API key 
    **  such as     sk-zrou646ebab236f671020
    ** jQueryDiv:       a jQuery element to attach data to with the perenual plant ID written in
    **  such as     $('<div data-plant-perenual="2292">')
    ** query:           a string for what we are looking for.
    **  such as     "tomato"
    ** imgSize:         image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    **  such as     "medium_url"
    */

    // get the info from the HTML element itself (makes it easy to create the element with the data parameter already set, so it shows precisely what is intended)
    plantID = jQueryDiv.data().plantPerenual

    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    gotPerenualInfo = false

    // the actual Object that we'll put it into - empty so that we can programmatically put elements into it by plant ID.
    desiredPerenualInfo = {}
    
    let queryString = ""
    if (query) {
        queryString = `&q=${query}`
    }
    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    let url = `https://perenual.com/api/species-list?key=${API.perenual}${queryString}`
    if (!cache[url]) {            
        // since it's not in the cache, fetch it.
        fetch(url).then((response) => {
            if (!response.ok) {
                console.log("Network response was not OK")
                // show all the request/response info
                console.log(response)
            }
            if (response.status === 200) {
                // pass on the parsed json to the next then
                return response.json();
            }
        }).then((jsonData) => {
            if (debug.cache) {console.log("fetching info");}
            // we'll put the fetched info into cache
            cache[url] = jsonData
            // say that we got the information...
            gotPerenualInfo = true;
            // then store the info in localstorage for quick access (this info doesn't change much, so it's a great option!)
            localStorage.setItem("PerenualInfo", JSON.stringify(cache))
        })
    } else {
        if (debug.cache) {console.log("using cache");}
        // since the info is in cache, then say we got it
        gotPerenualInfo = true;
    };
    function checkPerenualInfo() {
        setTimeout(() => {
            if (gotPerenualInfo) {
                // let linkSizes = ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
                for (row in cache[url].data) {
                    let paywalled = false;
                    let imgLicenseRestricted = false;
                    // note: we're putting the Perenual plantID here in the DIV.  That way it's all distinct info.
                    let swiperEl = $(".swiper-slide").eq(row)
                    rowResult = $(`<div data-plant-perenual=${cache[url].data[row].id}>`).appendTo(swiperEl)
                    // rowResult = $(`<div data-plant-perenual=${cache[url].data[row].id}>`).addClass("swiper-slide").appendTo(jQueryDiv)
                    $("<h2>").text(`${cache[url].data[row].common_name}`).appendTo(rowResult)
                    // since this is useful in case we ever get Trefle working...
                    $("<p>").text(`${cache[url].data[row].scientific_name}`).appendTo(rowResult)
                    // in case of Attribution-ShareAlike License, we would have to make everything freely available, so we'll use it for proof-of-concept for now.
                    switch(cache[url].data[row].default_image.license_name) {
                        case "CC0 1.0 Universal (CC0 1.0) Public Domain Dedication":
                            // freely usable
                        case "Attribution-ShareAlike License":
                        case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
                            imgLicenseRestricted = true;
                            // use of this licence requires everything to be made copyleft (freely available upon request.)
                        case "authorized":
                            $(`<img src=${cache[url].data[row].default_image[imgSize]}>`).appendTo(rowResult)
                            // move this section up or down depending on team agreement.
                            break
                        case undefined:
                            paywalled = true;
                            // we would get this one in case of paywall, so we'll silently hide them
                            break;
                        default: 
                            console.log(cache[url].data[row].default_image.license_name + " not known!")
                    }

                    let watering = $("<h3>").text("watering:").appendTo(rowResult)
                    // if it's an array, then we'll iterate through it..
                    if (Array.isArray(cache[url].data[row].watering)) {
                        for (index in cache[url].data[row].watering) {
                            // ..and for each entry in the array, display it.
                            // please feel free to edit this for your needs, so you can get the appearance you want.
                            // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
                            let p = $("<p>").text(cache[url].data[row][index]).insertAfter(watering)
                        }
                    } else {
                        // if it's not an array, display the string.
                        // please feel free to edit this for your needs, so you can get the appearance you want.
                        // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
                        let p = $("<p>").text(cache[url].data[row].watering).insertAfter(watering)
                    }

                    let sunlight = $("<h3>").text("sunlight:").appendTo(rowResult)
                    // if it's an array, then we'll iterate through it..
                    if (Array.isArray(cache[url].data[row].sunlight)) {
                        for (index in cache[url].data[row].sunlight) {
                            // ..and for each entry in the array, display it.
                            // please feel free to edit this for your needs, so you can get the appearance you want.
                            // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
                            let p = $("<p>").text(cache[url].data[row].sunlight[index]).insertAfter(sunlight)
                        }
                    } else {
                        // if it's not an array, display the string.
                        // please feel free to edit this for your needs, so you can get the appearance you want.
                        // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
                        let p = $("<p>").text(cache[url].data[row].sunlight).insertAfter(sunlight)
                    }

                    if (debug.dataToBeDisplayed) {
                        if (paywalled) {
                            rowResult.hide();
                        } else {
                            console.log(cache[url].data[row])
                        }
                    }
                }
                // if (["watering", "sunlight"].includes(infoToShow)) {
                //     // if we're debugging, show the source information to be shown
                //     // please feel free to edit this for your needs, so you can get the appearance you want.
                //     // works for reference      let header = $("<h2>").text(infoToShow).appendTo(jQueryDiv)
                //     let header = $("<h2>").text(infoToShow).appendTo(jQueryDiv)
                //     // if it's an array, then we'll iterate through it..
                //     if (Array.isArray(cache[url][infoToShow])) {
                //         for (index in cache[url][infoToShow]) {
                //             // ..and for each entry in the array, display it.
                //             // please feel free to edit this for your needs, so you can get the appearance you want.
                //             // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
                //             let p = $("<p>").text(cache[url][infoToShow][index]).insertAfter(header)
                //         }
                //     } else {
                //         // if it's not an array, display the string.
                //         // please feel free to edit this for your needs, so you can get the appearance you want.
                //         // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
                //         let p = $("<p>").text(cache[url][infoToShow]).insertAfter(header)
                //     }
            } else {
                // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                checkPerenualInfo()                
            }
        },50)
    }
    checkPerenualInfo()
}

// function getTrefleInfo() {    
//     // cacheResults = lib.checkCache()
//     gotTrefleInfo = false
//     let url = 'http://trefle.io/api/auth/claim'
//     // let url = `https://trefle.io/api/v1/plants?token=${API.trefle}`
//     if (!trefleInfo[url]) {
//         payload = {
//             "origin": "http://127.0.0.1:5500",
//             "ip": "127.0.0.1",
//             "token": API.trefle
//           }            
//         fetch(url, {
//             method: 'POST',
//             body: JSON.stringify(payload),
//             // 'Content-Type': 'application/json',
//             'Access-Control-Allow-Origin': '*',
//             // 'mode': "cors"
//         }).then((response) => {
//             console.log("a word")
//             if (!response.ok) {
//                 console.log("Network response was not OK")
//                 console.log(response)
//                 // throw new Error("City not found!")
//             }
//             if (response.status === 200) {
//                 return response.json();
//             }
//         }).then((jsonData) => {
//             // if (jsonData == "error") {
//             //     return "error"
//             // }
//             let info = ""
//             console.log("fetching ${info} from trefle.io")
//             console.log(jsonData)
//             gotTrefleInfo = true;
//             trefleInfo[url] = jsonData
//             localStorage.setItem("WeatherDashboardCache", JSON.stringify(trefleInfo))
//             // console.log(jsonData)

//         })
//     } else {};
//     function checkTrefleInfo() {
//         setTimeout(() => {
//             if (gotTrefleInfo) {
//             } else {
//                 checkTrefleInfo()
//             }
//         },50)
//     }
//     checkTrefleInfo()
// }   


// show all info (great for search)
// showPerenualSearch(API.perenual, $("#searchresults"), "tomato", "thumbnail")



// show specific info...



// showPerenualSpeciesInfo(API.perenual, $(".plant-name"), "common_name")
// showPerenualSpeciesInfo(API.perenual, $(".sci-name"), "scientific_name")




// showPerenualSpeciesInfo(API.perenual, $("#wateringInfo"), "watering")
// showPerenualSpeciesInfo(API.perenual, $("#sunlightInfo"), "sunlight")

