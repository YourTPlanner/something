import Valkey from "ioredis";
import { envLoader } from "../utils/envLoader";

const isProd = process.env.NODE_ENV === "production";
const redisUrl = isProd ? process.env.AIVEN_REDIS_VALKEY_SERVICE : "redis://localhost:6379";

if (!redisUrl) {
    throw new Error("Redis URL is missing in environment variables!");
}

let redisInstance : Valkey | null = null;

export const getRedisClient = () => {
    if(!redisInstance) {
        redisInstance = new Valkey(process.env.AIVEN_REDIS_VALKEY_SERVICE as string);
        return redisInstance;
    }

    return redisInstance
}


//return new Valkey(process.env.AIVEN_REDIS_VALKEY_SERVICE as string);