"use client"

import { FC, useState } from "react";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "./ui/input";
import { friendEmailValidator } from "@/lib/validations/add-friend";
import { ZodError, z } from "zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AddFriendButtonProps {}

const AddFriendButton: FC<AddFriendButtonProps> = ({}) => {
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  type FormData = z.infer<typeof friendEmailValidator>;

  const form = useForm<FormData>({
    resolver: zodResolver(friendEmailValidator),
  });

  const addFriend = async (email: string) => {
    try {
      const validatedEmail = friendEmailValidator.parse({ email });

      await axios.post("/api/friends/add", {
        email: validatedEmail,
      });

      setShowSuccess(true);
    } catch (error) {
      if (error instanceof ZodError) {
        form.setError('email',{message: error.message})
        return;
      }
      
      if (error instanceof AxiosError) {
        form.setError('email',{message: error.response?.data})
        return;
      }

      form.setError('email' , {message: "Something went wrong!"})
    }
  };

  const onSubmit = (data : FormData) => {
    addFriend(data.email);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-2 flex gap-4 ml-10">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium leading-6 text-gray-500 pl-4">
                Email
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="your@email.com"
                  className="block w-full rounded-md border-0 py-1.5 indent-2 text-primary shadow-sm ring-1 ring-inset ring-secondary focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                  {...field}
                />
              </FormControl>
              <FormDescription className="pl-4">
                This is the email of your friend
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <PlusIcon />
          &nbsp;Add
        </Button>
      </form>
      {/* <p className="text-red-500 text-sm">{form.formState.errors.email?.message}</p> */}
      {
        showSuccess && <p className="text-green-500 text-sm">Friend request sent successfully !</p>
      }
    </Form>
  );
};

export default AddFriendButton;
