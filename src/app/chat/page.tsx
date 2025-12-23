"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { useState, useEffect } from "react";

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

    //check if user is logged in
    useEffect(() => {
        
    },[])

    return (
        <>
            <div className={`flex justify-center items-center w-screen h-screen ${instrumentFont.className} text-6xl font-bold`}>
                <div className="flex justify-center items-center w-1/24 h-full bg-amber-500 p-5 hover:w-4/24 transition-all duration-300 ease-in-out">
                    Dashboard
                </div>
                <div className="flex justify-center items-center flex-1 h-full bg-yellow-300">
                    Chat Page
                </div>
            </div>
        </>
    );
}
