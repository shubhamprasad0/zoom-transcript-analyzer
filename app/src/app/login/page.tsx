"use client";
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
      getToken(code)
        .then(() => {
          router.push("/");
        })
        .catch((err) => {
          console.log("Error in login: ", err);
          router.push("/");
        });
    }
  }, [searchParams, router]);

  return <></>;
}
