"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const isProd = process.env.NODE_ENV === "production";
const redisUrl = isProd ? process.env.AIVEN_REDIS_VALKEY_SERVICE : "redis://localhost:6379";
if (!redisUrl) {
    throw new Error("Redis URL is missing in environment variables!");
}
let redisInstance = null;
const getRedisClient = () => {
    if (!redisInstance) {
        redisInstance = new ioredis_1.default(process.env.AIVEN_REDIS_VALKEY_SERVICE);
        return redisInstance;
    }
    return redisInstance;
};
exports.getRedisClient = getRedisClient;
//return new Valkey(process.env.AIVEN_REDIS_VALKEY_SERVICE as string);
