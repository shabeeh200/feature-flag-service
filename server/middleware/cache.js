const { createClient } = require("redis");

const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});

client.on("error", (err) => console.error("Redis Client Error", err));
(async () => { await client.connect(); })();

const normalizeKey = (key) => key.replace(/\/+$/, "") || "/";
const ttlSeconds = parseInt(process.env.CACHE_TTL, 10) || 60;

async function get(key) {
  return await client.get(normalizeKey(key));
}

async function set(key, value, ttl = ttlSeconds) {
  const str = JSON.stringify(value);
  await client.set(normalizeKey(key), str, { EX: ttl });
}

async function del(key) {
  await client.del(normalizeKey(key));
}

function invalidate(path) {
  const k = normalizeKey(path);
  client.del(k).catch(err => console.error("[CACHE INVALIDATE ERROR]", err));
  console.log(`[CACHE INVALIDATE] ${k}`);
}

module.exports = {
  get,
  set,
  del,
  normalizeKey,
  ttlSeconds,
  invalidate
};