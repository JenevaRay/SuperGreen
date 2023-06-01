// need API for Trefle.io

// need API for 
API = {}
API.perenual = "sk-uzQv6475151f07b921086"


var cache = {}
cache = JSON.parse(localStorage.getItem("cache"))
if (cache == null) {
    cache = {}
}

var debug = {
    cache: true,
    dataToBeDisplayed: true,
}

function getPerenualPlantDetail(jQueryEl, plantID, imgSize) {    
    /* 
    ** searchString:    string
    **  such as     cucumber
    */
    
    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    gotPerenualInfo = false

    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    let url = `https://perenual.com/api/species/details/${plantID}?key=${API.perenual}`
    // console.log(url)
    if (!cache[url] || cache[url] != null) {            
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
            if (gotPerenualInfo) {
                // if we're debugging, show the source information to be shown
                if (debug.dataToBeDisplayed) {
                    // console.log(`${infoToShow}: ${JSON.stringify(cache[url][infoToShow])} from object:`);
                    console.log(cache[url])
                }
                showEachSearchResult(cache[url], jQueryEl, imgSize)

            } else {
                // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                checkPerenualInfo()
            }
        // 50 ms isn't a lot, but it's enough to not bog down the CPU on old phones, and it's small enough to be very responsive.
        },50)
    }
    checkPerenualInfo()
}

function getPerenualSpeciesList(jQueryEl, query, imgSize = "thumbnail") {    
    /* jQueryEl:        a jQuery element to attach data to with the perenual plant ID written in
    **  such as     $('<div data-plant-perenual="2292">')
    ** query:           the query itself from parameters
    **  such as     "tomato"
    ** imgSize:         image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    **  such as     "medium_url"
    */
    let plantID = ""

    for (let [key, value] of params) {
        if (key === "q") {
            // showPerenualSearch(API.perenual, $(".swiper-wrapper"), value, "original_url")
        } else if (key === "plantID") {
            plantID = value
            // showPerenualSpeciesInfo(API.perenual, $(".wrapper"), value, "thumbnail")
            // showPerenualSearch(API.perenual, $("#searchresults"), "tomato", "thumbnail")
        } else {
            console.log(`search parameter ${key} not implemented`)
        }
    }

    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    gotPerenualInfo = false

    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    let url = `https://perenual.com/api/species-list?q=${query}&key=${API.perenual}`
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
            if (gotPerenualInfo) {
                // if we're debugging, show the source information to be shown
                if (debug.dataToBeDisplayed) {
                    // console.log(`${infoToShow}: ${JSON.stringify(cache[url][infoToShow])} from object:`);
                    console.log(cache[url])
                }
                for (let row in cache[url].data) {
                    if (["Coming Soon", "Upgrade Plan For Access https://perenual.com/subscription-api-pricing. I'm sorry"].includes(cache[url].data[row].scientific_name)) {
                        console.log("skipped entry due to paywall for PlantID: " + cache[url].data[row].id)
                        // innerDiv.hide()
                    } else {
                        showEachSearchResult(cache[url].data[row], jQueryEl, imgSize, true, "searchresult")
                        // console.log(cache[url].data[row])
                        // results = {
                        //     id: cache[url].data[row].id,
                        //     common_name: cache[url].data[row].common_name
                        // }
                        // console.log(results)

                    }
                }

                // showEachSearchResult(cache[url].id, jQueryEl, imgSize, cache[url])
                // for (let [key, value] of Object.entries(cache[url])) {
                //     let innerDiv = $(`<div class="${key}">`).appendTo(jQueryEl) // for each data element, for custom styling.
                //     if (["Coming Soon", "Upgrade Plan For Access https://perenual.com/subscription-api-pricing. Im sorry"].includes(value)) {
                //         innerDiv.hide()
                //     } else {
                //         // console.log(key)
                //         let header = ""
                //         if (["id"].includes(key)) {
                //             // we already have this...  so we'll skip it!
                //         } else {
                //             if (["common_name"].includes(key)) {
                //                 // give custom headers for specific elements, like here, we're giving the <h1> tag for "common_name" info.
                //                 header = $("<h1>").text(key).appendTo(innerDiv)
                //             } else {
                //                 // the default header style
                //                 header = $("<h2>").text(key).appendTo(innerDiv)
                //             }
                //             switch (typeof cache[url][key]) {
                //                 case "string":
                //                     let p = $("<p>").text(cache[url][key]).insertAfter(header)
                //                     break;
                //                 case "object":
                //                     if (Array.isArray(cache[url][key])) {
                //                         if (cache[url][key].length == 0) {
                //                             innerDiv.hide()
                //                         }
                //                         for (index in cache[url][key]) {
                //                             let p = $("<p>").text(cache[url][key][index]).insertAfter(header)
                //                         }
                //                     } else {
                //                         innerObj = cache[url][key]
                //                         if (key == "hardiness_location") {
                //                             iframeHtml = innerObj.full_iframe
                //                             let iFrame = $(`${iframeHtml}`).insertAfter(header)
                //                             hardinessURL = innerObj.full_url
                //                             // let hardinessImg = $(`<img src=${hardinessURL}>`).insertAfter(header)
                //                             // this seems to be a full page, and is NOT cacheable.
                //                         } else if (key == "hardiness") {
                //                             let max = cache[url][key].max
                //                             let min = cache[url][key].min
                //                         } else if (key == "default_image") {
                //                             switch(cache[url][key].license_name) {
                //                                 case "CC0 1.0 Universal (CC0 1.0) Public Domain":
                //                                     // freely usable
                //                                 case "Attribution-ShareAlike License":
                //                                 case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
                //                                     imgLicenseRestricted = true;
                //                                     // use of this licence requires everything to be made copyleft (freely available upon request.)
                //                                 case "authorized":
                //                                     console.log(cache[url][key][imgSize])
                //                                     $(`<img src=${cache[url][key][imgSize]}>`).insertAfter(header)
                //                                     // move this section up or down depending on team agreement.
                //                                     break
                //                                 case undefined:
                //                                     paywalled = true;
                //                                     // we would get this one in case of paywall, so we'll silently hide them
                //                                     break;
                //                                 default: 
                //                                     console.log(cache[url].data[row].default_image.license_name + " not known!")
                //                             }
                        
                //                         } else {
                //                             console.log(key)
                                            
                //                             for (let [innerKey, innerValue] in innerObj) {
                //                                 console.log(innerKey)
                //                                 // console.log(innerValue)
                //                             }
                //                         }
                                        
                //                     }
                //                     break;
                //                 case "boolean":
                //                     booleanFields = ["cuisine"]
                //                     if (cache[url][key]) {
                //                         // if it evaluates to True
                //                         if (booleanFields.includes(key)) {
                //                             header.text("IS " + header.text())
                //                         }    
                //                     } else {
                //                         // if it evaluates to False
                //                         header.text("IS NOT " + header.text())
                //                     }
                //                     // console.log(cache[url][key])
                //                     break;
                //                 default:
                //                     console.log(typeof cache[url][key])
                //                     break;
                //             }
                //         }
                //     }
                // }





            } else {
                // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                checkPerenualInfo()
            }
        // 50 ms isn't a lot, but it's enough to not bog down the CPU on old phones, and it's small enough to be very responsive.
        },50)
    }
    checkPerenualInfo()
}

