$.get('/status', function(user) {
  console.log("Got some data from the server");
  console.log(user);
  var goals = user.goals;
  if (goals.indexOf('avoidfees') !== -1) {
    if (!$("#atm-skill").hasClass('active') && !user.gotATMFee) {
      $("#atm-skill").addClass('active');
    }
    else if ($("#atm-skill").hasClass('active') && user.gotATMFee) {
      $(".health-bar-value").css({"width": "30%"});
      $("#atm-skill").removeClass('active');
    }
  }

  if (goals.indexOf('eatathome') !== -1) {
    if (!$("#eat-out").hasClass('active') && !user.ateOut) {
      $("#eat-out").addClass('active');
    }
    else if ($("#eat-out").hasClass('active') && user.ateOut) {
      $(".health-bar-value").css({"width": "30%"});
      $("#eat-out").removeClass('active');
    }

  }
  if (goals.indexOf('alcatgrocery') !== -1) {
    if (!$("#liquor").hasClass('active') && !user.wentToBar) {
      $("#liquor").addClass('active');
    }
    else if ($("#liquor").hasClass('active') && user.wentToBar) {
      $("#liquor").removeClass('active');
    }

  }
  if (goals.indexOf('paybillsontime') !== -1) {
    if (!$("#bills-skill").hasClass('active') && !user.lateOnBill) {
      $("#bills-skill").addClass('active');
    }
    else if ($("#bills-skill").hasClass('active') && user.lateOnBill) {
      $(".health-bar-value").css({"width": "30%"});
      $("#bills-skill").removeClass('active');
    }

  }
  if (goals.indexOf('spendsave') !== -1) {
    if (!$("#savings").hasClass('active') && !user.belowQuota) {
      $("#savings").addClass('active');
    }
    else if ($("#savings").hasClass('active') && user.belowQuota) {
      $(".health-bar-value").css({"width": "30%"});
      $("#savings").removeClass('active');
    }

  }

  // if (user.gotATMFee) {
  //   if($("#atm-skill").hasClass('active'))
  // }
});


$(document).ready(function () {
    "use strict";
    $(".skills").on("click", function (e) {
        if ($(this).hasClass('active')) {
            $(".health-bar-value").css({"width": "30%"});
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            $(".health-bar-value").css({"width": "70%"});
        }
    });
});

$(document).ready(function () {
    "use strict";
    $(".rewards").on("click", function (e) {
        if ($(this).hasClass('active')) {
            $(".xp-bar-value").css({"width": "50%"});
            $(this).removeClass('active');
        } else {
            $(this).addClass('active');
            $(".xp-bar-value").css({"width": "90%"});
        }
    });
});
