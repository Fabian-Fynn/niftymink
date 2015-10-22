var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var http = require('http').Server(app);
var path = require('path');
var fs = require('fs');
var io = require('socket.io')(http, {path: '/public/socket.io'})
var _ = require('underscore');
var config = require('./config/config');
var mongoose = require('mongoose');
var chalk = require('chalk');

// Bootstrap db connection
if ('development' === app.get('env')) {
  mongoose.connect(config.dev_db);
}
else {
  console.log("Production");
}

//load all files in models dir
fs.readdirSync(__dirname + '/app/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/app//models/' + filename)
});

var Image = require('./app/controllers/image.server.controller.js');

//express
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//  app.use(favicon(__dirname + '/public/modules/core/img/favicon.ico'));
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('X-HTTP-Method-Override'))
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/users', function(req, res) {
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  });
});

//socket functions
io.on('connection', function(socket) {
  console.log(chalk.black.bgMagenta(' ♥ User connected ♥ '));

  socket.on('search-request', function(req){
    console.log(chalk.black.bgWhite(' Searching for images '));
    Image.search(req, function(res) {
      if(res.images) {
        socket.emit('newImages', res.images);
      } else if(res.error) {
        if(res.error === 'No Results') {
          socket.emit('search-no-results');
        }
      }
    });
  });
});

http.listen(4000, function(){
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:4000');
});
