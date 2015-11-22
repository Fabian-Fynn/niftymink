var socket = io.connect(document.location.hostname, {path: "/public/socket.io"});

$(document).ready(function(){
  if(document.location.hostname === 'staging.niftymink.com') {
    document.title = 'Mink|STAGING';
  } else if(document.location.hostname === 'localhost') {
    document.title = 'Mink|DEVELOPMENT';
    window.onerror = function (errorMsg, url, lineNumber) {
      if(errorMsg === 'Uncaught ReferenceError: changeOutputText is not defined') {
        window.setTimeout(window.location.reload(), 2000);
      }
      $('.footer').append('<p>Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber + '</p>');
    }
  }

  if (localStorage.getItem('current-background')) {
    $('html').css('background-image', 'url(' + localStorage.getItem('current-background') + ')');
  }

  startTime();
  renderUsername();
  setColorScheme(localStorage.getItem('scheme'));

  var params = $.getQueryParameters();

  if(params.page) {
    renderPage(params.page);
  }

  socket.on('connected', function(res){
  });

  socket.on('disconnect', function(res){
    loggedIn = false;
    changeOutputText("Conncection lost!","danger");
    logout();
  });

  socket.on('newImages', function(res){
    renderPage('imageGrid', res);
    renderLoader(false);
  });

  socket.on('search-no-results', function() {
    renderLoader(false);
    $('#no-results span').show();
  });

  $('#searchButton').click(function(e) {
    if($(this).attr('data-target') === 'imageSearch') {
      $(this).attr('data-target', 'home');
      renderPage('imageSearch');
    } else {
      $(this).attr('data-target', 'imageSearch');
      renderPage('index');
    }
  });

  $('#homeButton').click(function(e) {
    renderPage('index');
  });

  $('#schemeSwitch').click(function() {
    setColorScheme();
  });

  $(document).keyup(function(e) {
   /* if($('body').hasClass('home') &&
       (e.which === 102 || e.which === 70)) { // on index & 'f' or 'F' -> search
      renderPage('imageSearch');
    } else*/ if(e.which === 27) {
      renderPage('index');
    }
  });

  $('#user-button').click(function(e) {
    if($(this).attr('data-target') === 'settings') {
      renderPage('settings');
    } else {
      renderPage('login');
    }
  });

  //renderPage('index');
});

function renderLoader(show) {
  var cubeSource = '<div class="cube">    <div class="ani1">\
      <div class="front"><i></i><i></i><i></i></div>\
      <div class="left"><i></i><i></i><i></i></div>\
    </div>\
    <div class="ani2">\
      <div class="front"><i></i><i></i><i></i></div>\
      <div class="bottom"><i></i><i></i><i></i></div>\
    </div>\
    <div class="ani3">\
      <div class="front"><i></i><i></i><i></i></div>\
      <div class="right"><i></i><i></i><i></i></div>\
    </div>\
    <div class="ani4">\
      <div class="front"><i></i><i></i><i></i></div>\
      <div class="top"><i></i><i></i><i></i></div>\
    </div>\
    <div class="shadow"></div>\
  </div>';

  var template = Handlebars.compile(cubeSource);
  var html = template();

  if (show) {
    $('#loader').html(html);
  } else {
    $('#loader').html('');
  }
}

function setColorScheme(scheme) {
  if (!scheme) {
    if (localStorage.getItem('scheme') === 'light') {
      scheme = 'dark';
    } else {
      scheme = 'light';
    }
  }

  localStorage.setItem('scheme', scheme);
  if(scheme === 'dark'){
    $('.colorized').addClass('dark');
    $('#schemeSwitch').css("transform","rotate(180deg)");
  } else {
    $('.colorized').removeClass('dark');
    $('#schemeSwitch').css("transform","" );
  }
}

