// middleware/cacheMiddleware.js
const cache = require('./cache');

module.exports = (req, res, next) => {
  const key = req.originalUrl;  // e.g. "/flags" or "/flags/my-feature"
  const cached = cache.get(key);

  if (cached) {
    console.log(`[CACHE HIT] ${key}`);
    return res.status(200).json(cached);
  }
  console.log(`[CACHE MISS] ${key}`);

  // Monkey-patch res.json so we cache its payload
  const _json = res.json.bind(res);
  res.json = (body) => {
    console.log(`[CACHE SET] ${key}`);
    cache.set(key, body);
    return _json(body);
  };

  next();
};
