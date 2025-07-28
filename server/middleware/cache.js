// middleware/cache.js

/**
 * Low‑level Redis cache utility.
 * Provides get, set, del, key normalization, TTL defaults, and invalidation helper.
 */

const { createClient } = require("redis");

// Connect to Redis using REDIS_URL or localhost
const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});
client.on("error", (err) => console.error("Redis Client Error", err));
(async () => { await client.connect(); })();

// Normalize keys (remove trailing slashes)
const normalizeKey = (key) => key.replace(/\/+$/, "") || "/";

// Default TTL (seconds)
const ttlSeconds = parseInt(process.env.CACHE_TTL, 10) || 60;

module.exports = {
  /** Fetches a cached JSON string by key */
  async get(key) {
    return await client.get(normalizeKey(key));
  },

  /** Caches a value (JSON‑stringified) under key with TTL */
  async set(key, value, ttl = ttlSeconds) {
    const str = JSON.stringify(value);
    await client.set(normalizeKey(key), str, { EX: ttl });
  },

  /** Deletes a cache entry */
  async del(key) {
    await client.del(normalizeKey(key));
  },

  // Helpers exposed for invalidation and external key normalization
  normalizeKey,
  ttlSeconds,

  /** Invalidate (delete) a cache entry by path */
  invalidate(path) {
    const k = normalizeKey(path);
    client.del(k).catch(err => console.error("[CACHE INVALIDATE ERROR]", err));
    console.log(`[CACHE INVALIDATE] ${k}`);
  }
};
