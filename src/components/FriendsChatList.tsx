"use client";

import MyToast from "@/lib/MyToast";
import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor, toPusherKey } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import Image from "next/image";

interface FriendChatListProps {
  friends: User[];
  sessionId: string;
}

interface ExtendedMessage extends Message {
  senderImg: string;
  senderName: string;
}

const FriendChatList: FC<FriendChatListProps> = ({ friends, sessionId }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const [activeChats, setActiveChats] = useState<User[]>(friends);

  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`));
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`));

    const newFriendHandler = (newFriend : User) => {
      setActiveChats((prev) => [...prev, newFriend]);
    };

    const chatHandler = (message: ExtendedMessage) => {
      const shouldNotify =
        pathname !==
        `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

      if (!shouldNotify) return;

      MyToast({
        variant: "default",
        title: message.senderName,
        description: message.text,
      });

      setUnseenMessages((prev) => [...prev, message]);
    };

    pusherClient.bind("new_message", chatHandler);
    pusherClient.bind("new_friend", newFriendHandler);

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`));
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`));

      pusherClient.unbind("new_message", chatHandler);
      pusherClient.unbind("new_friend", newFriendHandler);
    };
  }, [pathname, sessionId, router]);

  useEffect(() => {
    if (pathname?.includes("chat")) {
      setUnseenMessages((prev) => {
        return prev.filter((msg) => !pathname.includes(msg.senderId));
      });
    }
  }, [pathname]);

  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {activeChats.sort().map((friend) => {
        const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
          return unseenMsg.senderId === friend.id;
        }).length;

        return (
          <li
            key={friend.id}
            className="hover:bg-slate-100 px-2 py-2 rounded-lg"
          >
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
            >
              <div className="flex justify-between">
                <div>
                  <Image
                    src={friend.image}
                    alt="Friend Profile Image"
                    width={30}
                    height={30}
                    className="rounded-full inline-block mr-2"
                  />
                  <p className="text-base inline-block">{friend.name}</p>
                </div>
                {unseenMessagesCount > 0 && (
                  <div className="h-6 w-6 text-primary-foreground bg-primary rounded-full text-xs grid place-items-center">
                    {unseenMessagesCount}
                  </div>
                )}
              </div>
            </a>
          </li>
          /*
          <li key={friend.id}>
            <a
              href={`/dashboard/chat/${chatHrefConstructor(
                sessionId,
                friend.id
              )}`}
              className="text-gray-700 hover:text-primary hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
            >
              <Image
                fill
                referrerPolicy='no-referrer'
                className='rounded-full'
                src={friend.image}
                alt={`${friend.name} profile picture`}
              />
              {friend.name}
              {unseenMessagesCount > 0 ? (
                <div className="bg-primary font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center">
                  {unseenMessagesCount}
                </div>
              ) : null}
            </a>
          </li>*/
        );
      })}
    </ul>
  );
};

export default FriendChatList;
