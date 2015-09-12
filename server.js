/*
 @Author:
 Fabin Hoffmann
*/

var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http, {path: '/public/socket.io'})
var _ = require('underscore');

//express
app.use(express.static(__dirname + '/public'));
app.get('/', function(req, res){
  res.sendFile(__dirname + '/client.html');
});

//socket functions
io.on('connection', function(socket){
  console.log('user connected');
  console.log(socket);
});

http.listen(4000, function(){
  console.log('There we go ♕');
  console.log('Gladly listening on http://127.0.0.1:4000');
});
