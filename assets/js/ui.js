function showCareGuide(data, innerDiv) {
    // silently implied, better to be explicit for readability.
    if (data.data.length != 0) {
        // if there's no rows of data, then there's nothing to parse/display/generate.
        for (let row in data.data) {
            // rows contain arrays of data in the section field.
            for (let index in data.data[row].section) {         
                // each entry is an object, this gives us all the information in parseable form.
                for (let [key, value] of Object.entries(data.data[row].section[index])) {
                    // add a section to the innerDiv, for dynamic sizing.
                    let keyDiv = $(`<div class=${key}>`).appendTo(innerDiv)
                    if (key === "id") {
                        // omit display of this, because it's already in the grandparent div data.
                    } else if (key === "type") {
                        // type: watering, for example.
                        $("<h3>").text(value).appendTo(keyDiv)
                    } else if (key === "description") {
                        // and then display the care guide.
                        $("<p>").text(value).appendTo(keyDiv)
                    }
                    // console.log(data.data[row].section[index])
                }
            }
        }
    }
}

function showEachSearchResult(perenualApiResult, jQueryEl, imgSize, linked = false) {
    // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    // do keep in mind that this is intentionally one API endpoint for consistency in development and viewing.

    // feel free to edit this for your needs - keep in mind that
    // this function is used site-wide, not just for individual html files.
    // array matches are used for ease of categorical changes.
    let thisDiv = $(`<div id="plantID-${perenualApiResult.id}" class="searchresult">`).appendTo(jQueryEl)
    for (let [key, value] of Object.entries(perenualApiResult)) {
        let imgLicenseRestricted = false;
        // note: we're putting the Perenual plantID here in the DIV.  That way it's all distinct info.
        let innerDiv = ""
        if (["id"].includes(key)) {
            if (linked) {
                let plantID = value
                thisDiv.on("click", () => {
                    // console.log(plantID)
                    window.location.href = `${window.location.pathname}?plantID=${plantID}`
                })
            }
            // medicinal_method is filtered out per team choice due to out-of-scope data.
        } else if (["medicinal_method"].includes(key)) {
            // if the data is not there because it's pending, then don't show it.
        } else if (["Coming Soon"].includes(value)) {
            // TODO: uncomment, because irrelevant information doesn't belong (hiding disabled for layout testing).
            // innerDiv.hide()
        } else {
            innerDiv = $(`<div class="${key}">`).appendTo(thisDiv) // for each data element, for custom styling.
            // console.log(key)
            let header = ""
            if (["common_name"].includes(key)) {
                // give custom headers for specific elements, like here, we're giving the <h1> tag for "common_name" info.
                $(`#detailed_${key}`).text(value)
                // header = $("<h1>").text(value).appendTo(innerDiv)
            } else if (["care-guides"].includes(key)) {
                // if there is no care guide (which seems common) then this is automatically omitted
                // the URL given to us by the API silently requires HTTPS or we get CORS errors.
                getPerenualCareInfo(innerDiv, value.replace(/http/i, "https"))
            } else if (["scientific_name"].includes(key)) {
                // subheader because usually it's the common name people look for.
                header = $("<h2>").text(value).appendTo(innerDiv)
            } else if (["other_name"].includes(key)) {
                // aliases also matter.
                p = $("<p>").text(value.join(", ")).appendTo(innerDiv)
            } else {
                if (!["default_image"].includes(key)) {
                    // this is a default category header, but not for images.
                    header = $("<h2>").text(key).appendTo(innerDiv)
                } 
                // and now we'll add any other info as <p>words</p>
                let p = "" // pre-define it so that we can use it later out of the scope of the switch case below.
                switch (typeof perenualApiResult[key]) {
                    case "string":
                        p = $("<p>").text(perenualApiResult[key]).insertAfter(header)
                        break;
                    case "object":
                        if (Array.isArray(perenualApiResult[key])) {
                            if (perenualApiResult[key].length == 0) {
                                // if the information is empty, do not show the category.
                                // TODO, enable after category layout is determined.
                                // innerDiv.hide()
                            }
                            for (index in perenualApiResult[key]) {
                                // for each entry in the array, give it its own line.
                                p = $("<p>").text(perenualApiResult[key][index]).insertAfter(header)
                            }
                        } else {
                            innerObj = perenualApiResult[key]
                            if (key == "hardiness_location") {
                                iframeHtml = innerObj.full_iframe
                                target = $(`#detailed_${key}`)
                                $(`<h3>`).text("Ideal Planting Zones (mostly by Temperature)")
                                $(`${iframeHtml}`).appendTo(target)
                                // hardinessURL = innerObj.full_url
                                // let hardinessImg = $(`<img src=${hardinessURL}>`).insertAfter(header)
                                // this seems to be a full page, and is NOT cacheable.
                            } else if (key == "hardiness") {
                                let max = perenualApiResult[key].max
                                let min = perenualApiResult[key].min
                                p = $("<p>").text(`min: ${min}, max: ${max}`).insertAfter(header)
                            } else if (key == "flowering_season") {
                                if (perenualApiResult[key] == null) {
                                    innerDiv.hide()
                                } else {
                                    console.log(perenualApiResult)
                                }
                                // p = $("<p>").text(`min: ${min}, max: ${max}`).insertAfter(header)
                            } else if (key == "default_image") {
                                if (perenualApiResult[key][imgSize].includes("49255769768_df55596553_b.jpg")) {
                                    if (debug.dataToBeDisplayed) {
                                        console.log("omitted search result with no image.")
                                    }
                                    thisDiv.hide()
                                } 
                                switch(perenualApiResult[key].license_name) {
                                    case undefined:
                                        // we would get this one in case of paywall, so we'll silently hide them.  no longer relevant.
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
                                        // for any of the above case statements, display the image.  for any of the below case statements, do not.
                                        $(`<img src=${perenualApiResult[key][imgSize]}>`).appendTo($(`#detailed_${key}`))
                                        // move this section up or down depending on team agreement.
                                        break
                                    }
            
                            } else {
                                if (value == null) {
                                    // if the information... really doesn't have information, then we'll hide the section.
                                    innerDiv.hide()
                                } else {
                                    // if the category does have information, report it.
                                    console.log(key)
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
                    case "number":
                        // this is another form of boolean.  Data returned is either 0 or 1.
                        if (perenualApiResult[key] == 1) {
                            header.text("IS " + header.text())
                        } else if (perenualApiResult[key] == 0) {
                            header.text("IS NOT " + header.text())
                        } else {
                            p = $("<p>").text(perenualApiResult[key]).insertAfter(header)
                        }
                        break;
                    default:
                        // if we don't know what the field is and how to display it, show this.
                        console.log(typeof perenualApiResult[key])
                        break;
                }
            }
        }
    }
}

$("form").on("submit", (event) => {
    event.preventDefault()
    // get the text from the first input within the form.
    let searchString = $("form").find("input").first().val()
    // search for the string given in the search box.
    window.location.href = `${window.location.pathname}?q=${searchString}`
})

params = new URLSearchParams(window.location.search)
invalidParams = false;
for (let [key, value] of params) {
    if (key === "q") {
        if (value != "") {
            // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
            // this fetches and parses the JSON for multiple generic results.
            getPerenualSpeciesList($("#results"), value, "thumbnail")
        }
    } else if (key === "plantID") {
        // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
        // this fetches and parses the JSON for a single detailed result.
        getPerenualPlantDetail($("#detailedresult"), value, "regular_url")
    } else {
        // if an unrecognized parameter is given, show us.
        console.log(`search parameter ${key} not implemented`)
    }
}
