// import { createClient } from "redis";

// const redisClient = createClient({
//     url:process.env.REDIS_URL
// })

// redisClient.on("error",(err)=>{
//     console.error("Redis Error :",err);
// });

// (async()=>{
//   await redisClient.connect();
//   console.log("Redis Connected");
// })();

// export default redisClient;

import { createClient } from 'redis';

const redisEnabled = Boolean(process.env.REDIS_URL && process.env.REDIS_PASSWORD);
const REDIS_PORT = Number(process.env.REDIS_PORT || 19772);

// If Redis is not configured, export a disconnected client (cache becomes a no-op via guards).
const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: REDIS_PORT,
        connectTimeout: Number(process.env.REDIS_CONNECT_TIMEOUT_MS || 2000),
        reconnectStrategy: (retries) => {
          const maxRetries = Number(process.env.REDIS_MAX_RETRIES || 3);
          if (retries > maxRetries) return false; // stop retrying; app should continue without cache
          return Math.min(retries * 250, 1000);
        },
    },
    disableOfflineQueue: true,
});

let lastRedisErrorAt = 0;
redisClient.on('error', (err) => {
  // Avoid log spam on reconnect loops/timeouts
  const now = Date.now();
  if (now - lastRedisErrorAt > 10_000) {
    lastRedisErrorAt = now;
    console.log('Redis Client Error', err?.message || err);
  }
});

// Best-effort connect: app should keep running even if Redis is down.
if (redisEnabled) {
  redisClient
    .connect()
    .then(() => console.log("Redis Connected"))
    .catch((err) => console.log("Redis Connect Failed", err?.message || err));
} else {
  console.log("Redis Disabled (missing REDIS_URL/REDIS_PASSWORD)");
}

export default redisClient;