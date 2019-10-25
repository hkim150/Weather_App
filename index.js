$(document).ready(function () {
    // navigation click actions 
    $('.scroll-link').on('click', function (event) {
        $this = $(this);
        event.preventDefault();
        const search_by = $this.attr("name");

        if (search_by == "loc") {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (pos) {
                    const lat = pos.coords.latitude;
                    const lng = pos.coords.longitude;
                    getWeatherByCoord(lat, lng);
                });
            } else {
                alert("Geolocation is not supported by this browser.");
            }
        } else if (search_by == "city") {
            const city = $(".city-input").val();
            getWeatherByCity(city);
        }
    });
});
// scroll function
function scrollToID(id, speed) {
    const offSet = 50;
    const targetOffset = $(id).offset().top - offSet;
    $('html,body').animate({ scrollTop: targetOffset }, speed);
}

function getWeatherByCity(city) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + "&units=metric" + "&APPID=b2fb248f15c3e18230610ce1ae087f87";
    getWeather(url);
}

function getWeatherByCoord(lat, lng) {
    const url = 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + "&lon=" + lng + "&units=metric" + "&APPID=b2fb248f15c3e18230610ce1ae087f87";
    getWeather(url);
}

function getWeather(url_arg) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        url: url_arg,
        success: function (res) {
            console.log(res);
            const lat = res.coord.lat;
            const lng = res.coord.lon;
            getUVIndex(lat, lng);

            const tmp_c = res.main.temp;
            const tmp_min_c = res.main.temp_min;
            const tmp_max_c = res.main.temp_max;
            const tmp_f = c2F(tmp_c);
            const tmp_min_f = c2F(tmp_min_c);
            const tmp_max_f = c2F(tmp_max_c);

            const humidity = res.main.humidity;
            const cloud = res.clouds.all;
            let weather = res.weather[0].description;
            let words = weather.split(" ");
            weather = ""
            for (const lower of words) {
                if (weather == "") {
                    weather = lower.replace(/^\w/, c => c.toUpperCase());
                } else {
                    weather += " " + lower.replace(/^\w/, c => c.toUpperCase());
                }
            }

            $(".weather").html(weather);
            $(".humidity").html(humidity + " %");
            $(".humidity-detail").html("Cloud: " + cloud + " %");
            $(".temperature").html(rnd(tmp_c) + " C (" + rnd(tmp_f) + " F)");
            $(".temperature-detail").html("Min Temp: " + rnd(tmp_min_c) + " C (" + rnd(tmp_min_f) + " F)<br>Max Temp: " + rnd(tmp_max_c) + " C (" + rnd(tmp_max_f) + " F)");
        },
        error: function (response) {
            alert("Failed to get the weather data.");
        }
    });
}

function getUVIndex(lat, lng) {
    $.ajax({
        type: 'GET',
        dataType: 'json',
        beforeSend: function (req) {
            req.setRequestHeader('x-access-token', 'dec850ebc943b296d13b090ef40c4a81');
        },
        url: 'https://api.openuv.io/api/v1/uv?lat=' + lat + '&lng=' + lng,
        success: function (res) {
            console.log(res);
            const uv = rnd(res.result.uv);
            const uv_max = rnd(res.result.uv_max);

            let sunrise = parseTime(res.result.sun_info.sun_times.sunrise);
            let sunset = parseTime(res.result.sun_info.sun_times.sunset);

            $(".uv-index").html(uv);
            $(".uv-index-detail").html("Max UV Index: " + uv_max);
            $(".weather-detail").html("Sunrise: " + sunrise + "<br>Sunset: " + sunset);
            scrollToID("#weather-info", 750);
        },
        error: function (response) {
            alert("Failed to get the UV data.")
        }
    });
}

function c2F(cel) {
    return cel * 9 / 5 + 32;
}

function rnd(num) {
    return Math.round(num * 100) / 100;
}

function parseTime(time) {
    let output = time.split("T");
    output = output[1].split(":", 2);
    let hr = parseInt(output[0]);
    let min = parseInt(output[1]);
    let AMPM = " AM";

    if (hr >= 12) {
        hr -= 12;
        AMPM = " PM";
    }

    return hr.toString() + ":" + min.toString() + AMPM + " (UTC)";
}