/*global $, jQuery*/
//$(document).ready(function () {
//    "use strict";
//    $("button").on("click", function (e) {
//        if ($(this).hasClass('active')) {
//            $(this).removeClass('active');
//            $("#health-bar").css({"width": "20%", "color": "red"});
//        } else {
//            $(this).addClass('active');
//            $("#health-bar").css({"width": "70%", "color": "green"});
//        }
//    });
//});


$(document).ready(function () {
    "use strict";
    $("button").on("click", function (e) {
        if ($(this).hasClass('active')) {
            $(".health-bar-value").css({"width": "50%"});
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            $(".health-bar-value").css({"width": "100%"});
        }
    });
});
