var apiKey = "sk-ai9U646c22a32e62a1024"
var searchPlant = document.getElementById("searchplant");
var savedPlants = handleLocalStorage("plants");
console.log(searchPlant);
function handleSearch(event) {
    event.preventDefault()
    var searchPlant2 = searchPlant.value
    console.log(searchPlant2);
    handleLocalStorage("searchplant", "set")
   
    fetch(`https://perenual.com/api/species-list?${searchPlant}page=1&${apiKey}&watering=frequent&sunlight=full_sun`)
        // return response .json
        .then(function (response) {
            return response.json();
        }
        )
    
}
