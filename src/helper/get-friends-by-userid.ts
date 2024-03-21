import { fetchRedis } from "./redis";


export default async function getFriendsByUserId(id: string) {
  const friendIds = await fetchRedis("smembers" , `user:${id}:friends`) as string[];
  const friends = await Promise.all(friendIds.map(async (friendId) => {
    return await fetchRedis("get" , `user:${friendId}`);
  })) as string[]
  return friends;
}
