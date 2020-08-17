
var city = "Houston";

// variable of API parts for easy access throughout the code
var baseAPI = "https://api.openweathermap.org/data/2.5/"
var endPointWeather = "weather" + "?";
var api = "appid=" + "296147d25ca258f21c96f7c663b43bf3";
var unitsAPI = "&units=imperial";
var query = "&q=" + city;

var queryURLweather = baseAPI + endPointWeather + api + unitsAPI + query;

var iconBaseURL = "http://openweathermap.org/img/wn/";

// REQUEST: Current Weather
$.ajax({
  url: queryURLweather,
  method: "GET"
})
  .then(function (responseW) {
    // console.log(responseW);

    var currentTempF = responseW.main.temp.toFixed(2) + " °F";
    var currentHumidity = responseW.main.humidity + " %";
    var currentWind = responseW.wind.speed.toFixed(2) + " MPH";
    var currentUVI = ""; // Used inside "Date of Forecast"

    // Get coordinates to pass them for Onecall endpoint 
    var queryLat = "&lat=" + responseW.coord.lat;
    var queryLon = "&lon=" + responseW.coord.lon;
    var endPointOnecall = "onecall" + "?";
    var excludeQuery = "&exclude=hourly,minutely"

    var queryURLonecall = baseAPI + endPointOnecall + api + unitsAPI
      + queryLat + queryLon + excludeQuery;

    // REQUEST: Onecall by using coordinates of current weather request
    $.ajax({
      url: queryURLonecall,
      method: "GET"
    }).then(function (responseOnecall) {

      console.log(responseOnecall);

      // DATE OF FORECAST
      var i = 1 // Get first UV Index to assign to current UVI
      var forecastDays = responseOnecall.daily;
      for (forecastDay of forecastDays) {

        // Extract Date of Forecast
        var dateStr = new Date(forecastDay.dt * 1000).toString()
        var [weekDay, month, day, year] = dateStr.split(" ")
        // console.log(weekDay)

        // Get temperature, humidity, wind speed, UV index
        var TempF = forecastDay.temp.day;
        var humidity = forecastDay.humidity;
        var wind = forecastDay.wind_speed;

        // UV Index
        if (i === 1) {
          currentUVI = forecastDay.uvi;
          i++;
          console.log("Current UV Index: " + currentUVI);
        } else {
          var uvi = forecastDay.uvi;
          console.log("UV Index: " + uvi); // Sent current UV Index to a global variable
        }

        console.log("Temperature F: " + TempF + " °F");
        console.log("Humidity: " + humidity + " %");
        console.log("Wind Speed: " + wind + " MPH");
        // Icon
        var forecastIcon = forecastDay.weather[0].icon + "@2x.png";
        var forecastIconURL = iconBaseURL + forecastIcon;
        console.log("icon URL: " + forecastIconURL);
        $("body").append($("<img>").attr("src", forecastIconURL));
      }

    })

    // CURRENT Weather
    console.log("Current Temperature (F): " + currentTempF);
    console.log("Current Humidity: " + currentHumidity);
    console.log("Current Wind Speed: " + currentWind);

    // Get icon code for URL to attach it into a new image tag, then append to Body
    var iconCode = responseW.weather[0].icon + "@2x.png";
    var iconURL = iconBaseURL + iconCode;
    console.log("icon URL: " + iconURL);
    $("body").append($("<img>").attr("src", iconURL));

  })