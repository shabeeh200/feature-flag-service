const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Console logger
const consoleLogger = morgan('dev');

// File logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../access.log'),
  { flags: 'a' }
);
const fileLogger = morgan('combined', { stream: accessLogStream });

module.exports = { consoleLogger, fileLogger };
