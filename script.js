
var city = "Houston";

var api = "296147d25ca258f21c96f7c663b43bf3";
var queryURL = "https://api.openweathermap.org/data/2.5/weather?" 
                + "units=imperial"
                + "&appid=" + api
                + "&q=" + city;

console.log(queryURL);

$.ajax({
    url: queryURL,
    method: "GET"
})
    .then(function (response) {
        console.log(response);
        
        var tempF = response.main.temp.toFixed(2) + " °F";
        var humidity = response.main.humidity + " %";
        var wind = response.wind.speed + " MPH";
        
        console.log("Temperature (F): " + tempF)
        console.log("Humidity: " + humidity)
        console.log("Wind Speed: " + wind)


    })