"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

//icons


const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "900"],
});
const instrumentFont = Instrument_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-instrument",
});


export default function Page() {

    const router = useRouter();


    //check if user is logged in
    useEffect(() => {

    }, [])

    const logout = async () => {
        await supabase.auth.signOut()
        router.push("/auth/login")
    }


    return (
        <>
            <div className={`flex justify-center items-center w-screen h-screen ${instrumentFont.className} text-6xl font-bold`}>
                <div className="flex justify-center items-center w-1/24 h-full bg-amber-500 p-5 hover:w-4/24 transition-all duration-300 ease-in-out">
                    Dashboard
                </div>
                <div className="flex justify-center items-center flex-1 h-full bg-yellow-300">
                    <span>
                        Chat Page
                    </span>
                    <span
                        onClick={logout}
                        className="border p-2 text-4xl cursor-pointer bg-red-700">
                        Log out
                    </span>
                </div>
            </div>
        </>
    );
}
