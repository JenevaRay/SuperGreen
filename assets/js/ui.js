function eachSearchResult(entry, perenualApiResult) {
    // feel free to edit this for your needs - keep in mind that
    // this function is used site-wide, not just for individual html files.
    // array matches are used for ease of categorical changes.
    
    imgSize = "thumbnail"
    
    // to be used for search

    
    let id = perenualApiResult['id']
    // window.location.href = `${window.location.pathname}?plantID=${id}`
    let thisDiv = $(`<div id="plantID-${perenualApiResult.id}">`).appendTo($('#results'))
    for (let [key, value] of Object.entries(perenualApiResult)) {
        let paywalled = false;
        let imgLicenseRestricted = false;
        // note: we're putting the Perenual plantID here in the DIV.  That way it's all distinct info.
        
        let innerDiv = $(`<div class="${key}">`).appendTo(thisDiv) // for each data element, for custom styling.
        if (["Coming Soon", "Upgrade Plan For Access https://perenual.com/subscription-api-pricing. Im sorry"].includes(value)) {
            innerDiv.hide()
        } else {
            // console.log(key)
            let header = ""
            if (["id"].includes(key)) {
                // id is already utilized as an option in thisDiv ('#plantID-____')  wholly skipping this one.
            } else if (["common_name"].includes(key)) {
                // give custom headers for specific elements, like here, we're giving the <h1> tag for "common_name" info.
                header = $("<h1>").text(value).appendTo(innerDiv)
            } else if (["scientific_name"].includes(key)) {
                header = $("<h2>").text(value).appendTo(innerDiv)
            } else if (["other_name"].includes(key)) {
                p = $("<p>").text(value.join(", ")).appendTo(innerDiv)
            } else {
                if (!["default_image"].includes(key)) {
                    // we won't add a header for images.
                    header = $("<h2>").text(key).appendTo(innerDiv)
                } 
                // and now we'll add any other info as <p>words</p>
                
                switch (typeof perenualApiResult[key]) {
                    case "string":
                        let p = $("<p>").text(perenualApiResult[key]).insertAfter(header)
                        break;
                    case "object":
                        if (Array.isArray(perenualApiResult[key])) {
                            if (perenualApiResult[key].length == 0) {
                                innerDiv.hide()
                            }
                            for (index in perenualApiResult[key]) {
                                let p = $("<p>").text(perenualApiResult[key][index]).insertAfter(header)
                            }
                        } else {
                            innerObj = perenualApiResult[key]
                            if (key == "hardiness_location") {
                                iframeHtml = innerObj.full_iframe
                                let iFrame = $(`${iframeHtml}`).insertAfter(header)
                                hardinessURL = innerObj.full_url
                                // let hardinessImg = $(`<img src=${hardinessURL}>`).insertAfter(header)
                                // this seems to be a full page, and is NOT cacheable.
                            } else if (key == "hardiness") {
                                let max = perenualApiResult[key].max
                                let min = perenualApiResult[key].min
                            } else if (key == "default_image") {
                                switch(perenualApiResult[key].license_name) {
                                    case "CC0 1.0 Universal (CC0 1.0) Public Domain":
                                        // freely usable
                                    case "Attribution-ShareAlike License":
                                    case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
                                        imgLicenseRestricted = true;
                                        // use of this licence requires everything to be made copyleft (freely available upon request.)
                                    case "authorized":
                                        console.log(perenualApiResult[key][imgSize])
                                        $(`<img src=${perenualApiResult[key][imgSize]}>`).appendTo(innerDiv)
                                        // move this section up or down depending on team agreement.
                                        break
                                    case undefined:
                                        paywalled = true;
                                        // we would get this one in case of paywall, so we'll silently hide them
                                        break;
                                    default: 
                                        console.log(perenualApiResult.default_image.license_name + " not known!")
                                }
            
                            } else {
                                console.log(key)
                                
                                for (let [innerKey, innerValue] in innerObj) {
                                    console.log(innerKey)
                                    // console.log(innerValue)
                                }
                            }
                            
                        }
                        break;
                    case "boolean":
                        booleanFields = ["cuisine"]
                        if (perenualApiResult[key]) {
                            // if it evaluates to True
                            if (booleanFields.includes(key)) {
                                header.text("IS " + header.text())
                            }    
                        } else {
                            // if it evaluates to False
                            header.text("IS NOT " + header.text())
                        }
                        // console.log(cache[url][key])
                        break;
                    default:
                        console.log(typeof perenualApiResult[key])
                        break;
                }
            }
        }
    }
}
        // rowResult = $(`<div data-plant-perenual=${cache[url].data[row].id}>`).addClass("swiper-slide").appendTo(jQueryDiv)
    //     $("<h2>").text(`${cache[url].data[row].common_name}`).appendTo(rowResult)
    //     // since this is useful in case we ever get Trefle working...
    //     $("<p>").text(`${cache[url].data[row].scientific_name}`).appendTo(rowResult)
    //     // in case of Attribution-ShareAlike License, we would have to make everything freely available, so we'll use it for proof-of-concept for now.
    //     // considering making this a function.  1 of 2 instances.
    //     switch(cache[url].data[row].default_image.license_name) {
    //         case "CC0 1.0 Universal (CC0 1.0) Public Domain":
    //             // freely usable
    //         case "Attribution-ShareAlike License":
    //         case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
    //             imgLicenseRestricted = true;
    //             // use of this licence requires everything to be made copyleft (freely available upon request.)
    //         case "authorized":
    //             $(`<img src=${cache[url].data[row].default_image[imgSize]}>`).appendTo(rowResult)
    //             // move this section up or down depending on team agreement.
    //             break
    //         case undefined:
    //             paywalled = true;
    //             // we would get this one in case of paywall, so we'll silently hide them
    //             break;
    //         default: 
    //             console.log(cache[url].data[row].default_image.license_name + " not known!")
    //     }

    //     let watering = $("<h3>").text("watering:").appendTo(rowResult)
    //     // if it's an array, then we'll iterate through it..
    //     if (Array.isArray(cache[url].data[row].watering)) {
    //         for (index in cache[url].data[row].watering) {
    //             // ..and for each entry in the array, display it.
    //             // please feel free to edit this for your needs, so you can get the appearance you want.
    //             // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
    //             let p = $("<p>").text(cache[url].data[row][index]).insertAfter(watering)
    //         }
    //     } else {
    //         // if it's not an array, display the string.
    //         // please feel free to edit this for your needs, so you can get the appearance you want.
    //         // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
    //         let p = $("<p>").text(cache[url].data[row].watering).insertAfter(watering)
    //     }

    //     let sunlight = $("<h3>").text("sunlight:").appendTo(rowResult)
    //     // if it's an array, then we'll iterate through it..
    //     if (Array.isArray(cache[url].data[row].sunlight)) {
    //         for (index in cache[url].data[row].sunlight) {
    //             // ..and for each entry in the array, display it.
    //             // please feel free to edit this for your needs, so you can get the appearance you want.
    //             // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow][index]).insertAfter(header)
    //             let p = $("<p>").text(cache[url].data[row].sunlight[index]).insertAfter(sunlight)
    //         }
    //     } else {
    //         // if it's not an array, display the string.
    //         // please feel free to edit this for your needs, so you can get the appearance you want.
    //         // works for reference      let p = $("<p>").text(desiredPerenualInfo[plantID][infoToShow]).insertAfter(header)
    //         let p = $("<p>").text(cache[url].data[row].sunlight).insertAfter(sunlight)
    //     }

    //     if (paywalled) {
    //         rowResult.hide();
    //     }
    //     if (debug.dataToBeDisplayed) {
    //         console.log(cache[url].data[row])
    //     }
    // }



$("form").on("submit", (event) => {
    event.preventDefault()
    let searchString = $("form").find("input").first().val()
    // console.log()
    if (window.location.pathname.split("/").includes("LandingPageSub")) {
        // different behavior for this page, which is where we are redirecting elsewhere.
        window.location.hre = `../result.html?q=${searchString}`
    } else {
        // this is for if we are on a single-page form
        window.location.href = `${window.location.pathname}?q=${searchString}`

    }
    
})




params = new URLSearchParams(window.location.search)
invalidParams = false;
for (let [key, value] of params) {
    if (key === "q") {
        if (value == "") {invalidParams = true;} else {
            getPerenualPlantIDName(API.perenual, value)
        }
        
    } else if (key === "plantID") {
        targetDiv = $("<div>").appendTo(".swiper-wrapper")
        // commented out so we aren't querying the API needlessly during development of other needed features.
        // showPerenualSpeciesInfo(API.perenual, targetDiv, "thumbnail")
        showPerenualSearch(API.perenual, targetDiv, "thumbnail")
    } else {
        console.log(`search parameter ${key} not implemented`)
    }
}
if (window.location.search == "" || invalidParams) { 
    // window.location.href = `${window.location.pathname}?plantID=2292`
}
    

