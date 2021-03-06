var express = require('express');
var app = express();
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var http = require('http').Server(app);
var fs = require('fs');
var path = require('path');
var io = require('socket.io')(http, {path: '/public/socket.io'})
var _ = require('underscore');
var mongoose = require('mongoose');
var chalk = require('chalk');
var passport = require('passport');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);

//configs
var config = require('./config/config');
var secrets = require('./config/secrets.js');
require('./config/passport')(passport, secrets);

// Bootstrap db connection
mongoose.connect(config.db);

//load all files in models dir
fs.readdirSync(__dirname + '/app/models').forEach(function(filename) {
  if (~filename.indexOf('.js')) require(__dirname + '/app/models/' + filename)
});

//app.use(morgan('combined'))
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 180 * 24 * 60 * 60
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
//app.use('view engine', 'ejs');

//routes
require('./app/routes.js')(app, passport);

app.use(express.static(path.join(__dirname, 'public')));

//Controllers
var Image = require('./app/controllers/image.server.controller.js');

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

http.listen(config.Port, function(){
  console.log('There we go ♕');
  console.log(config.env);
  console.log('Gladly listening on http://127.0.0.1:' + config.Port);
});
