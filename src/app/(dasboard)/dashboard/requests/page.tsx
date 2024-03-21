import FriendRequests from "@/components/FriendRequests";
import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

const page: FC = async ({}) => {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const incomingFriendRequests = (await fetchRedis(
    "smembers",
    `user:${session.user.id}:incoming_friend_requests`
  )) as User[];

  let requestsToDisplay = await Promise.all(
    incomingFriendRequests.map(async (id) => {
      const result = await fetchRedis("get", `user:${id}`);
      return JSON.parse(result);
    })
  )as User[];
  

  return (
    <main>
      <h1 className="font-bold text-5xl mb-8">Friend Requests</h1>
      <FriendRequests incomingFriendRequests={requestsToDisplay} sessionId={session.user.id}/>
    </main>
  );
};

export default page;
