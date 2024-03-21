import { toast } from "../components/ui/use-toast";
import { ToastProps } from "@/components/ui/toast";

interface MyToastProps extends ToastProps {
  description?: string;
}

export default function MyToast({
  variant,
  title,
  description,
}: MyToastProps) {
  return toast({
    variant: variant,
    title: title,
    description: description,
  });
}
