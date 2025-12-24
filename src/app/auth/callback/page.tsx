"use client";

import { useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/auth/login")
        return
      }

      const name = user.user_metadata?.name || user.user_metadata?.full_name || "";

      const { data, error: upsertError } = await supabase.from("users").upsert({
        id: user.id,
        email: user.email,
        name: name,
      })

      if(upsertError){
        console.log(upsertError)
      }

      router.replace("/chat")
    }

    handleAuth();
  }, [router]);

  return (
    <p className="w-screen h-screen flex justify-center items-center md:text-2xl ">
      Signing you in...
    </p>
  );
}
