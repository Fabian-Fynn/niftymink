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
