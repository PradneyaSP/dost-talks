import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async ({}) => {
  const session = await getServerSession(authOptions);
  return (
    <div className="grid place-content-center bg-dashboard-pattern bg-contain -m-8 h-screen">
        <h1 className="text-5xl font-bold backdrop bg-white p-8 bg-opacity-60 rounded-3xl">Dost <span className="bg-black text-white p-2 rounded-3xl">Talks</span></h1>
    </div>
  );
};

export default page;
