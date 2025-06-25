// middleware/apiKeyAuth.js
const dotenv = require('dotenv');
dotenv.config();

const apiKeyAuth = (req, res, next) => {
  const clientKey = req.headers['x-api-key']; // Header sent by client

  if (!clientKey) {
    return res.status(401).json({ error: 'API key missing' });
  }

  if (clientKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next(); // move to the actual controller if key is valid
};

module.exports = apiKeyAuth;
