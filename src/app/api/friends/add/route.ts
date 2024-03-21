import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { friendEmailValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { unstable_noStore as noStore } from "next/cache";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request) {
  try {
    noStore();
    const body = await req.json();
    const { email: emailToAdd } = friendEmailValidator.parse(body.email);
    const idToAdd = await fetchRedis("get", `user:email:${emailToAdd}`);

    if (!idToAdd)
      return new NextResponse("Friend does not exist", { status: 400 });

    const session = await getServerSession(authOptions);
    if (!session) return new NextResponse("Unauthorised", { status: 401 });

    if (idToAdd == session.user.id)
      return new NextResponse("You cannot add yourself as a friend", {
        status: 403,
      });

    // check is request is already sent
    const friendRequestAlreadySent = (await fetchRedis(
      "sismember",
      `user:${idToAdd}:incoming_friend_requests`,
      session.user.id
    )) as 1 | 0;

    if (friendRequestAlreadySent)
      return new NextResponse("Friend request already sent.", { status: 400 });

    //check if the new user is already a friend
    const isAFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd
    )) as 1 | 0;

    if (isAFriend)
      return new NextResponse("The User is your friend.", { status: 400 });

    // Valid user Id
    pusherServer.trigger(
      toPusherKey(`user:${idToAdd}:incoming_friend_requests`),
      "incoming_friend_requests",
      {friend: session.user }
    );

    db.sadd(`user:${idToAdd}:incoming_friend_requests`, session.user.id);
    return new NextResponse("New friend request sent successfully", {
      status: 200,
    });
  } catch (error) {
    if (error instanceof ZodError)
      return new NextResponse("Invalid request payload", { status: 422 });
    return new NextResponse("Error in sending friend request", { status: 400 });
  }
}
