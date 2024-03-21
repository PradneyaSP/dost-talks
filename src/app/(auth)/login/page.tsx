"use client";

import { Button } from "@/components/ui/button";
import { FC, useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import MyToast from "@/lib/MyToast";

const Page: FC = () => {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState<boolean>(false);
  const [isLoadingGitHub, setIsLoadingGitHub] = useState<boolean>(false);

  async function loginWithGoogle() {
    setIsLoadingGoogle(true);
    try {
      // throw new Error("LOL");
      await signIn("google");
    } catch (error) {
      // display error message to user
      MyToast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoadingGoogle(false);
    }
  }

  async function loginWithGitHub() {
    setIsLoadingGitHub(true);
    try {
      // throw new Error("LOL");
      await signIn("github");
    } catch (error) {
      // display error message to user
      MyToast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    } finally {
      setIsLoadingGitHub(false);
    }
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full flex flex-col items-center max-w-md space-y-8">
          <div className="flex flex-col items-center gap-8">
            logo
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="w-full flex flex-col items-center max-w-md gap-2">
            <Button
              isLoading={isLoadingGoogle}
              type="button"
              className="max-w-sm mx-auto w-full"
              onClick={loginWithGoogle}
            >
              {isLoadingGoogle ? null : (
                <Image
                  src="/google.svg"
                  alt="google icon"
                  height={20}
                  width={20}
                />
              )}
              &nbsp;&nbsp;Google
            </Button>
            <Button
              isLoading={isLoadingGitHub}
              type="button"
              className="max-w-sm mx-auto w-full !space-y-0"
              onClick={loginWithGitHub}
            >
              {isLoadingGitHub ? null : (
                <Image
                  src="/github.svg"
                  alt="google icon"
                  height={20}
                  width={20}
                />
              )}
              &nbsp;&nbsp;GitHub
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
