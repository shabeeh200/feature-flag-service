
// /middleware/cache.js
const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on("error", (err) => console.error("Redis Client Error", err));
(async () => { await client.connect(); })();

const normalizeKey = (key) => key.replace(/\/+$/, "") || "/";
const ttlSeconds = parseInt(process.env.CACHE_TTL, 10) || 60;

module.exports = {
  async get(key) {
    return await client.get(normalizeKey(key));
  },

  async set(key, value, ttl = ttlSeconds) {
    const str = JSON.stringify(value);
    await client.set(normalizeKey(key), str, { EX: ttl });
  },

  async del(key) {
    await client.del(normalizeKey(key));
  },

  normalizeKey,
  ttlSeconds,

  invalidate(path) {
    const k = normalizeKey(path);
    client.del(k).catch(err => console.error("[CACHE INVALIDATE ERROR]", err));
    console.log(`[CACHE INVALIDATE] ${k}`);
  }
};
