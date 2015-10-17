if (document.location.hostname == "localhost")
  var socket = io.connect('localhost', {path: "/public/socket.io"});
else
  var socket = io.connect('http://niftymink.com', {path: "/public/socket.io"});

$(document).ready(function (){
  socket.on('connected', function(res){
  });

  socket.on('disconnect', function(res){
    loggedIn = false;
    changeOutputText("Conncection lost!","danger");
    logout();
  });

  socket.on('newBackground', function(res){
    $('body').css('background-image', 'url(' + res + ')');
  });

  socket.on('search-no-results', function() {
    $('body').css('background-image', 'none');
  });

  $('.search-box input').keypress(function(e) {
    if(e.which == 13) {
      socket.emit('search-request', $(this).val());
    }
  });
});
