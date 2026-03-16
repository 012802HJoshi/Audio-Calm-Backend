import redisClient from "../Redis/redisClient.js";

const checkCache = (cacheKey) => {
  return async (req, res, next) => {
    const { cat_id } = req.query;

    try {
      if (cat_id) {
        const cachedData = await redisClient.get(`${cacheKey}:${cat_id}`);

        if (cachedData) {
          console.log("CACHE HIT");
          return res.status(200).json(JSON.parse(cachedData));
        }
      } else {
        const cachedData = await redisClient.get(cacheKey);

        if (cachedData) {
          console.log("CACHE HIT");
          return res.status(200).json(JSON.parse(cachedData));
        }
      }
      
      console.log("CACHE MISS");
      next();
    } catch (err) {
      console.error("Redis Cache Error:", err);
      next();
    }
  };
};

export default checkCache;
