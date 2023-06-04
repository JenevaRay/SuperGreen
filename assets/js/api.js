// API keys data structure
API = JSON.parse(localStorage.getItem("API"))
// if (API == null || Object.keys(API).length != 2) {
//     // reset the data structure
//     API = {}
//     // and walk the user through how to add keys.
//     console.log("API keys not set.")
//     console.log(`type:  API.perenual = "sk-uzQv6475151f07b921086";`)
//     console.log(`then:  localStorage.setItem("API", JSON.stringify(API))`)
//     // please note there is one more API key that I am keeping off GitHub.
// }

// cache & favorites data structure, NOT including OpenAI queries.
let cache = {}
// if we can get it from LocalStorage, we'll do so.
cache = JSON.parse(localStorage.getItem("PerenualInfo"))
// if there is no cache, then reset the data structure.
if (cache == null) {
    cache = {}
}

// for debugging purposes.
let debug = {
    demo: true,
    // cache: true,
    cache: false,
    // dataToBeDisplayed: false,
    dataToBeDisplayed: true
}

// the function for a detailed plant query.
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
    // if it's not in the cache, then we'll fetch it.
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
    // we'll use this for checking to see if the async function is finished.
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
                    // an issue for less than PREMIUM subscribers to Perenual.  EVERY query should have a scientific name.
                    if (["Coming Soon", "Upgrade Plan For Access https://perenual.com/subscription-api-pricing. I'm sorry"].includes(cache[url].data[row].scientific_name)) {
                        if (debug.dataToBeDisplayed) {console.log("skipped entry due to paywall for PlantID: " + cache[url].data[row].id)}
                        // since the data is not accessible, then hide the missing info.
                        innerDiv.hide()
                    } else {
                        // show the result.
                        showEachSearchResult(cache[url].data[row], jQueryEl, imgSize, true, "searchresult")
                    }
                }
                if (cache[url].data.length == 0) {
                    $(".landing").show()
                    $("form").find("input").first().attr('placeholder', `${query} not found, try another spelling`).focus().blur()
                } else if (cache[url].data.length == 1) {
                    // only one result found, so skip the fluff.
                    window.location.href = `${window.location.pathname}?plantID=${cache[url].data[0].id}`
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

let gotPerenualCareInfo = false
function getPerenualCareInfo(url) {    
    /* perenualApiKey:  API key 
    **  such as     sk-zrou646ebab236f671020
    ** jQueryEl:        a jQuery element to attach data to with the perenual plant ID written in
    **  such as     $('<div data-plant-perenual="2292">')
    ** imgSize:         image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    **  such as     "medium_url"
    */

    // we'll fetch the information if we don't already have it, assume that we don't have it yet.
    // the url we'll check the cache for, and if it's not in the cache, fetch it.
    // let url = `https://perenual.com/api/species/details/${plantID}?key=${perenualApiKey}`
    
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
            gotPerenualCareInfo = true;
            // then store the info in localstorage for quick access (this info doesn't change much, so it's a great option!)
            localStorage.setItem("PerenualInfo", JSON.stringify(cache))
        })
    } else {
        if (debug.cache) {console.log("using cache");}
        // since the info is in cache, then say we got it
        gotPerenualCareInfo = true;
    };
    function checkPerenualInfo() {
        setTimeout(() => {
            // if we have the info in memory, and the information matches the information we can display:
            if (gotPerenualCareInfo) {
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

function getOpenAIquery(detailedJson) {
    if (API.openAI != undefined) {
        $("#hidewhenautosummary").hide()
        parsedJson = $.extend(true, {}, detailedJson)
        // because we want to edit the existing entries and throw out garbage.
        
        for (let [key, value] of Object.entries(parsedJson))
        {
            if (["Coming Soon", "Coming", null].includes(value)) {
                delete parsedJson[key]
            } else if (value.length == 0) {
                delete parsedJson[key]
            } else if (["id", "care-guides", "hardiness_location", "default_image", "type"].includes(key)) {
                delete parsedJson[key]
            } else if (["poisonous_to_humans", "poisonous_to_pets"].includes(key)) {
                if (value) {
                    parsedJson[key] = true
                } else {
                    parsedJson[key] = false
                }
            } else if (["hardiness"].includes(key)) {
                delete parsedJson[key]
                // parsedJson[key] = `${value.min} to ${value.max}`
            }
            // console.log(key)
        }
    
        let gotOpenAIResponse = false
    
        function checkPerenualCareInfo() {
            setTimeout(()=>{
                if(gotPerenualCareInfo) {
                    if (debug.dataToBeDisplayed) {
                        // console.log(`${infoToShow}: ${JSON.stringify(cache[url][infoToShow])} from object:`);
                        // console.log(cache[url])
                    }
                    parsedJson["care-guide-watering"] = $("#detailed_care_guide_watering").text()
                    parsedJson["care-guide-sunlight"] = $("#detailed_care_guide_sunlight").text()
                    parsedJson["care-guide-pruning"] = $("#detailed_care_guide_pruning").text()
                    prelude = "Make this JSON result into natural language, omitting information that is boolean false, and without bullet point list formatting.  Do not repeat information from the care-guide-watering, care-guide-sunlight, care-guide-pruning, or the description.  "
                    message = prelude + JSON.stringify(parsedJson)
    
                    // message = "count from 1 to 10."
                    // we will not cache these results.
                    url = "https://127.0.0.1"
                    url = 'https://api.openai.com/v1/chat/completions'
                    fetch(url, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + API.openAI,
                            // "Access-Control-Allow-Origin": "*"
                        }, body: JSON.stringify({
                            // "frequency_penalty": 1.2,
                            "max_tokens": 1000,
                            // "model": "text-davinci-003",
                            "model": "gpt-3.5-turbo",
                            // "presence_penalty": 0,
                            // "prompt": [message],
                            "messages": [{
                                "role": "user", "content": message
                            }],
                            "temperature": 0,
                        })
                    }).then((response) => {
                        if (response.status === 401) {
                            console.log("API error!")
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
                        $("#detailed_description").text(jsonData.choices[0].message.content).show()
                        console.log(jsonData)
                        $("#hidewhenAIsummary").hide()
                        // say that we got the information...
                        gotOpenAIResponse = true;
                        // then store the info in localstorage for quick access (this info doesn't change much, so it's a great option!)
                        // localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                    })
                } else {
                    // the follow-up call in case we don't have the info yet (loops back on itself, making a new setTimeout)
                    checkPerenualCareInfo()
                }
            }, 50)
        }
        if (debug.demo) {
            $("#hidewhenAIsummary").hide()
        }
        checkPerenualCareInfo()
        
        // console.log(parsedJson)        
    } else {
        $("#hidewhenautosummary").show()
        console.log("OpenAI API key not set.")
        console.log(`type:  API.openAI = "___your secret key here____";`)
        console.log(`then:  localStorage.setItem("API", JSON.stringify(API));`)
    }

}