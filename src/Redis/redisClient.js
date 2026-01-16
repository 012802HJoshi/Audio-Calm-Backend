import { createClient } from "redis";

const redisClient = createClient({
    url:process.env.REDIS_URL
})

redisClient.on("error",(err)=>{
    console.error("Redis Error:",err);
});

// .on("connect",(stream)=>{
//     console.log("Redis Connection Successfull");
// });

export default redisClient;