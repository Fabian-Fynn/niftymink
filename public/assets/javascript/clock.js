function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = (m < 10 ? '0' + m : m);

    $('.clock h1').text( h + ":" + m );
    $('.day-time').text(getDayTime(h));

    var t = setTimeout(startTime, 500);
}
function checkTime(m) {
    if (m < 10) {m = "0" + m};
    return m;
}

function getDayTime(h) {
  var dayTime;

  if(h >= 4 && h < 12) {
    dayTime = 'morning';
  } else if (h > 11 && h < 18) {
    dayTime = 'afternoon';
  } else {
    dayTime = 'evening';
  }

  return dayTime;
}
