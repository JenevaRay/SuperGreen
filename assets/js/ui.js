function withSearchResult(entry, perenualApiResult) {
    // to be used for search
    let id = perenualApiResult['id']
    // window.location.href = `${window.location.pathname}?plantID=${id}`
}

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
    

$("form").on("submit", (event) => {
    event.preventDefault()
    let searchString = $("form").find("input").first().val()
    console.log(searchString)
    window.location.href = `${window.location.pathname}?q=${searchString}`
    console.log("submitted!")
    
})

