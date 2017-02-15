const express = require('express');

const app = express();
const logger = require('@mysolomon/solomon-core-logger').init({
  logLevel: process.env.LOG_LEVEL || 7,
  colorize: !['production', 'staging'].includes(process.env.NODE_ENV),
});

// ====================================================================
// CORS
// ====================================================================
const { cors } = require('@mysolomon/solomon-core-cors');

app.use((req, res, next) => {
  cors(['http://localhost:4000'])(req, res, next);
});


// ====================================================================
// Mongo
// ====================================================================

const mongo = require('@mysolomon/solomon-core-mongo');

app.use((req, res, next) => {
  // const connString = req.config.client.database.connString;
  const connString = 'mongodb://localhost:27017/hebe_node_api_copy?authMechanism=SCRAM-SHA-1';
  req.conn = mongo.getConnection({ connString, logger });
  next();
});

// ====================================================================
// Routes
// ====================================================================
require('./app/router')(app);

let server;
const port = process.env.PORT || 3000;

module.exports.openServer = () => {
  server = app.listen(port, () => {
    logger.debug(`test API server is started on port ${port}`);
  });
};
module.exports.closeServer = () => {
  server.close();
};
