
// const cache = require('./cache');

// module.exports = (req, res, next) => {
//   if (process.env.NODE_ENV !== 'production') {
//     return next();
//   }

//   // 1️⃣ Only cache GET requests
//   if (req.method !== 'GET') {
//     return next();
//   }

//   // 2️⃣ Normalize cache key (remove trailing slash)
//   let key = req.originalUrl.replace(/\/+$/, '') || '/';

//   // 3️⃣ Check if in cache
//   const cached = cache.get(key);
//   if (cached) {
//     console.log(`[CACHE HIT] ${key}`);
//     return res.status(200).json(cached);
//   }

//   console.log(`[CACHE MISS] ${key}`);

//   // 4️⃣ Override res.json to cache response
//   const _json = res.json.bind(res);
//   res.json = (body) => {
//     cache.set(key, body);
//     console.log(`[CACHE SET] ${key}`);
//     return _json(body);
//   };

//   next();
// };
// middleware/cache.js
// middleware/cacheMiddleware.js
// middleware/cacheMiddleware.js
// middleware/cacheMiddleware.js

/**
 * HTTP‑layer cache middleware for GET requests.
 * - On cache hit: returns cached JSON and skips controller.
 * - On cache miss: intercepts res.json to write response back to Redis.
 */

const cache = require("./cache");
const normalizeKey = cache.normalizeKey;
const ttlSeconds = cache.ttlSeconds;

module.exports = async (req, res, next) => {
  // Only cache GET requests
  if (req.method !== "GET") {
    return next();
  }

  try {
    const key = normalizeKey(req.originalUrl);

    // 1) Try Redis
    const cached = await cache.get(key);
    if (cached) {
      // Send cached response
      return res.json(JSON.parse(cached));
    }

    // 2) On miss, wrap res.json to cache response payload
    const originalJson = res.json.bind(res);
    res.json = async (payload) => {
      try {
        await cache.set(key, payload, ttlSeconds);
      } catch (err) {
        console.error("[CACHE SET ERROR]", err);
      }
      originalJson(payload);
    };

    next();
  } catch (err) {
    console.error("[CACHE MIDDLEWARE ERROR]", err);
    next();
  }
};
