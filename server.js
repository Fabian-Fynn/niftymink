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
var secrets = require('./config/secrets.js');
var mongoose = require('mongoose');
var chalk = require('chalk');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

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
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

app.get('/users', function(req, res) {
  mongoose.model('users').find(function(err, users) {
    res.send(users);
  });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){
});

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

//passport
passport.use(new FacebookStrategy({
    clientID: secrets.FACEBOOK_APP_ID,
    clientSecret: secrets.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:4000/auth/facebook/callback",
    enableProof: false
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      console.log(user);
      return done(err, user);
    });
  }
));

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
