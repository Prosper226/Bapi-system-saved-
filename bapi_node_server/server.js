const http = require('http')
const fs = require('fs')

require('dotenv').config()

// applications
const pmuflash = require('./services/bapi')

services = [
  {app : pmuflash,  port : process.env.PORT_MAIN},  
]

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    } 
    return false;
};

services.forEach((service) => {
  var port = normalizePort(service.port)
  var app = service.app
  app.set('port', port)
  var server = http.createServer(app);
  server.on('error', errorHandler);
  server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
    console.log('Listening on ' + bind);
  });
  var io = require('socket.io')(server, {cors : {origin: '*'}})


  /**
   * SOCKETS
   */
  io.on('connection', function(socket){
    
  })

  server.listen(port);

});


