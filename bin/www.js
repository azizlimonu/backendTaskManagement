#!/usr/bin/env node

// Import required modules
const app = require('../app'); // The main Express.js application
const debug = require('debug')('server:server'); // Debug logging module
const http = require('http'); // Node.js built-in HTTP module
const dotenv = require('dotenv'); // Module for loading environment variables
const mongoose = require('mongoose'); // MongoDB ORM library

// Load environment variables from the ".env" file
dotenv.config();

// Normalize the port value from environment variable or default to 3000
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port); // Set the port in the Express application

// Create an HTTP server using the Express application as the request handler
const server = http.createServer(app);

// Connect to MongoDB using the connection URL from the environment variable
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    // If the MongoDB connection is successful, start the HTTP server
    server.listen(port);
    server.on('error', onError); // Event listener for server errors
    server.on('listening', onListening); // Event listener for server listening
    console.log(`MongoDB connected: ${process.env.MONGODB_URL}`);
  })
  .catch(err => {
    // If there's an error connecting to MongoDB, log the error and exit the process
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe (e.g., Unix domain socket)
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

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // Handle specific listen errors with friendly messages
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
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
