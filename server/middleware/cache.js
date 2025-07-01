// middleware/cache.js
require('dotenv').config();
const NodeCache = require('node-cache');
const ttl = parseInt(process.env.CACHE_TTL, 10) || 60;
const cache = new NodeCache({ stdTTL: ttl });
module.exports = cache;
