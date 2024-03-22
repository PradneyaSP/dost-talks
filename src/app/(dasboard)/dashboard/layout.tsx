import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icons } from "@/components/Icons";
import Overview from "@/components/Overview";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";
import getFriendsByUserId from "@/helper/get-friends-by-userid";
import FriendsChatList from "@/components/FriendsChatList";
import MobileChatLayout from "@/components/MobileChatLayout";
import { fetchRedis } from "@/helper/redis";
import { SidebarOption } from "@/types/typings";

export const metadata: Metadata = {
  title: "Dashboard | DostTalks",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  const friends = await getFriendsByUserId(session.user.id);
  const parsedFriends = friends.map((friend) => JSON.parse(friend)) as User[];

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

  const options : SidebarOption[] = [
    {
      id: 1,
      name: "Add Friend",
      href: "/dashboard/add",
      Icon: "UserPlus",
    },
  ];

  return (
    <div className="w-full h-screen flex">
      <div className="md:hidden">
        <MobileChatLayout friends={parsedFriends} session={session} unseenRequestCount={unseenRequestCount} sidebarOptions={options}/>
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
            <Icons.Logo className="h-8 w-auto text-primary" />
          </Link>
          <Overview session={session} unseenFriendRequests = {unseenRequestCount} options={options}/>
        </div>
        <div className="text-xs text-secondary leading-6 font-semibold">
          {parsedFriends.length > 0 ? "Your Chats" : "Add Friends!"}
        </div>

        <nav className="flex flex-col flex-1">
          <FriendsChatList
            friends={parsedFriends}
            sessionId={session.user.id}
          />
          <hr />
          <li className="-mx-6 mt-auto flex items-center">
            <div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-sm font-semibold leading-6 text-primary">
              <div className="relative h-8 w-8 bg-background">
                <Image
                  fill
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                  src={session.user.image || ""}
                  alt="Your profile picture"
                />
              </div>

              <span className="sr-only">Your profile</span>
              <div className="flex flex-col">
                <span aria-hidden="true">
                  {session.user.name!.length > 15
                    ? `${session.user.name!.slice(0, 15)}...`
                    : session.user.name}
                </span>

                <span className="text-xs text-secondary" aria-hidden="true">
                  {session.user.email}
                </span>
              </div>
            </div>

            <SignOutButton className="h-full aspect-square" />
          </li>
        </nav>
      </div>
      <aside className="max-h-screen container py-8 w-full">{children}</aside>
    </div>
  );
}
