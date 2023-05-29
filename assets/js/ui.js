function eachSearchResult(entry, perenualApiResult) {
    // do keep in mind that this is intentionally one API endpoint for consistency in development and viewing.

    // feel free to edit this for your needs - keep in mind that
    // this function is used site-wide, not just for individual html files.
    // array matches are used for ease of categorical changes.
    
    // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    imgSize = "original_url"
    
    // to be used for search

    
    let id = perenualApiResult['id']
    // window.location.href = `${window.location.pathname}?plantID=${id}`
    let thisDiv = $(`<div id="plantID-${perenualApiResult.id}">`).appendTo($('#results'))
    for (let [key, value] of Object.entries(perenualApiResult)) {
        let paywalled = false;
        let imgLicenseRestricted = false;
        // note: we're putting the Perenual plantID here in the DIV.  That way it's all distinct info.
        let innerDiv = ""
        if (["id", "medicinal_method"].includes(key)) {
            // id is already utilized as an option in thisDiv ('#plantID-____')  wholly skipping this one.
        } else if (["Coming Soon", "Upgrade Plan For Access https://perenual.com/subscription-api-pricing. Im sorry"].includes(value)) {
            // innerDiv.hide()
        } else {
            innerDiv = $(`<div class="${key}">`).appendTo(thisDiv) // for each data element, for custom styling.
            // console.log(key)
            let header = ""
            if (["common_name"].includes(key)) {
                console.log(value)
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
                                    case undefined:
                                        paywalled = true;
                                        // we would get this one in case of paywall, so we'll silently hide them
                                        break;
                                    case "CC0 1.0 Universal (CC0 1.0) Public Domain":
                                        // freely usable
                                    case "Attribution-ShareAlike License":
                                    case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
                                        imgLicenseRestricted = true;
                                        // use of this licence requires everything to be made copyleft (freely available upon request.)
                                    default: 
                                        console.log(perenualApiResult.default_image.license_name + " not known!")
                                    case "authorized":
                                        // console.log(perenualApiResult[key][imgSize])
                                        $(`<img src=${perenualApiResult[key][imgSize]}>`).appendTo(innerDiv)
                                        // move this section up or down depending on team agreement.
                                        break
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

function detailResult(entry, perenualApiResult) {
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

$("form").on("submit", (event) => {
    event.preventDefault()
    let searchString = $("form").find("input").first().val()
    // console.log()
    // if (window.location.pathname.split("/").includes("LandingPageSub")) {
    //     // different behavior for this page, which is where we are redirecting elsewhere.
    //     window.location.href = `../result.html?q=${searchString}`
    // } else {
        // this is for if we are on a single-page form
        window.location.href = `${window.location.pathname}?q=${searchString}`
    // }
})

params = new URLSearchParams(window.location.search)
invalidParams = false;
for (let [key, value] of params) {
    if (key === "q") {
        if (value == "") {invalidParams = true;} else {
            getPerenualPlantIDName(API.perenual, value)
        }
    } else if (key === "plantID") {
        targetDiv = $("<div>").appendTo("#results")
        // commented out so we aren't querying the API needlessly during development of other needed features.
        // showPerenualSpeciesInfo(API.perenual, targetDiv, "thumbnail")
        showPerenualSpeciesInfo(API.perenual, targetDiv, "thumbnail")
    } else {
        console.log(`search parameter ${key} not implemented`)
    }
}
if (window.location.search == "" || invalidParams) { 
    // window.location.href = `${window.location.pathname}?plantID=2292`
}