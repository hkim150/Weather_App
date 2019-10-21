function getUVIndex() {
    var lat = $('#lat').val();
    var lng = $('#lng').val();
    var alt = $('#alt').val();
    var ozone = $('#ozone').val();
    var dt = $('#dt').val();

    $.ajax({
        type: 'GET',
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader('x-access-token', 'dec850ebc943b296d13b090ef40c4a81');
        },
        url: 'https://api.openuv.io/api/v1/uv?lat=' + lat + '&lng=' + lng + '&alt=' + alt + '&ozone=' + ozone + '&dt=' + dt,
        success: function (response) {
            //handle successful response
        },
        error: function (response) {
            // handle error response
        }
    });
}

function getWeather() {
    var lat = $('#lat').val();
    var lng = $('#lng').val();
    var alt = $('#alt').val();
    var ozone = $('#ozone').val();
    var dt = $('#dt').val();

    $.ajax({
        type: 'GET',
        dataType: 'json',
        beforeSend: function (request) {
            request.setRequestHeader('x-access-token', 'dec850ebc943b296d13b090ef40c4a81');
        },
        url: 'https://api.openweathermap.org/data/2.5/weather?q=' + city,
        success: function (response) {
            //handle successful response
        },
        error: function (response) {
            // handle error response
        }
    });
}

$("body").html(getUVIndex());