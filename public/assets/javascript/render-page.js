function renderpage(request) {
  $('.partial').hide();

  if(!request || request === 'index') {
    $('.index').show();
  } else {
    var source;

    var selector = '#' + request + 'Source';
    source = $(selector).html();

    if(typeof source === 'undefined') {
      renderpage('index');
      return
    }

    var template = Handlebars.compile(source);
    var html = template();

    $('#yield').html(html);
    loadScripts(request);
  }
}

function loadScripts(partial) {
  $('.search-box input').keypress(function(e) {
    if(e.which == 13) {
      socket.emit('search-request', $(this).val());
      renderLoader(true);
    }
  });
}
