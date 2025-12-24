"use client"
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

//icons
import { BiSolidHide, BiSolidShow } from "react-icons/bi";


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

    type ShowPasswordState = {
        password: boolean;
        confirmPassword: boolean;
    };

    const [showPassword, setShowPassword] = useState<ShowPasswordState>({
        password: false,
        confirmPassword: false
    })

    const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setUserData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    type UserData = {
        password: string
        confirmPassword: string,
    }

    const [userData, setUserData] = useState<UserData>({
        password: "",
        confirmPassword: "",
    })

    const resetPassword = async () => {
        const { error } = await supabase.auth.updateUser({
            password: userData.password,
        });

        if (error) {
            console.error(error);
            return;
        }

        router.replace("/auth/login");
    };


    return (
        <>
            <div className={`${inter.className} w-screen h-screen flex justify-center-safe items-center p-2`}>
                <div
                    className={`border-2 border-white/20 rounded-lg bg-white/20 backdrop-blur-md p-6 md:p-10 lg:p-15 text-sm h-fit w-fit flex justify-center flex-col items-center  gap-2`}>
                    <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-4 ">
                        <span className={`text-4xl md:text-5xl lg:text-6xl flex justify-center items-center font-bold`}>
                            Reset Password
                        </span>
                        <span className="flex gap-2 flex-col w-full justify-center items-center">
                            <span
                                className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                                <input
                                    name="password"
                                    value={userData.password}
                                    onChange={handleUserDataChange}
                                    type={`${showPassword.password ? "text" : "password"}`}
                                    placeholder="New Password"
                                    className="w-11/12 rounded-md focus:outline-none focus:ring-0 " />
                                <span
                                    onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}>
                                    {
                                        showPassword.password ?
                                            <BiSolidHide />
                                            :
                                            <BiSolidShow />
                                    }
                                </span>
                            </span>
                            <span
                                className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                                <input
                                    name="confirmPassword"
                                    value={userData.confirmPassword}
                                    onChange={handleUserDataChange}
                                    type={`${showPassword.confirmPassword ? "text" : "password"}`}
                                    placeholder="Confirm Password"
                                    className="w-11/12 rounded-md focus:outline-none focus:ring-0 " />
                                <span
                                    onClick={() => setShowPassword(prev => ({ ...prev, confirmPassword: !prev.confirmPassword }))}>
                                    {
                                        showPassword.confirmPassword ?
                                            <BiSolidHide />
                                            :
                                            <BiSolidShow />
                                    }
                                </span>
                            </span>
                        </span>
                        <span
                            onClick={resetPassword}
                            className="md:px-4 md:py-3 px-3 py-1 bg-[#50056e] rounded-full text-base  md:text-sm border border-white/20 cursor-pointer hover:bg-[#7700a5] ">
                            Reset Password
                        </span>
                    </div>
                </div>
            </div>
        </>
    );
}