function getPerenualCareInfo(url) {    
    /* perenualApiKey:  API key 
    **  such as     sk-zrou646ebab236f671020
    ** jQueryEl:        a jQuery element to attach data to with the perenual plant ID written in
    **  such as     $('<div data-plant-perenual="2292">')
    ** imgSize:         image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    **  such as     "medium_url"
    */

    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    gotPerenualInfo = false
    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    // let url = `https://perenual.com/api/species/details/${plantID}?key=${perenualApiKey}`
    console.log(url)
    if (!cache[url]) {            
        // since it's not in the cache, fetch it.
        fetch(url, {
            method: "GET",
            'Access-Control-Allow-Origin': '*',
        }).then((response) => {
            if (response.status === 404) {
                console.log("guide missing!")
            } else if (response.status === 200) {
                // pass on the parsed json to the next then
                return response.json();
            } else if (!response.ok) {
                console.log("Network response was not OK")
                // show all the request/response info
                console.log(response)
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
            if (gotPerenualInfo) {
                // if we're debugging, show the source information to be shown
                if (debug.dataToBeDisplayed) {
                    // console.log(`${infoToShow}: ${JSON.stringify(cache[url][infoToShow])} from object:`);
                    console.log(cache[url])
                }
                // show the care guide
                showCareGuide(cache[url])
            } else {
                // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                checkPerenualInfo()
            }
        // 50 ms isn't a lot, but it's enough to not bog down the CPU on old phones, and it's small enough to be very responsive.
        },50)
    }
    checkPerenualInfo()
}
