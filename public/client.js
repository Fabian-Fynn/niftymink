var socket = io.connect('http://localhost', {path: "/public/socket.io"});

$(document).ready(function (){
  socket.on('connected', function(res){
    console.log('User connected. ' + res);
  });

  socket.on('disconnect', function(res){
    loggedIn = false;
    changeOutputText("Conncection lost!","danger");
    logout();
  });

  socket.on('newBackground', function(res){
    console.log('newBackground', res);
    $('body').css('background-image', 'url(' + res + ')');
  });

  socket.on('search-no-results', function() {
    $('body').css('background-image', 'none');
  });

  $('#js-search-box').keypress(function(e) {
    if(e.which == 13) {
      socket.emit('search-request', $(this).val());
    }
  });
});
