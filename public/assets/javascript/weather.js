$(document).ready(function() {
  $.simpleWeather({
    woeid: '2357536', //2357536
    location: 'stockholm',
    unit: 'c',
    success: function(weather) {
      if(weather.temp > 20) {
        $('body').animate({backgroundColor: '#F7AC57'}, 1500);
      } else {
        $('body').animate({backgroundColor: '#0091c2'}, 1500);
      }
      html = '<h2>'+weather.temp+'&deg;</h2>';
      html += '<i class="icon-'+weather.code+'"></i>';
      html += '<p>'+weather.city+'</p>';
      //html += '<li class="currently">'+weather.currently+'</li></ul>';
      //html += '<li>'+weather.tempAlt+'&deg;C</li></ul>';

      //var timestamp = moment(weather.updated);
      //html += '<p class="updated">Updated '+moment(timestamp).fromNow()+'</p>';
      $("#weather").html(html);
    },
    error: function(error) {
      $("#weather").html('<p>'+error+'</p>');
    }
  });
});
