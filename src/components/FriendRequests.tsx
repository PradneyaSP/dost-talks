"use client";
import { FC, useState } from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface FriendRequestsProps {
  incomingFriendRequests: User[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const [friendRequests, setFriendRequests] = useState<User[]>(
    incomingFriendRequests
  );
  const router = useRouter();

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/friends/accept", { id: senderId });
    setFriendRequests((prev) => prev.filter((user) => user.id !== senderId));
    router.refresh();
  };

  const declineFriend = async (senderId: string) => {
    await axios.post("/api/friends/decline", { id: senderId });
    setFriendRequests((prev) => prev.filter((user) => user.id !== senderId));
    router.refresh();
  };
  return (
    <>
      {friendRequests.length === 0 ? (
        <p>No requests to show</p>
      ) : (
        <ul>
          {friendRequests.map((user) => {
            return (
              <li className="-mx-6 mt-auto flex items-center" key={user.id}>
                <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-primary">
                  <div className="relative h-10 w-10 bg-background">
                    <Image
                      fill
                      referrerPolicy="no-referrer"
                      className="rounded-full"
                      src={user.image || ""}
                      alt="Your profile picture"
                    />
                  </div>

                  <span className="sr-only">Friend Details</span>
                  <div className="flex flex-col">
                    <span aria-hidden="true" className="text-lg">
                      {user.name}
                    </span>
                    <span className="text-xs text-secondary" aria-hidden="true">
                      {user.email}
                    </span>
                  </div>
                  <button
                    aria-label="accept request"
                    className="w-8 h-8 bg-green-500 hover:bg-green-700 grid place-items-center rounded-full transition hover:shadow-md ml-8"
                    onClick={() => {
                      acceptFriend(user.id);
                    }}
                  >
                    <Check className="font-semibold w-3/4 h-3/4 text-white" />
                  </button>
                  <button
                    aria-label="decline request"
                    className="w-8 h-8 bg-red-500 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md"
                    onClick={() => {
                      declineFriend(user.id);
                    }}
                  >
                    <X className="font-semibold w-3/4 h-3/4 text-white" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default FriendRequests;
