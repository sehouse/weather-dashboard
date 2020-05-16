// Definition of Global Variables

var city;
var queryUrl;

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
            city = response.name;
            $("#city").text(response.name);
            $("#date").text(" (" + moment().format('l') + ")");
            $("#currentWeatherType").text("'" + response.weather[0].description + "'");
            var temp = response.main.temp.toFixed(1);
            $("#currentTemp").html("Temperature: " + temp);
            $("#currentHumidity").text("Humidity: " + response.main.humidity + "%");
            $("#currentWindSpeed").text("Wind Speed: " + response.wind.speed + "MPH");
        }

    })
}