import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ZodError, z } from "zod";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) return new NextResponse("Unauthorised", { status: 401 });

    const isAlreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    );

    if (isAlreadyFriends)
      return new NextResponse("Already Friends", { status: 401 });

    const hasFriendRequest = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd
    )) as 1 | 0;

    if (!hasFriendRequest)
      return new NextResponse("No friend request!", { status: 400 });

    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id);

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);
    await db.srem(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new NextResponse("Done! ", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new NextResponse("Invalid  request payload", { status: 422 });
    return new NextResponse("Something went wrong!", { status: 400 });
  }
};
