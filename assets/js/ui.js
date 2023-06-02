function showCareGuide(data) {
    // let innerDiv = $(`#detailed_care_guides`)
    // silently implied, better to be explicit for readability.

    // $("#detailed_care_guide_watering").text("This is text")
    if (data.data.length != 0) {
        // if there's no rows of data, then there's nothing to parse/display/generate.
        for (let row in data.data) {
            // rows contain arrays of data in the section field.

            for (let index in data.data[row].section) {         
                // each entry is an object, this gives us all the information in parseable form.
                // console.log(data.data[row].section[index])
                // console.log(data.data[row].section[index].description)
                if (data.data[row].section[index].type == "watering") {
                    $("#detailed_care_guide_watering").text(data.data[row].section[index].description)
                } else if (data.data[row].section[index].type == "sunlight") {
                    $("#detailed_care_guide_sunlight").text(data.data[row].section[index].description)
                } else if(data.data[row].section[index].type == "pruning") {
                    $("#detailed_care_guide_pruning").text(data.data[row].section[index].description)
                }
            }
        }
    }
}

function showEachSearchResult(perenualApiResult, jQueryEl, imgSize, linked = false, mode="#detailed") {
    // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
    // do keep in mind that this is intentionally one API endpoint for consistency in development and viewing.

    // feel free to edit this for your needs - keep in mind that
    // this function is used site-wide, not just for individual html files.
    // array matches are used for ease of categorical changes.
    let thisDiv = $(`<div id="plantID-${perenualApiResult.id}" class="searchresult">`).appendTo(jQueryEl)
    let imageContainer =  thisDiv.find("#imageContainer")

    // let keys = Object.keys(perenualApiResult)
    let booleanFields = ["cones", "cuisine", "drought_tolerant", "edible_fruit", "edible_leaf", "flowers", "fruits", "indoor", "invasive", "leaf", "medicinal", "poisonous_to_humans", "poisonous_to_pets", "salt_tolerant", "thorny", "tropical"]
    
    let trueBooleanFields = []
    
    // let fieldsComingSoon = ["rare", "rare_level", "cuisine_list", "edible_fruit_taste_profile", "edible_leaf_taste_profile", "endangered", "endangered_level", "fruit_nutritional_value", "harvest_method", "harvest_season", "leaf_nutritional_value", "medicinal_use", "pest_susceptibility_api", "poison_effects_to_humans", "poison_effects_to_pets", "poison_to_humans_cure", "poison_to_pets_cure", "problem"]
    // let fieldsNull = ["flowering_season"]

    if (mode == "searchresult") {
        if (linked) {
            thisDiv.on("click", () => {
                window.location.href = `${window.location.pathname}?plantID=${perenualApiResult.id}`
            })
        }

        let commonNameDiv = $(`<div class="common_name">`).appendTo(thisDiv)
        $(`<h1>`).text(perenualApiResult.common_name).appendTo(commonNameDiv)
        let scientificNameDiv = $(`<div class="scientific_name">`).appendTo(thisDiv)
        $(`<h2>`).text(perenualApiResult.scientific_name).appendTo(scientificNameDiv)
        let imgDiv = $(`<div class="default_image">`).appendTo(thisDiv)
        $(`<img src=${perenualApiResult.default_image[imgSize]}>`).appendTo(imgDiv)

        if (perenualApiResult.other_name.length != 0) {
            let otherNameDiv = $(`<div class="other_name">`).appendTo(thisDiv)
            $("<p>").text(`Also known as: ${perenualApiResult.other_name.join(', ')}`).appendTo(otherNameDiv)
        }
        let cycleDiv = $(`<div class="cycle">`).appendTo(thisDiv)
        $("<p>").text(`This plant is: ${perenualApiResult.cycle.toLowerCase()} `).appendTo(cycleDiv)
        let wateringDiv = $(`<div class="watering">`).appendTo(thisDiv)
        $("<p>").text(`This requires ${perenualApiResult.watering.toLowerCase()} watering.`).appendTo(wateringDiv)
        let sunlightDiv = $(`<div class="sunlight">`).appendTo(thisDiv)
        $("<p>").text(`This grows best in ${perenualApiResult.sunlight.join(" or ").toLowerCase()}`).appendTo(sunlightDiv)
    } else {
        $(`${mode}_common_name`).text(perenualApiResult.common_name)
        if (perenualApiResult.family != null) {
            $(`${mode}_scientific_name`).text(`${perenualApiResult.family}: ${perenualApiResult.scientific_name}`)
        } else {
            $(`${mode}_scientific_name`).text(`${perenualApiResult.scientific_name}`)
        }
        
        if (perenualApiResult.other_name.length != 0) {
            $("<p>").text(`Also known as: ${perenualApiResult.other_name.join(', ')}`).appendTo($(`${mode}_all_image`))
        }
        $(`<img src=${perenualApiResult.default_image[imgSize]}>`).appendTo($(`${mode}_default_image`))
        $(`${mode}_origin`).text(`from: ${perenualApiResult.origin.join(", ")}`)
        $(`${mode}_watering`).text(`This requires ${perenualApiResult.watering.toLowerCase()} watering.`)
        $(`${mode}_sunlight`).text(`This grows best in ${perenualApiResult.sunlight.join(" or ").toLowerCase()}`)
        $(`${mode}_cycle`).text(`This plant is: ${perenualApiResult.cycle.toLowerCase()} `)
        $(`${mode}_care_level`).text(`This plant is ${perenualApiResult.care_level.toLowerCase()} to care for.`)
        $(`${mode}_type`).text(`This is a ${perenualApiResult.type.toLowerCase()}`)
        console.log(perenualApiResult.dimension)
        $(`${mode}_dimension`).text(`Size: ${perenualApiResult.dimension}`)
        $(`${mode}_description`).text(`${perenualApiResult.description}`)
        $(`${mode}_hardiness_location`).html(perenualApiResult.hardiness_location.full_iframe)
        
        if (perenualApiResult.flowers) {            
            if (perenualApiResult.flowering_season !== null) {
                $(`${mode}_flowering_season`).text(`Flowers bloom in ${perenualApiResult.flowering_season.toLowerCase()}`)
            } else {
                $(`${mode}_flowering_season`).hide()
            }
            $(`${mode}_flower_color`).text(`Flowers are ${perenualApiResult.flower_color.toLowerCase()}`)
        } else {
            $(`${mode}_flowering_season`).hide()
            $(`${mode}_flower_color`).hide()
        }

        $(`${mode}_growth_rate`).text(`Growth rate is ${perenualApiResult.growth_rate.toLowerCase()}`)
        $(`${mode}_soil`).text(`Soils this grows in: ${perenualApiResult.soil.join(", ").toLowerCase()}`)
        $(`${mode}_propagation`).text(`Propagation: ${perenualApiResult.propagation.join(", ").toLowerCase()}`)
        if (perenualApiResult.pest_susceptibility.length > 0) {
            $(`${mode}_pest_susceptibility`).text(`Pests: ${perenualApiResult.pest_susceptibility.join(", ").toLowerCase()}`)
        } else {
            $(`${mode}_pest_susceptibility`).hide()
        }
        

        let poisonous_to = []
        if (perenualApiResult.poisonous_to_humans) {
            poisonous_to.push("Humans")
            $(`${mode}_poisonous_to_humans`).text("Poisonous to Humans")
        }
        if (perenualApiResult.poisonous_to_pets) {
            poisonous_to.push("Pets")
            $(`${mode}_poisonous_to_pets`).text("Poisonous to Pets")
        }
        if (poisonous_to.length == 0) {
            $(`${mode}_poisonous_to_`).text(`Not Poisonous`)
        } else {
            $(`${mode}_poisonous_to_`).text(`Poisonous to: ${poisonous_to.join(", ")}`)
        }

        if (perenualApiResult.attracts.length != 0) {
            $(`${mode}_attracts`).text(`This attracts: ${perenualApiResult.attracts.join(", ").toLowerCase()}`)
        } else {
            $(`${mode}_attracts`).hide()
        }
        let key = "care-guides"
        getPerenualCareInfo(perenualApiResult[key].replace(/http/i, "https"))

        // console.log(perenualApiResult)
        // todo: eventually remove the below section.
        



        // for (let [key, value] of Object.entries(perenualApiResult)) {
        //     let paywalled = false;
        //     let imgLicenseRestricted = false;
        //     // note: we're putting the Perenual plantID here in the DIV.  That way it's all distinct info.
        //     let innerDiv = ""
        //     if (["id"].includes(key)) {
        //         if (linked) {
        //             let plantID = value
        //             thisDiv.on("click", () => {
        //                 // console.log(plantID)
        //                 window.location.href = `${window.location.pathname}?plantID=${plantID}`
        //             })
        //         }
        //         // medicinal_method is filtered out per team choice due to out-of-scope data.
        //     } else if (["medicinal_method"].includes(key)) {
        //         // if the data is not there because it's pending, then don't show it.
        //     } else if (["Coming Soon"].includes(value)) {
        //         // TODO: uncomment, because irrelevant information doesn't belong (hiding disabled for layout testing).
        //         // innerDiv.hide()
        //     } else {
        //         innerDiv = $(`<div class="${key}">`).appendTo(thisDiv) // for each data element, for custom styling.
        //         // console.log(key)
        //         let header = ""
        //         if (["common_name"].includes(key)) {
        //             // give custom headers for specific elements, like here, we're giving the <h1> tag for "common_name" info.
        //             $(`${mode}_${key}`).text(value)
        //             // header = $("<h1>").text(value).appendTo(innerDiv)
        //         // } else if (["care-guides"].includes(key)) {
        //         //     // if there is no care guide (which seems common) then this is automatically omitted
        //         //     // the URL given to us by the API silently requires HTTPS
        //         //     getPerenualCareInfo(innerDiv, value.replace(/http/i, "https"))
        //         // } else if (["scientific_name"].includes(key)) {
        //         //     header = $("<h2>").text(value).appendTo(innerDiv)
        //         // } else if (["other_name"].includes(key)) {
        //         //     // aliases also matter.
        //         //     p = $("<p>").text(value.join(", ")).appendTo(innerDiv)
        //         } else {
        //             if (!["default_image"].includes(key)) {
        //                 // we won't add a header for images.
        //                 header = $("<h2>").text(key).appendTo('innerDiv')
        //                 // this is a default category header, but not for images.
        //                 header = $("<h2>").text(key).appendTo(innerDiv)
        //             } 
        //             // and now we'll add any other info as <p>words</p>
        //             let p = "" // pre-define it so that we can use it later out of the scope of the switch case below.
        //             switch (typeof perenualApiResult[key]) {
        //                 case "string":
        //                     p = $("<p>").text(perenualApiResult[key]).insertAfter(header)
        //                     break;
        //                 case "object":
        //                     if (Array.isArray(perenualApiResult[key])) {
        //                         if (perenualApiResult[key].length == 0) {
        //                             // if the information is empty, do not show the category.
        //                             // TODO, enable after category layout is determined.
        //                             // innerDiv.hide()
        //                         }
        //                         for (index in perenualApiResult[key]) {
        //                             // for each entry in the array, give it its own line.
        //                             p = $("<p>").text(perenualApiResult[key][index]).insertAfter(header)
        //                         }
        //                     } else {
        //                         innerObj = perenualApiResult[key]
        //                         if (key == "hardiness_location") {
        //                             iframeHtml = innerObj.full_iframe
        //                             target = $(`#detailed_${key}`)
        //                             $(`${iframeHtml}`).appendTo(target)
        //                             hardinessURL = innerObj.full_url;                                    
        //                             // let hardinessImg = $(`<img src=${hardinessURL}>`).insertAfter(header)
        //                             // this seems to be a full page, and is NOT cacheable.
        //                         } else if (key == "hardiness") {
        //                             let max = perenualApiResult[key].max
        //                             let min = perenualApiResult[key].min
        //                             p = $("<p>").text(`min: ${min}, max: ${max}`).insertAfter(header)
        //                         } else if (key == "flowering_season") {
        //                             if (perenualApiResult[key] == null) {
        //                                 innerDiv.hide()
        //                             } else {
        //                                 $("<p>").text(value).appendTo('#typeContainer');
        //                             }
        //                             // p = $("<p>").text(`min: ${min}, max: ${max}`).insertAfter(header)
        //                         } else if (key == "default_image") {
        //                             if (perenualApiResult[key][imgSize].includes("49255769768_df55596553_b.jpg")) {
        //                                 if (debug.dataToBeDisplayed) {
        //                                     console.log("omitted search result with erroneous image.")
        //                                 }
        //                                 thisDiv.hide()
        //                             } 
        //                             switch(perenualApiResult[key].license_name) {
        //                                 case undefined:
        //                                     paywalled = true;
        //                                     // we would get this one in case of paywall, so we'll silently hide them
        //                                     break;
        //                                 case "CC0 1.0 Universal (CC0 1.0) Public Domain":
        //                                     // freely usable
        //                                 case "Attribution-ShareAlike License":
        //                                 case "Attribution-ShareAlike 3.0 Unported (CC BY-SA 3.0)":
        //                                     imgLicenseRestricted = true;
        //                                     // use of this licence requires everything to be made copyleft (freely available upon request.)
        //                                 default: 
        //                                     console.log(perenualApiResult.default_image.license_name + " not known!")
        //                                 case "authorized":
        //                                     // for any of the above case statements, display the image.  for any of the below case statements, do not.
        //                                     $(`<img src=${perenualApiResult[key][imgSize]}>`).appendTo(innerDiv)
        //                                     // move this section up or down depending on team agreement.
        //                                     break
        //                                 }
                
        //                         } else {
        //                             if (value == null) {
        //                                 // if the information... really doesn't have information, then we'll hide the section.
        //                                 innerDiv.hide()
        //                             } else {
        //                                 // if the category does have information, report it.
        //                                 console.log(key)
        //                             }
        //                         }
                                
        //                     }
        //                     break;
        //                 case "boolean":
        //                     booleanFields = ["cuisine"]
        //                     if (perenualApiResult[key]) {
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
        //                 case "number":
        //                     // this is another form of boolean.  Data returned is either 0 or 1.
        //                     if (perenualApiResult[key] == 1) {
        //                         header.text("IS " + header.text())
        //                     } else if (perenualApiResult[key] == 0) {
        //                         header.text("IS NOT " + header.text())
        //                     } else {
        //                         p = $("<p>").text(perenualApiResult[key]).insertAfter(header)
        //                     }
        //                     break;
        //                 default:
        //                     // if we don't know what the field is and how to display it, show this.
        //                     console.log(typeof perenualApiResult[key])
        //                     break;
        //             }
        //         }
        //     }
        // }
    }
}

$("#contactForm").on("submit", (event) => {
    event.preventDefault()
    // get the text from the first input within the form.
    let searchString = $("form").find("input").first().val()
    // search for the string given in the search box.
    window.location.href = `${window.location.pathname}?q=${searchString}`
})

params = new URLSearchParams(window.location.search)
invalidParams = false;
$("#detailedresult").hide()
for (let [key, value] of params) {
    if (key === "q") {
        if (value != "") {
            // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
            // this fetches and parses the JSON for multiple generic results.
            getPerenualSpeciesList($("#results"), value, "thumbnail")
            // we will hide detailed results html for searching by name, when one has been selected, then it switches modes to detailed results by plantID
            $(".landing").hide()
        }
    } else if (key === "plantID") {
        // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
        // this fetches and parses the JSON for a single detailed result.
        getPerenualPlantDetail($("#detailedresult"), value, "regular_url")
        // we will hide search-by-name results html in this mode.
        $("#results").hide()
        $("#detailedresult").show()
        $(".landing").hide()
    } else {
        //console.log(`search parameter ${key} not implemented`)
    }
}

// $('.btn').on('click', function(event){
//     event.preventDefault();
//     $('.search-box').removeClass('hide');
// })