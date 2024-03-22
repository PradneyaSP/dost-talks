"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { Users } from "lucide-react";
import { FC, useEffect, useState } from "react";
import Link from "next/link";

interface IncomingRequestsProps {
  unseenFriendRequests: number;
  sessionId: string;
}

const IncomingRequests: FC<IncomingRequestsProps> = ({
  unseenFriendRequests,
  sessionId,
}) => {
  const [unseenFriendRequestCount, setUnseenFriendRequestCount] =
    useState<number>(unseenFriendRequests);

  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    );

    const friendRequestHandler = () => {
      setUnseenFriendRequestCount((prev) => prev + 1);
    };

    pusherClient.bind(`incoming_friend_requests`, friendRequestHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`user:${sessionId}:incoming_friend_requests`)
      );
      pusherClient.unbind(`incoming_friend_requests`, friendRequestHandler);
    };
  }, [sessionId]);
  return (
    <Link href="/dashboard/requests">
      <div className="relative hover:text-primary hover:bg-slate-100 cursor-default select-none rounded-sm p-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex space-x-4 items-center">
        {unseenFriendRequestCount > 0 ? (
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
            {unseenFriendRequestCount}
          </div>
        ) : (
          <span className="text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
            <Users className="h-4 w-4" />
          </span>
        )}
        <div className="font-semibold">Incoming Requests</div>
      </div>
    </Link>
  );
};

export default IncomingRequests;
