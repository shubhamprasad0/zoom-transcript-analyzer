"use client";
import { Spinner } from "@/components/ui/spinner";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const getToken = async (code: string) => {
      const res = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      return res.json();
    };

    const code = searchParams.get("code");
    if (code) {
      getToken(code).catch((err) => {
        console.log("Error in login: ", err);
      });
    }
    router.push("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <Spinner />
      </div>
    </main>
  );
}
