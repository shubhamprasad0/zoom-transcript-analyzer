"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const onZoomLoginClick = () => {
    console.log("Logging in with zoom...");
    const ZOOM_AUTH_URL = process.env.NEXT_PUBLIC_ZOOM_AUTH_URL;
    if (!ZOOM_AUTH_URL) {
      throw new Error("Could not find zoom auth url in environment!");
    }
    router.push(ZOOM_AUTH_URL);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Button className="font-bold" onClick={onZoomLoginClick}>
          Login with Zoom
        </Button>
      </div>
    </main>
  );
}
