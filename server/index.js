const express = require('express');
const morgan = require('morgan');
//const { consoleLogger, fileLogger } = require('./middleware/logger');

const app = express();

// 1. Logging middleware (logs method, URL, status, response time)
app.use(morgan('dev'));
//app.use(consoleLogger);
app.use(fileLogger);

// 2. JSON parser
app.use(express.json());

// Your routes…
app.get('/flags', (req, res) => {
  res.json([]);
});

// Start server
app.listen(4000, () => console.log('API listening on port 4000'));
