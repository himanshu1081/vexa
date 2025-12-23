"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      router.replace("/auth/login"); // or dashboard
    });
  }, [router]);

  return <p className="w-screen h-screen flex justify-center items-center md:text-2xl ">Signing you in...</p>;
}
