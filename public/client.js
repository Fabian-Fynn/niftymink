/* 
 *   @Author:
 *     Fabin Hoffmann
 *     */
var socket = io.connect('http://localhost', {path: "/public/socket.io"});
$(document).ready(function (){
    socket.on('connected', function(res){
          console.log('User connected. ' + res);
            });
              socket.on('disconnect', function(res){
                    loggedIn = false;
                        changeOutputText("Conncection lost!","danger");
                            logout();
                              });
});

