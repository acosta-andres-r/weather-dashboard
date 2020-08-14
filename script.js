
var city = "Houston";

// variable of API parts for easy access throughout the code
var baseAPI = "https://api.openweathermap.org/data/2.5/"
var endPointWeather = "weather" + "?";
var endPointForecast = "forecast" + "?";
var api = "appid=" + "296147d25ca258f21c96f7c663b43bf3";
var unitsAPI = "&units=imperial";
var query = "&q=" + city;

var queryURLweather = baseAPI + endPointWeather + api + unitsAPI + query;
var queryURLforecast = baseAPI + endPointForecast + api + unitsAPI + query;

var iconBaseURL = "http://openweathermap.org/img/wn/";

// REQUEST: Current Weather
$.ajax({
    url: queryURLweather,
    method: "GET"
})
    .then(function (responseW) {
        console.log(responseW);

        var tempF = responseW.main.temp.toFixed(2) + " °F";
        var humidity = responseW.main.humidity + " %";
        var wind = responseW.wind.speed.toFixed(2) + " MPH";
        // Get coordinates to pass them for UV endpoint 
        var queryLat = "&lat=" + responseW.coord.lat;
        var queryLon = "&lon=" + responseW.coord.lon;
        var endPointUVI = "uvi" + "?";
        queryURLuvi = baseAPI + endPointUVI + api + queryLat + queryLon;

        // REQUEST: UVI by using coordinates of current weather request
        $.ajax({
            url: queryURLuvi,
            method: "GET"
        }).then(function (responseUVI) {

            console.log(responseUVI);
            var uvi = responseUVI.value.toFixed(2);
            console.log("UV Index: " + uvi);
        })

        console.log("Temperature (F): " + tempF);
        console.log("Humidity: " + humidity);
        console.log("Wind Speed: " + wind);
        
        // Get icon code to attach URL to a new image tag, then append to Body
        var iconCode = responseW.weather[0].icon + "@2x.png";
        var iconURL = iconBaseURL + iconCode;
        console.log("icon URL: " + iconURL);
        $("body").append($("<img>").attr("src", iconURL));

    })

// REQUEST: Forecast
$.ajax({
    url: queryURLforecast,
    method: "GET"
})
    .then(function (responseF) {
        console.log(responseF);


    })