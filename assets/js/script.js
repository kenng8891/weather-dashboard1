// current date
let $cityDate = moment().format("llll");
$("#currentdate").text($cityDate);

let $clicked = $(".buttonsearch");
$clicked.on("click", citysearch);
$clicked.on("click", searchSave);

function citysearch() {
  let cityname = $(this).parent().siblings("#cityenter").val().toLowerCase();

  function clear() {
    $("#cityenter").val("");
  }
  setTimeout(clear, 300);
  //Query for Current Weather Using API URL And Ajax
  let firstQueryURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityname +
    "&units=imperial&appid=b560802e22d3b5c9a667a84cd007a9bd";
  $.ajax({
    url: firstQueryURL,
    method: "GET",
  }).then(function (response) {
    console.log(response);
    // current city info
    let $currentTemp = parseInt(response.main.temp) + "°F";
    let $currentHum = response.main.humidity + "%";
    let $currentWind = parseInt(response.wind.speed) + "mph";
    let $currentIcon = response.weather[0].icon;
    let $currentIconURL =
      "http://openweathermap.org/img/w/" + $currentIcon + ".png";

    $("#namecity").text(cityname);
    $("#tempcity").text($currentTemp);
    $("#humcity").text($currentHum);
    $("#windspeed").text($currentWind);
    $("#weathericon").attr({
      src: $currentIconURL,
      alt: "Current Weather Icon",
    });
    // lat lon call
    let lat = response.coord.lat;
    let lon = response.coord.lon;
    // 5 day forcast call
    let secondQueryURL =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon +
      "&exclude=hourly&units=imperial&appid=b560802e22d3b5c9a667a84cd007a9bd";
    $.ajax({
      url: secondQueryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      let $uv = response.current.uvi;
      // var for displaying in html & grabbing the right color class
      let $uvIndex = $("#uv-index");
      $uvIndex.text($uv);
      $uvIndex.blur();

      if ($uv <= 2) {
        $uvIndex.addClass("btn-success");
        $uvIndex.removeClass(
          "btn-warning btn-hazard btn-danger btn-climate-change"
        );
      } else if ($uv <= 5) {
        $uvIndex.addClass("btn-warning");
        $uvIndex.removeClass(
          "btn-success btn-hazard btn-danger btn-climate-change"
        );
      } else if ($uv <= 7) {
        $uvIndex.addClass("btn-hazard");
        $uvIndex.removeClass(
          "btn-success btn-warning btn-danger btn-climate-change"
        );
      } else if ($uv <= 10.99) {
        $uvIndex.addClass("btn-danger");
        $uvIndex.removeClass(
          "btn-success btn-warning btn-hazard btn-climate-change"
        );
      }

      let days = [];
      for (i = 1; i < 6; i++) {
        days[i] = response.daily[i].dt;
      }
      days = days.filter((item) => item);
      for (i = 0; i < days.length; i++) {
        days[i] = moment.unix(days[i]);

        days[i] = days[i].format("ll");

        $("#day" + i).text(days[i]);
      }
      let highTemps = [];
      for (i = 1; i < 6; i++) {
        highTemps[i] = parseInt(response.daily[i].temp.max) + "°F";
      }
      highTemps = highTemps.filter((item) => item);
      // fill cards
      for (i = 0; i < highTemps.length; i++) {
        $("#highday" + i).text("High: " + highTemps[i]);
      }

      let lowTemps = [];
      for (i = 1; i < 6; i++) {
        lowTemps[i] = parseInt(response.daily[i].temp.min) + "°F";
      }
      lowTemps = lowTemps.filter((item) => item);
      for (i = 0; i < lowTemps.length; i++) {
        $("#lowday" + i).text("Low: " + lowTemps[i]);
      }

      let humid = [];
      for (i = 1; i < 6; i++) {
        humid[i] = response.daily[i].humidity + "%";
      }
      humid = humid.filter((item) => item);
      for (i = 0; i < humid.length; i++) {
        $("#humday" + i).text("Humidity: " + humid[i]);
      }
      let icons = [];
      let iconsURL = [];
      for (i = 1; i < 6; i++) {
        icons[i] = response.daily[i].weather[0].icon;
      }
      icons = icons.filter((item) => item);
      for (i = 0; i < icons.length; i++) {
        iconsURL[i] = "http://openweathermap.org/img/w/" + icons[i] + ".png";
      }
      for (i = 0; i < iconsURL.length; i++) {
        $("#icon" + i).attr({ src: iconsURL[i], alt: "Daily Weather Icon" });
      }
    });
  });
}

$(document).ready(function () {
  // if localStorage is not empty
  if (localStorage.getItem("cities")) {
    cityweather = localStorage.getItem("cities", JSON.stringify(cityweather));
    cityweather = JSON.parse(cityweather);
    for (i = 0; i <= cityweather.length - 1; i++) {
      $("#search" + i).text(cityweather[i]);
    }
    let lastIndex = cityweather.length - 1;
    $("#search" + lastIndex).on("click", savedsearch);
    $("#search" + lastIndex).trigger("click");
  }
});

let cityweather = [];
// local storage
function searchSave() {
  let newcity = $(this).parent().siblings("#cityenter").val().toLowerCase();
  console.log(newcity);
  cityweather.push(newcity);
  cityweather = [...new Set(cityweather)];
  localStorage.setItem("cities", JSON.stringify(cityweather));
  for (i = 0; i <= cityweather.length - 1; i++) {
    $("#search" + i).text(cityweather[i]);
    $("#search" + i).addClass("past");
  }
}

$("section").on("click", ".past", savedsearch);

function savedsearch() {
  // previous city
  let $oldCity = $(this).text();
  $("#cityenter").val($oldCity);
  $clicked.trigger("click");
}

// history clear
let $clear = $("#clearhistory");
$clear.on("click", function () {
  //clear local storage
  localStorage.clear();
  cityweather = [];
  for (i = 0; i < 11; i++) {
    $("#search" + i).text("");
  }
});
