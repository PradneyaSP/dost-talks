import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";

export default async function Home() {
  return (
    <main>
      Hi There! <Button>Click Me!</Button>
    </main>
  );
}
