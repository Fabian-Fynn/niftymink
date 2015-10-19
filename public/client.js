if (document.location.hostname == "localhost")
  var socket = io.connect('localhost', {path: "/public/socket.io"});
else
  var socket = io.connect('http://niftymink.com', {path: "/public/socket.io"});

$(document).ready(function(){
  if (localStorage.getItem('current-background')) {
    $('body').css('background-image', 'url(' + localStorage.getItem('current-background') + ')');
  }

  startTime();
  renderUsername();

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

  socket.on('newBackground', function(res){
    $('body').css('background-image', 'url(' + res + ')');
    localStorage.setItem('current-background', res);
  });

  socket.on('search-no-results', function() {
    $('body').css('background-image', 'none');
  });

  $('.search-box input').keypress(function(e) {
    if(e.which == 13) {
      socket.emit('search-request', $(this).val());
    }
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

  if (localStorage.getItem('user-name')) {
    context.username = localStorage.getItem('user-name');
    var usernameSource = '<span id="name-field" contenteditable="true">{{username}}</span>';

  } else {
    var usernameSource = '<span id="name-field" class="no-name" contenteditable="true">Enter name</span>';
  }

  var template = Handlebars.compile(usernameSource);
  var html = template(context);
  $('#username').html(html);
}
