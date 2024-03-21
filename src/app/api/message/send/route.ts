import { fetchRedis } from "@/helper/redis";
import { authOptions } from "@/lib/auth";
import { Message, messageSchema } from "@/lib/validations/message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { text, chatId } = await req.json();
    const session = await getServerSession(authOptions);

    if (!session) return new NextResponse("Unauthorised", { status: 401 });

    const [user1, user2] = chatId.split("--");

    if (session.user.id !== user1 && session.user.id !== user2)
      return new NextResponse("Unauthorised", { status: 401 });

    const friendId = session.user.id === user1 ? user2 : user1;

    const isFriend = (await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      friendId
    )) as 1 | 0;
    if (!isFriend) return new NextResponse("Not Friend", { status: 401 });

    const rawSender = (await fetchRedis(
      "get",
      `user:${session.user.id}`
    )) as string;
    const sender = JSON.parse(rawSender) as User;

    const timestamp = Date.now();
    const messageData: Message = {
      id: nanoid(),
      senderId: session.user.id,
      text,
      timestamp,
    };

    const message = messageSchema.parse(messageData) as Message;
    //Realtime message wala part
    pusherServer.trigger(toPusherKey(`chat:${chatId}`), "incoming_messages", {
      message,
    });
    pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), "new_message", {
      ...message,
      senderImg: sender.image,
      senderName: sender.name, 
    });
    await db.zadd(`chat:${chatId}:messages`, {
      score: timestamp,
      member: JSON.stringify(message),
    });

    return new NextResponse("OK");
  } catch (error) {
    if (error instanceof Error)
      return new NextResponse(error.message, { status: 500 });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
