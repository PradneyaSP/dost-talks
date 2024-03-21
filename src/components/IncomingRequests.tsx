"use client";

import { pusherClient } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
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
      <DropdownMenuItem className="relative cursor-default select-none rounded-sm py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 flex justify-between items-center px-4">
        <div>Incoming Requests</div>
        {unseenFriendRequestCount > 0 ? (
          <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
            {unseenFriendRequestCount}
          </div>
        ) : (
          <Users className="h-4 w-4" />
        )}
      </DropdownMenuItem>
    </Link>
  );
};

export default IncomingRequests;
