"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react"
import Link from "next/link";
import { useState, useEffect } from "react";





//icons
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
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

  type ShowPasswordState = {
    password: boolean;
    confirmPassword: boolean;
  };

  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false
  })

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [width, setWidth] = useState<number>();


  return (
    <>
      <div className={`${instrumentFont.variable} flex justify-center items-center h-screen w-screen whitespace-nowrap `}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .8 }}
          className={`border-2 border-white/20 rounded-lg bg-white/20 backdrop-blur-md p-6 md:p-10 lg:p-15 text-sm h-9/12 w-3/4 md:w-150 flex justify-center flex-col items-center  gap-2`}>
          <div className="flex flex-col justify-center items-center">
            <span className={`text-4xl md:text-5xl lg:text-6xl flex justify-center items-center font-bold`}>
              Vexa
            </span>
          </div>
          <div className="flex justify-center items-center flex-col w-full md:w-3/4 gap-4 md:gap-6">
            <span className={`text-xl md:text-lg lg:text-4xl ${inter.className} font-bold `}>
              Welcome Back!
            </span>
            <span
              className={` flex flex-col gap-2 w-full justify-center items-center text-black ${inter.className} placeholder:text-white `}>
              <input type="email"
                placeholder="Email"
                className="w-11/12 border border-white/20 rounded-md p-2 focus:outline-none focus:ring-0 bg-white/50" />
              <span
                className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                <input type={`${showPassword.password ? "text" : "password"}`} placeholder="Password" className="w-11/12 rounded-md focus:outline-none focus:ring-0 " />
                <span onClick={() => setShowPassword(prev => ({ ...prev, password: !prev.password }))}>
                  {
                    showPassword.password ?
                      <BiSolidHide />
                      :
                      <BiSolidShow />
                  }
                </span>
              </span>
              <div className="flex flex-col md:flex-row md:gap-2 items-center justify-center text-xs md:text-sm text-white">
                Forgot password ?
                <Link href="/auth/login" className=" hover:text-white underline">
                  Reset here
                </Link>
              </div>
            </span>
            <Link href='/auth/login' className="md:px-4 md:py-3 px-3 py-1 bg-[#50056e] rounded-full text-base  md:text-sm border border-white/20 cursor-pointer hover:bg-[#7700a5] transition-all duration-75 ease-in">
              Log In
            </Link>
          </div>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="px-3 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex justify-around items-center flex-col w-full gap-4">
            <div className="flex gap-2 w-full justify-around items-center ">
              <span className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-white/80 cursor-pointer gap-2 text-black hover:bg-white">
                <FcGoogle size={25} />
                {
                  width > 650 &&
                  <span>
                    Continue with Google
                  </span>
                }
              </span>
              <span className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-black/80 cursor-pointer gap-2 text-white hover:bg-black">
                <FaGithub size={25} />
                {
                  width > 650 &&
                  <span>
                    Continue with Github
                  </span>
                }
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center justify-center text-xs md:text-sm">
              Don't have an account ?
              <Link href="/auth/signup" className=" hover:text-white underline">
                Click here
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
