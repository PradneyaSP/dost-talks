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

    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd);

    return new NextResponse("Friend Request Removed!", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new NextResponse("Invalid  request payload", { status: 422 });
    return new NextResponse("Something went wrong!", { status: 400 });
  }
};
