function renderPage(request, resource) {
  $('.partial').hide();

  if(!request || request === 'index') {
    $('.index').show();
  } else {
    var source;

    var selector = '#' + request + 'Source';
    source = $(selector).html();

    if(typeof source === 'undefined') {
      renderPage('index');
      return
    }

    var context;

    if(request === 'imageGrid') {
      context = {
        images: resource
      }
    }
    var template = Handlebars.compile(source);
    var html = template(context);

    $('#yield').html(html);
    loadScripts(request);
  }
}

function loadScripts(partial) {
  switch(partial) {
    case 'imageSearch':
      $('.search-box input').focus();

      $('.search-box input').keypress(function(e) {
        if(e.which == 13) {
          var req = {
            query: $(this).val(),
            page: 0
          }

          socket.emit('search-request', req);
          renderLoader(true);
        }
      });

      break;
    case 'imageGrid':
      $('#newImageSearch').click(
        function() {
          renderPage('imageSearch');
        });
      break;
    default:
  }
}
