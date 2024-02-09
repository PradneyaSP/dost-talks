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

interface Options {
  id: number;
  name: string;
  href: string;
  Icon: Icon;
}

const options: Options[] = [
  {
    id: 1,
    name: "Add Friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

interface OverviewProps {
  session: Session;
}

const Overview: FC<OverviewProps> = async ({ session }) => {
  const unseenFriendRequests = (
    (await fetchRedis(
      "smembers",
      `user:${session.user.id}:incoming_friend_requests`
    )) as User[]
  ).length;

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
                <DropdownMenuItem className="flex justify-between items-center px-4">
                  <div>{option.name}</div>
                  <Icon className="h-4 w-4" />
                  {option.name == "Incoming Requests" &&
                    unseenFriendRequests > 0 && (
                      <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex justify-center items-center">
                        {unseenFriendRequests}
                      </div>
                    )}
                </DropdownMenuItem>
              </Link>
            );
          })}

          <Link href="/dashboard/requests">
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
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default Overview;
