
$("#add-city").on("click", function (event) {

  event.preventDefault()

  var city = $("#city-input").val();

  // variable of API parts for easy access throughout the code
  var baseAPI = "https://api.openweathermap.org/data/2.5/"
  var endPointWeather = "weather" + "?";
  var api = "appid=" + "296147d25ca258f21c96f7c663b43bf3";
  var unitsAPI = "&units=imperial";
  var query = "&q=" + city;

  var queryURLweather = baseAPI + endPointWeather + api + unitsAPI + query;

  var iconBaseURL = "https://openweathermap.org/img/wn/";

  // REQUEST: Current Weather
  $.ajax({
    url: queryURLweather,
    method: "GET",
    error: function (xhr, status, error) { // Testing error
      alert(xhr.responseJSON.message);
    }
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

      // var queryURLonecall = baseAPI + endPointOnecall + api + unitsAPI
      //   + queryLat + queryLon + excludeQuery;
      var queryURLonecall = baseAPI + endPointOnecall + api + unitsAPI
        + queryLat + queryLon + excludeQuery;

      // REQUEST: Onecall by using coordinates of current weather request
      $.ajax({
        url: queryURLonecall,
        method: "GET"
      }).then(function (responseOnecall) {

        // console.log(responseOnecall);

        // DATE OF FORECAST
        var i = 0 // Get first UV Index to assign to current UVI
        var forecastDays = responseOnecall.daily;

        while (i <= 5) {
          forecastDay = forecastDays[i]
          // Extract Date of Forecast
          var dateStr = new Date(forecastDay.dt * 1000).toString()
          var [weekDay, month, day, year] = dateStr.split(" ")
          // console.log(weekDay)
          var monthNumber = new Date(forecastDay.dt * 1000).getMonth() + 1
          // console.log("Month transformation: " + monthNumber)

          // Get temperature, humidity, wind speed, UV index
          var tempF = forecastDay.temp.day;
          var humidity = forecastDay.humidity;

          // UV Index
          if (i === 0) {
            i++;
            currentUVI = forecastDay.uvi;

            // console.log("Current UV Index: " + currentUVI);
            currentUVIel = $("#current-uvi")
            currentUVIel.text(currentUVI);

            // UVI color code
            if (0 <= currentUVI && currentUVI < 3) { // 0 to 2
              currentUVIel.removeClass()
              currentUVIel.addClass("current-uvi-0to2")
            } else
              if (3 <= currentUVI && currentUVI < 6) { // 3 to 5
                currentUVIel.removeClass()
                currentUVIel.addClass("current-uvi-3to5")
              } else
                if (6 <= currentUVI && currentUVI < 8) { // 6 to 7
                  currentUVIel.removeClass()
                  currentUVIel.addClass("current-uvi-6to7")
                } else
                  if (8 <= currentUVI && currentUVI < 11) { // 8 to 10
                    currentUVIel.removeClass();
                    currentUVIel.addClass("current-uvi-8to10");
                  } else
                    if (11 <= currentUVI) { // 11+
                      currentUVIel.removeClass();
                      currentUVIel.addClass("current-uvi-11");
                    }

            // CURRENT DATE
            // [weekDay, month, day, year]
            $("#current-day").text(weekDay);
            $("#current-date").text(month + " " + day);

          } else {
            var uvi = forecastDay.uvi;
            // Icon
            var forecastIcon = forecastDay.weather[0].icon + "@2x.png";
            var forecastIconURL = iconBaseURL + forecastIcon;

            // console.log("Temperature F: " + tempF + " °F");
            // console.log("Humidity: " + humidity + " %");
            // console.log("UV Index: " + uvi);

            // DATE: [weekDay, month, day, year]
            $("#date" + i).text(weekDay + ", " + monthNumber + "/" + day);

            // Assign forecast data to elements
            $("#temp" + i).text(tempF);
            $("#hum" + i).text(humidity);

            // Icon
            // console.log("icon URL: " + forecastIconURL);
            $("#icon" + i).attr("src", forecastIconURL);

            i++;
          }
        }

      })

      // Searched city
      $("#current-city").text(city)

      // CURRENT Weather
      // console.log("TESTING: Current Temperature (F): " + currentTempF);
      // console.log("TESTING: Current Humidity: " + currentHumidity);
      // console.log("TESTING: Current Wind Speed: " + currentWind);
      $("#current-temp").text(currentTempF)
      $("#current-hum").text(currentHumidity)
      $("#current-wind").text(currentWind)

      // Get icon code for URL to attach it into image tag
      var iconCode = responseW.weather[0].icon + "@2x.png";
      var iconURL = iconBaseURL + iconCode;
      // console.log("TESTING: icon URL: " + iconURL);
      // $("body").append($("<img>").attr("src", iconURL));
      $("#current-icon").attr("src", iconURL);
    })

})