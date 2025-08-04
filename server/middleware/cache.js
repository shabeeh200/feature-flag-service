const { createClient } = require("redis");
const client = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379"
});
client.on("error", (err) => console.error("Redis Client Error", err));
(async () => { await client.connect(); })();

const normalizeKey = (key) => key.replace(/\/+$/, "") || "/";
const ttlSeconds  = parseInt(process.env.CACHE_TTL, 10) || 60;

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

async function invalidate(path) {
  const prefix = normalizeKey(path);
  try {
    const keys = await client.keys(`${prefix}*`);
    if (keys.length) {
      await Promise.all(keys.map(k => client.del(k)));
      console.log(`[CACHE INVALIDATE] removed ${keys.length} entries for prefix ${prefix}`);
    }
  } catch (err) {
    console.error("[CACHE INVALIDATE ERROR]", err);
  }
}

module.exports = {
  get,
  set,
  del,
  invalidate,
  normalizeKey,
  ttlSeconds
};
