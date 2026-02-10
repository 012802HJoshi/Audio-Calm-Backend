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

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_URL,
        port: 19772
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

(async()=>{
  await redisClient.connect();
  console.log("Redis Connected");
})();

export default redisClient;