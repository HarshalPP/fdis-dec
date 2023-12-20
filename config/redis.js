const redis = require('redis');
const redisClient = redis.createClient('127.0.0.1', 6379 );

redisClient.on('error', (error) => {
    console.error("Error in config redis:", error);
});

module.exports = { redisClient };
