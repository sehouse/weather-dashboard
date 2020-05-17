// Definition of Global Variables

var city;
var queryUrl;
var latitude;
var longitude;

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
            $("#city").text(response.name);
            $("#date").text(" (" + moment().format('l') + ")");
            $("#currentWeatherType").text("'" + response.weather[0].description + "'");
            var temp = response.main.temp.toFixed(1);
            $("#currentTemp").html("Temperature: " + temp);
            $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
            $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + "MPH");
            latitude = response.coord.lat;
            longitude = response.coord.lon;
            uvIndex();
        }

    })
}

//Function to send a request to OpenWeather API for the UV Index values for the searched city, as it uses a different API call to get that data.

function uvIndex() {
    var queryUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + latitude + "&lon=" + longitude + "&units=imperial&APPID=bfc1b977d5f0ad912b3dc6c21e34e887";
    $.ajax({
        url: queryUrl,
        method: "GET"
    }).then(function (response) {
        var uv = response.value;
        uvText = "white";
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