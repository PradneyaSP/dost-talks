"use client";
import { ButtonHTMLAttributes, FC, useState } from "react";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";
import { Loader2, LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);

  function ToastDestructive() {
    return toast({
      variant: "destructive",
      title: "Could not sign out",
      description: "There was a problem with your request.",
    });
  }
  return (
    <Button
      {...props}
      variant="ghost"
      onClick={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
            ToastDestructive();
        } finally {
          setIsSigningOut(false);
        }
      }}
    >{
        isSigningOut ? <Loader2 className="animate-spin h-4 w-4"/> : <LogOutIcon className="h-4 w-4"/>
}</Button>
  );
};

export default SignOutButton;
