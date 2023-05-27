

params = new URLSearchParams(window.location.search)
for (let [key, value] of params) {
    if (key === "q") {
        showPerenualSearch(API.perenual, $(".swiper-wrapper"), value, "thumbnail")
    }
}

$("form").on("submit", (event) => {
    event.preventDefault()
    let searchString = $("form").find("input").first().val()
    console.log(searchString)
    window.location.href = `${window.location.pathname}?q=${searchString}`
    console.log("submitted!")
})


