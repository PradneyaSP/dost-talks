import { Redis } from "@upstash/redis";

const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
const url = process.env.UPSTASH_REDIS_REST_URL;

if (!url || !redisToken) throw new Error("Undefined DB Credentials");

export const db = new Redis({
  url: url,
  token: redisToken,
});
