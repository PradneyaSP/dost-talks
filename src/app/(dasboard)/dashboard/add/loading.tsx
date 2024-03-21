import { Skeleton } from "@/components/ui/skeleton";
import { FC } from "react";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
  return (
    <div>
      <Skeleton className="h-12 mb-8 w-72" />
      <Skeleton className="h-4 w-8 ml-16 mb-4"/>
      <Skeleton className="h-8 w-56 ml-16 inline-block mr-4"/>
      <Skeleton className="h-8 w-20 inline-block"/>
    </div>
  );
};

export default loading;
