// Definition of Global Variables

var city;
var queryUrl;
var latitude;
var longitude;

//Creation of our cityArray, to save previously searched cities to local storage.
var cityArray = JSON.parse(localStorage.getItem("cityArray") || "[]");
if (cityArray[0]) {
  city = cityArray[cityArray.length - 1];
  searchedCityArray();
    queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=9f127df86a905480471060870ba864e6";
  apiCall(queryUrl);
}

//generates and updates list of previously searched cities. Stores updates in Local Stotage

function searchedCityArray() {
  $("#savedCity").empty();
  if (cityArray) {
    for (var i = 0; i < cityArray.length; i++) {
      if (city === cityArray[i]) {
        cityArray.splice(i, 1);
      }
    }
  }
  cityArray.push(city);
  localStorage.setItem("cityArray", JSON.stringify(cityArray));
  if (cityArray) {
    for (var i = 0; i < cityArray.length; i++) {
      newSection = $("<section>").addClass("citySection");
      $("#savedCity").prepend(newSection);
      var newCity = $("<a>").text(cityArray[i]).addClass("newCity px-2");
      newSection.prepend(newCity);
    }
  }
}

// Click event to pull search data from input field

$("#searchButton").on("click", function (event) {
    event.preventDefault();
    city = $("#searchCity").val();
    $("#searchCity").val("");
    queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=9f127df86a905480471060870ba864e6";
    apiCall(queryUrl);

});

//Function to send a request to OpenWeather API and append the searched city's data to the frontend.

function apiCall(queryUrl) {
    $.ajax({
        url: queryUrl,
        method: "GET",
        success: function (response) {
            console.log(response);
            city = response.name;
            newSection = $("<section>").addClass("citySection");
            $("#savedCity").prepend(newSection);
            var newCity = $("<a>").text(city).addClass("newCity px-2");
            newSection.prepend(newCity);
            $("#city").text(response.name);
            $("#date").text(" (" + moment().format('l') + ")");
            $("#currentWeatherType").text("'" + response.weather[0].description + "'");
            var temp = response.main.temp.toFixed(1);
            $("#currentTemp").html("Temperature: " + temp);
            $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
            $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + "MPH");
            latitude = response.coord.lat;
            longitude = response.coord.lon;
            searchedCityArray();
            uvIndex();
            fiveDayForecast();
        }

    })
}

//Function to send a request to OpenWeather API for the UV Index values for the searched city, as it uses a different API call to get that data.

function uvIndex() {
    var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&APPID=9f127df86a905480471060870ba864e6";
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        var uv = response.value;
        uvText = "gainsboro";
        if (uv < 3) {
            uvColor = "green";
        }
        else if (uv >= 3 && uv < 6) {
            uvColor = "yellow";
        }
        else if (uv >= 6 && uv < 8) {
            uvColor = "orange";
        }
        else if (uv >= 8 && uv < 11) {
            uvColor = "red";
        }
        else {
            uvColor = "purple";
        }
        $('#currentUV').html("UV Index: <span>" + uv + "</span>");
        $('#currentUV span').css({ "background-color": uvColor, "color": uvText, "border-radius": "5px" }).addClass("px-2");
    });
}

//Function to send a request to OpenWeather API for the 5 day forecast for the searched city. Requires some fun math to make sure that you only get 1 result per day.

function fiveDayForecast() {
    var queryUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=imperial&APPID=9f127df86a905480471060870ba864e6";
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#fiveDay").text("5 Day Forecast:");
        for (var i = 1; i < 6; i++) {

            //This "j" variable helps us to get the forcast for around the current time for each subsequent day

            var j = (i * 8) - 2;
            var newDate = $("<p>").text(moment().add(i, "days").format('l'));
            var newTemp = $("<p>").text("Temp: " + response.list[j].main.temp.toFixed(1));
            var newHumidity = $("<p>").text("Humidity: " + response.list[j].main.humidity + "%");
            $("#day" + i).empty();
            $("#day" + i).append(newDate, newTemp, newHumidity);
        }
    });
}
//Clears the searched cities list.

$("#clearButton").on("click", function () {
    localStorage.clear();
    $("#savedCity").empty();
    cityArray = [];
});

//Makes the previously searched cities push their API data to the display, when they are clicked.
$(document).on("click", ".citySection", function (event) {
    city = $(this).text();
    $(this).remove();
    queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=9f127df86a905480471060870ba864e6";
    apiCall(queryUrl);
});