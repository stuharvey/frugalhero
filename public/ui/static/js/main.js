/*global $, jQuery*/
$(document).ready(function () {
    "use strict";
    $("button").on("click", function (e) {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $("#health-bar").css({"width": "20%"});
        } else {
            $(this).addClass('active');
            $("#health-bar").css({"width": "70%"});
        }
    });
});


