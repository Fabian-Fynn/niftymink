'use strict';

var socket = io.connect(document.location.hostname, {path: '/public/socket.io'});
function setFirstname($element) {
  var name = $element.html().replace(/&nbsp;|[-$%^&*()_+|~=`{}\[\]:";'<>?,.\/]|[0-9]/g,'').trim();

    if(name != ''){
    localStorage.setItem('user-name', name);

    $.ajax({
      url: '/changefirstname',
      data: { firstname: name },
      type: 'POST',
      success: function() {
      }
    });
  }
  $element.html(localStorage.getItem('user-name'));
}

function renderUsername() {
  var context = {
    username: "Enter name"
  };

  var usernameSource = '<span id="name-field" contenteditable="true">{{username}}</span>';

  $.ajax({
    url: '/getfirstname',
    type: 'GET',
    complete: function(req, res) {
      if(req.responseText) {
        context.username = req.responseText;
      } else if (localStorage.getItem('user-name')) {
        context.username = localStorage.getItem('user-name');
      } else {
        context.username = 'Enter name';
      }

      var template = Handlebars.compile(usernameSource);
      var html = template(context);
      $('#username').html(html);
    }
  });
}
