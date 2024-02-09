import AddFriendButton from "@/components/AddFriendButton";
import { FC } from "react";

const page: FC = () => {
  return (
    <main className="p-12">
      <h1 className="font-bold text-5xl mb-8">Add a Friend</h1>
      <AddFriendButton/>
    </main>
  );
};

export default page;
