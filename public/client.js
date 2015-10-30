if (document.location.hostname == "localhost")
  var socket = io.connect('localhost', {path: "/public/socket.io"});
else
  var socket = io.connect('http://niftymink.com', {path: "/public/socket.io"});

$(document).ready(function(){
  if (localStorage.getItem('current-background')) {
    $('html').css('background-image', 'url(' + localStorage.getItem('current-background') + ')');
  }

  startTime();
  renderUsername();
  setColorScheme(localStorage.getItem('scheme'));

  $('.login-button').click(function(){
    var form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', '/login');
    form.style.display = 'hidden';
    document.body.appendChild(form)
    form.submit();
  });

  socket.on('connected', function(res){
  });

  socket.on('disconnect', function(res){
    loggedIn = false;
    changeOutputText("Conncection lost!","danger");
    logout();
  });

  socket.on('setTitle', function(res) {
    document.title = 'Mink|' + res;
  });

  socket.on('newImages', function(res){
    renderPage('imageGrid', res);
    renderLoader(false);
  });

  socket.on('search-no-results', function() {
    renderLoader(false);
    $('#no-results span').show();
  });

  $('#name-field').on('keypress', function(e) {
    if(e.which == 13) {
      setUsername($(this));
      $(this).removeClass('editing');
      $(this).blur();
      e.preventDefault();
    }
  });

  $('#name-field').on('change', function(e) {
    setUsername($(this));
  });

  $('#name-field').on('focusin', function(e) {
    $(this).addClass('editing');
    if($(this).hasClass('no-name')) {
    }
  });

  $('#name-field').click(function(e) {
    $(this).addClass('editing');
    $(this).focus();
  });

  $('#name-field').on('focusout blur', function(e) {
    $(this).removeClass('editing');
  });

  $('#searchButton').click(function(e) {
    if($(this).attr('data-target') === 'home') {
      $(this).attr('data-target', 'imageSearch');
      renderPage('imageSearch');
    } else {
      $(this).attr('data-target', 'home');
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

  $('#login-button').click(function(e) {
    renderPage('login');
  });

  renderPage('index');
});

function setUsername($element) {
  var name = $element.html().replace(/&nbsp;|[-$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|[0-9]/g,'').trim();

  if(name != '')
    localStorage.setItem('user-name', name);
  $element.html(localStorage.getItem('user-name'));
}

function renderUsername() {
  var context = {
    username: "Enter name"
  };

  var usernameSource = '<span id="name-field" contenteditable="true">{{username}}</span>';

  if (localStorage.getItem('user-name')) {
    context.username = localStorage.getItem('user-name');
  } else {
    context.username = 'Enter name';
  }

  var template = Handlebars.compile(usernameSource);
  var html = template(context);
  $('#username').html(html);
}

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
