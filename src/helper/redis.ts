import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";

const upstashRedisURL = process.env.UPSTASH_REDIS_REST_URL;
const upstashAuthToken = process.env.UPSTASH_REDIS_REST_TOKEN;

type Command = "zrange" | "sismember" | "get" | "smembers";

export const fetchRedis = async (
  command: Command,
  ...args: (string | number)[]
) => {
  noStore();
  const commandURL = `${upstashRedisURL}/${command}/${args.join("/")}`;
  const response = await fetch(commandURL, {
    headers: {
      Authorization: `Bearer ${upstashAuthToken}`,
    },
  });

  if(!response.ok)
    return `Error executing the request : ${response.statusText}`

    const data = await response.json();
    return data.result;
};
