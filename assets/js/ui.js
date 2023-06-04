function showCareGuide(data) {
    // silently implied, better to be explicit for readability.
    if (data.data.length != 0) {
        // if there's no rows of data, then there's nothing to parse/display/generate.
        for (let row in data.data) {
            // rows contain arrays of data in the section field.

            for (let index in data.data[row].section) {         
                // each entry is an object, this gives us all the information in parseable form.
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

    if (mode == "searchresult") {
       
        let mainDiv = $('<div class="mainDiv"></div>').appendTo(thisDiv);

        let commonNameDiv = $(`<div class="common_name">`).appendTo(mainDiv);
        $(`<h1>`).text(perenualApiResult.common_name).appendTo(commonNameDiv);

        let scientificNameDiv = $(`<div class="scientific_name">`).appendTo(mainDiv);
        $(`<h4>`).text(perenualApiResult.scientific_name).appendTo(scientificNameDiv);
        
        let imgDiv = $(`<div class="default_image">`).appendTo(mainDiv);
        if (perenualApiResult.default_image[imgSize] == undefined) {
            // some images in the API do not have resized images.
            $(`<img src=${perenualApiResult.default_image['original_url']}>`).appendTo(imgDiv);
        } else {
            $(`<img src=${perenualApiResult.default_image[imgSize]}>`).appendTo(imgDiv);
        }
        let favorite = $(`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`).appendTo(imgDiv)
        favorite.attr("fill", "#ffffffbb")
        if (cache.favorites != undefined) {
            for (row in cache.favorites) {
                if (cache.favorites[row].id == perenualApiResult.id) {
                    favorite.attr("fill", "#a52a2acc")
                }
            }
        }
        if (linked) {
            thisDiv.on("click", (event) => {
                let target = $(event.target)
                // svg and path are svg elements.
                if (target.is("svg") || target.is("path")) {
                    let inFavorites = false
                    if (cache.favorites == undefined) {
                        cache.favorites = []
                        // localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                    } else {
                        for (row in cache.favorites) {
                            if (cache.favorites[row].id == perenualApiResult.id) {
                                inFavorites = true
                                cache.favorites.splice(row, 1)
                                favorite.attr("fill", "#ffffffbb")
                                localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                            }
                        }
                    }
                    if (!inFavorites) {
                        // then we'll add to favorites.
                        let data = {
                            "id": perenualApiResult.id,
                            "common_name": perenualApiResult.common_name,
                            "scientific_name": perenualApiResult.scientific_name
                        }
                        cache.favorites.push(data)
                        localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                        favorite.attr("fill", "#a52a2acc")
                    }
                    // console.log(data)
                } else {
                    window.location.href = `${window.location.pathname}?plantID=${perenualApiResult.id}`
                }
            })
        }
        
        if (perenualApiResult.default_image[imgSize] == undefined || perenualApiResult.default_image[imgSize].includes("49255769768_df55596553_b.jpg")) {
            // this is a filler image for a legitimate entry, but we don't want to display trees when people are looking for raspberries.
            thisDiv.hide()
        }
        
        if (perenualApiResult.other_name.length != 0) {
            let otherNameDiv = $(`<div class="other_name">`).appendTo(thisDiv)
            $("<p>").text(`Also known as: ${perenualApiResult.other_name.join(', ')}`).appendTo(otherNameDiv)
        }
        
        // DO NOT DELETE: this may be functionality we want.
        // let cycleDiv = $(`<div class="cycle">`).appendTo(thisDiv)
        // $("<p>").text(`This plant is: ${perenualApiResult.cycle.toLowerCase()} `).appendTo(cycleDiv)
        // let wateringDiv = $(`<div class="watering">`).appendTo(thisDiv)
        // $("<p>").text(`This requires ${perenualApiResult.watering.toLowerCase()} watering.`).appendTo(wateringDiv)
        // let sunlightDiv = $(`<div class="sunlight">`).appendTo(thisDiv)
        // $("<p>").text(`This grows best in ${perenualApiResult.sunlight.join(" or ").toLowerCase()}`).appendTo(sunlightDiv)

    } else {
        $(`${mode}_common_name`).text(perenualApiResult.common_name)
        if (perenualApiResult.family != null) {
            $(`${mode}_scientific_name`).text(`${perenualApiResult.family}: ${perenualApiResult.scientific_name}`)
        } else {
            $(`${mode}_scientific_name`).text(`${perenualApiResult.scientific_name}`)
        }
        
        if (perenualApiResult.other_name.length != 0) {
            $("<p>").text(`Also known as: ${perenualApiResult.other_name.join(', ')}`).insertAfter($(`${mode}_scientific_name`))
        }
        let image = $(`<img src=${perenualApiResult.default_image[imgSize]}>`).appendTo($(`${mode}_default_image`))


        let favorite = $(`<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`).appendTo($(`${mode}_default_image`))
        favorite.attr("fill", "#ffffffbb")
        if (cache.favorites != undefined) {
            for (row in cache.favorites) {
                if (cache.favorites[row].id == perenualApiResult.id) {
                    favorite.attr("fill", "#a52a2acc")
                }
            }
        }
        $(`${mode}_default_image`).on("click", (event) => {
            let target = $(event.target)
            // svg and path are svg elements.
            if (target.is("svg") || target.is("path")) {
                console.log()
                let inFavorites = false
                if (cache.favorites == undefined) {
                    cache.favorites = []
                } else {
                    for (row in cache.favorites) {
                        if (cache.favorites[row].id == perenualApiResult.id) {
                            inFavorites = true
                            cache.favorites.splice(row, 1)
                            localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                            favorite.attr("fill", "#ffffffbb")
                        }
                    }
                }
                if (!inFavorites) {
                    // then we'll add to favorites.
                    let data = {
                        "id": perenualApiResult.id,
                        "common_name": perenualApiResult.common_name,
                        "scientific_name": perenualApiResult.scientific_name
                    }
                    cache.favorites.push(data)
                    localStorage.setItem("PerenualInfo", JSON.stringify(cache))
                    favorite.attr("fill", "#a52a2acc")
                }
                // console.log(data)
            } 
            makeFavoritesButtons()
        })



        $(`${mode}_origin`).text(`from: ${perenualApiResult.origin.join(", ")}`)
        $(`${mode}_watering`).text(`This requires ${perenualApiResult.watering.toLowerCase()} watering.`)        
        $(`${mode}_sunlight`).text(`This grows best in ${perenualApiResult.sunlight.join(" or ").toLowerCase()}`)
        if (perenualApiResult.cycle) {
            $(`${mode}_cycle`).text(`This plant is: ${perenualApiResult.cycle.toLowerCase()} `)
        } else {
            $(`${mode}_cycle`).hide()
        }
        if (perenualApiResult.care_level != null) {
            $(`${mode}_care_level`).text(`Care difficulty: ${perenualApiResult.care_level.toLowerCase()}`)
        } else {
            $(`${mode}_care_level`).hide()
        }
        $(`${mode}_type`).text(`This is a ${perenualApiResult.type.toLowerCase()}`)

        $(`${mode}_dimension`).text(`Size: ${perenualApiResult.dimension}`)
        // console.log(perenualApiResult.description)
        if (perenualApiResult.description == 'null') {
            $(`${mode}_description`).text(`${perenualApiResult.description}`)
        } else {
            $(`${mode}_description`).hide()
        }
        $(`${mode}_hardiness_location`).html(perenualApiResult.hardiness_location.full_iframe).addClass("hardiness-location-container")
        
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
        if (perenualApiResult.soil.length > 0) {
            $(`${mode}_soil`).text(`Soils this grows in: ${perenualApiResult.soil.join(", ").toLowerCase()}`)
        } else {
            $(`${mode}_soil`).hide()
        }
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
        getOpenAIquery(perenualApiResult, perenualApiResult[key].replace(/http/i, "https"))
    }
}

$("form").on("submit", (event) => {
    event.preventDefault()
    // get the text from the first input within the form.
    let searchString = $(event.target).find("input").first().val()
    // search for the string given in the search box.
    window.location.href = `${window.location.pathname}?q=${searchString}`
})

// $("#contactForm").on("submit", (event) => {
//     event.preventDefault()
//     // get the text from the first input within the form.
//     let searchString = $("form").find("input").first().val()
//     // search for the string given in the search box.
//     window.location.href = `${window.location.pathname}?q=${searchString}`
// })

// $("#minisearch").on("submit", (event) => {
//     event.preventDefault()
//     console.log()
//     // get the text from the first input within the form.
//     let searchString = $("#minisearch").find("input").first().val()
//     // search for the string given in the search box.
//     window.location.href = `${window.location.pathname}?q=${searchString}`
// })


params = new URLSearchParams(window.location.search)
invalidParams = false;
$("#detailedresult").hide()
$("#minisearch").hide()
for (let [key, value] of params) {
    if (key === "q") {
        if (value != "") {
            // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
            // this fetches and parses the JSON for multiple generic results.
            getPerenualSpeciesList($("#results"), value, "thumbnail")
            // we will hide detailed results html for searching by name, when one has been selected, then it switches modes to detailed results by plantID
            $("#detailedresult").hide()
            $("#minisearch").show()
            $(".landing").hide()
        }
    } else if (key === "plantID") {
        // image size from ["medium_url", "original_url", "regular_url", "small_url", "thumbnail"]
        // this fetches and parses the JSON for a single detailed result.
        getPerenualPlantDetail($("#detailedresult"), value, "regular_url")
        // we will hide search-by-name results html in this mode.
       // $("#results").hide()
        $("#detailedresult").show()
        $("#minisearch").show()
        $("#results").hide()
        $(".landing").hide()
    } else {
        //console.log(`search parameter ${key} not implemented`)
    }
}

function makeFavoritesButtons () {
    $("#favorites").empty()
    for (row in cache.favorites) {
        let button = $(`<button class="btn btn-lg" data-plantid=${cache.favorites[row].id}>`).text(`${cache.favorites[row].common_name}`).css("margin-left", "5px;").appendTo($("#favorites"))
        button.on("click", (event) => {
            window.location.href = `${window.location.pathname}?plantID=${button.data().plantid}`
        })
    }
}
makeFavoritesButtons()