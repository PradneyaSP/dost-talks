"use client";

import { cn, toPusherKey } from "@/lib/utils";
import { FC, useEffect, useRef, useState } from "react";
import type { Message } from "@/lib/validations/message";
import { format } from "date-fns";
import Image from "next/image";
import { pusherClient } from "@/lib/pusher";

interface MessagesProps {
  initialMessages: Message[];
  sessionId: string;
  chatId: string;
  chatPartner: User;
  sessionImg: string;
}

const formatTimestamp = (timestamp: number) => {
  return format(timestamp, "HH:mm");
};

const Messages: FC<MessagesProps> = ({
  chatId,
  initialMessages,
  sessionId,
  chatPartner,
  sessionImg,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  useEffect(() => {
    pusherClient.subscribe(
      toPusherKey(`chat:${chatId}`)
    );

    const messageHandler = ({message}: {message:Message}) => {
      setMessages(prev => [message , ...prev])
    };

    pusherClient.bind(`incoming_messages`, messageHandler);

    return () => {
      pusherClient.unsubscribe(
        toPusherKey(`chat:${chatId}`)
      );
      pusherClient.unbind(`incoming_messages`, messageHandler);
    };
  }, [chatId]);
  const scrollDownRef = useRef<HTMLDivElement | null>(null);
  return (
    <div className="flex flex-1 flex-col-reverse h-full gap-4 p-3 overflow-y-auto scrollbar-thumb-primary scrollbar-thumb-rounded scrollbar-track-primary-foreground scrollbar-w-2 scrolling-touch">
      <div ref={scrollDownRef} />
      {messages.map((message, index) => {
        const isCurrentUser: boolean = message.senderId === sessionId;
        const hasNextMessageFromSameUser: boolean =
          messages[index - 1]?.id === message.id;
        return (
          <div
            className="chat-message"
            key={`${message.id}-${message.timestamp}`}
          >
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}
            >
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "order-2 items-start": !isCurrentUser,
                  }
                )}
              >
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-primary text-primary-foreground": isCurrentUser,
                    "bg-gray-100 text-secondary-foreground": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}
                >
                  {message.text}{" "}
                  <span className="text-gray-400 text-xs ml-2">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative h-6 w-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}
              >
                <Image
                  src={isCurrentUser ? sessionImg : chatPartner.image}
                  alt="profile pic"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  width={96}
                  height={96}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Messages;
