function renderPage(request, resource, flashMessage) {
  $('#yield').hide();
  $('.index').hide();
  if(!request || request === 'index') {
    $('.index').show();
    $('#homeButton').hide();
    $('body').addClass('home');
  } else {
    $('#homeButton').show();
    $('body').removeClass('home');
    $('#yield').show();
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
  }
    loadScripts(request);

    if(flashMessage) {
      renderMessage(flashMessage);
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

          $('#no-results span').hide();
          renderLoader(true);
        }
      });

      break;
    case 'imageGrid':
      $('.preview').click(
        function(e) {
          var imageurl = $(this).attr('data-imageurl');
          $('html').css('background-image', 'url(' + imageurl + ')');
          localStorage.setItem('current-background', imageurl);
      });

      $('#searchButton').attr('data-target', 'imageSearch');
      break;
    case 'index':
      $('#searchButton').attr('data-target', 'imageSearch');

      setTimeout(function() {
        $('.tooltips span').removeClass('invisible');
      }, 3000);

      break;
    case 'login':
      break;
    case 'settings':
      break;
    default:
  }
}

function renderMessage(reason) {
  switch(reason) {
    case 'invalidLogin':
      $('#flash div').text('Email or password incorrect');
      setTimeout(function() {
        $('#flash').slideDown();
      }, 1000);

    break;
  }
}
