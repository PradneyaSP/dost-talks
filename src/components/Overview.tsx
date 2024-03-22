import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LucideMoreVertical, Users } from "lucide-react";
import { Icon, Icons } from "./Icons";
import Link from "next/link";
import { fetchRedis } from "@/helper/redis";
import { FC } from "react";
import type { Session } from "next-auth";
import IncomingRequests from "./IncomingRequests";
import { SidebarOption } from "@/types/typings";

interface OverviewProps {
  session: Session;
  unseenFriendRequests: number;
  options: SidebarOption[];
}

const Overview: FC<OverviewProps> = async ({
  session,
  unseenFriendRequests,
  options,
}) => {
  // console.log(unseenFriendRequests + `user:${session.user.id}:incoming_friend_requests`);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <LucideMoreVertical />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {options.map((option) => {
            const Icon = Icons[option.Icon];
            return (
              <Link href={option.href} key={option.id}>
                <DropdownMenuItem className="flex items-center px-2 space-x-4">
                  <span className="text-gray-400 border-gray-200 group-hover:border-primary group-hover:text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="font-semibold">{option.name}</div>
                </DropdownMenuItem>
              </Link>
            );
          })}
          <IncomingRequests
            sessionId={session.user.id}
            unseenFriendRequests={unseenFriendRequests}
          />
          {/* <Link href="/dashboard/requests">
            <DropdownMenuItem className="flex justify-between items-center px-4">
              <div>Incoming Requests</div>
              {unseenFriendRequests > 0 ? (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
                  {unseenFriendRequests}
                </div>
              ) : (
                <Users className="h-4 w-4" />
              )}
            </DropdownMenuItem>
          </Link> */}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Overview;
