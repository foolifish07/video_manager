#!/usr/bin/env node

/**
 * Module dependencies.
 */

var app = require('../app');
var debug = require('debug')('video_manager:server');
var http = require('http');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);


//var server = http.Server(app);
var server = http.createServer(app);

// socketio

var io = require('socket.io')(server);

var session = require('../session');
io.use(function(socket, next){
  session(socket.request, socket.request.res, next);
});
var messages = [];
io.on('connection', function(socket){
  console.log(socket.request.sessionID + ' connected');
  io.emit('chat-init', messages);

  var events = {
    login_required: 'login_required',
    chat: 'chat',
  }
  
  // session 
  var user = null;
  if ( socket.request.session ) user = socket.request.session.user;
  if ( user ){
    io.emit('email', user.email);
  }

  socket.on('disconnect', function(){
    console.log(socket.request.sessionID + ' disconnected');    
  });

  socket.on(events.chat, function(msg){

    if ( user ) {
      var tmp = {
        email: user.email,
        name: user.name, 
        content: msg,
      }
      send_msg(tmp);

      messages.push(tmp);
      if ( messages.length>10 ){
        messages.shift();
      }
    }
    else {
      login_required();
    }
  });

  var login_required = function(){
    io.emit( events.login_required, '');
  }
  var send_msg = function(data){
    io.emit( events.chat, data);
  }
});


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
