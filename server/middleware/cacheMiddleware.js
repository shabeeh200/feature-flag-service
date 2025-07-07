
const cache = require('./cache');

module.exports = (req, res, next) => {
  if (process.env.NODE_ENV !== 'production') {
    return next();
  }

  // 1️⃣ Only cache GET requests
  if (req.method !== 'GET') {
    return next();
  }

  // 2️⃣ Normalize cache key (remove trailing slash)
  let key = req.originalUrl.replace(/\/+$/, '') || '/';

  // 3️⃣ Check if in cache
  const cached = cache.get(key);
  if (cached) {
    console.log(`[CACHE HIT] ${key}`);
    return res.status(200).json(cached);
  }

  console.log(`[CACHE MISS] ${key}`);

  // 4️⃣ Override res.json to cache response
  const _json = res.json.bind(res);
  res.json = (body) => {
    cache.set(key, body);
    console.log(`[CACHE SET] ${key}`);
    return _json(body);
  };

  next();
};
