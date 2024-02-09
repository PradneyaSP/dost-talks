import { authOptions } from "@/lib/auth";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Icons } from "@/components/Icons";
import Overview from "@/components/Overview";
import Image from "next/image";
import SignOutButton from "@/components/SignOutButton";

export const metadata: Metadata = {
  title: "Dashboard | DostTalks",
};

interface LayoutProps {
  children: React.ReactNode;
}

export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await getServerSession(authOptions);
  if (!session) notFound();

  return (
    <div className="w-full h-screen flex">
      <div className="flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6">
        <Link
          href="/dashboard"
          className="flex h-16 shrink-0 items-center justify-between"
        >
          <Icons.Logo className="h-8 w-auto text-primary" />
          <Overview session={session} />
        </Link>
        <div className="text-xs text-secondary leading-6 font-semibold">
          Your Chats
        </div>

        <nav className="flex flex-col flex-1">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>Chats that this user has</li>
          </ul>
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
      {children}
    </div>
  );
}
