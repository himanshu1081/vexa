"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react"
import Link from "next/link";
import { useState, useEffect, use } from "react";
import { supabase } from "../../lib/supabase"



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

  type UserData = {
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  }

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

  const [width, setWidth] = useState<number>(0);

  const [userData, setUserData] = useState<UserData>(
    {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  )

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value,
    }));
  }

  const [error, setError] = useState<string>("");

  const [notice, setNotice] = useState<string>("");

  async function signUpNewUser() {
    setError("")
    if (userData.password != userData.confirmPassword) {
      setError("Password does not match!")
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
        data: {
          name: userData.name,
        }
      },
    })
    if (error) {
      console.log(error)
      setError("Something went wrong")
      return;
    }
    setNotice("We have sent a Confirmation Email")
  }

  async function signUpWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }

  async function signUpWithGithub() {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: "http://localhost:3000/auth/callback",
      },
    });
  }


  return (
    <>
      <div className={`${instrumentFont.variable} flex justify-center items-center h-screen w-screen whitespace-nowrap `}>
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .8 }}
          className={`border-2 border-white/20 rounded-lg bg-white/20 backdrop-blur-md p-6 md:p-10 lg:p-15 text-sm h-10/12 w-11/12 md:w-130 flex justify-center flex-col items-center gap-2`}>
          <div className="flex flex-col justify-center items-center">
            <Link href={'/'} className={`text-4xl md:text-5xl lg:text-6xl flex justify-center items-center font-bold`}>
              Vexa
            </Link>
          </div>
          <div className="flex justify-center items-center flex-col w-full md:w-3/4 gap-4 md:gap-6">

            <span className={`text-base md:text-lg lg:text-xl ${inter.className} font-bold `}>
              Create a new account.
            </span>

            <span
              className={` flex flex-col gap-2 w-full justify-center items-center text-black ${inter.className} placeholder:text-white `}>
              <input
                type="text"
                name="name"
                onChange={handleUserDataChange}
                placeholder="Name"
                className="w-11/12 border border-white/20 rounded-md p-2 focus:outline-none focus:ring-0 bg-white/50" />
              <input type="email"
                name="email"
                onChange={handleUserDataChange}
                placeholder="Email"
                className="w-11/12 border border-white/20 rounded-md p-2 focus:outline-none focus:ring-0 bg-white/50" />
              <span
                className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                <input
                  name="password"
                  onChange={handleUserDataChange}
                  type={`${showPassword.password ? "text" : "password"}`}
                  placeholder="Password"
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
                className="w-11/12 border border-white/20 rounded-md p-2 focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                <input
                  name="confirmPassword"
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
              {
                error != "" ?
                  <div className="w-fit whitespace-break-spaces h-fit border border-red-500/20 rounded-md p-1 focus:outline-none focus:ring-0 bg-red-500/70 text-white text-center">
                    {error}
                  </div>
                  :
                  <>
                  </>
              }
              {
                notice &&
                <span>
                  <div className="w-fit whitespace-break-spaces h-fit border border-green-500/20 rounded-md p-1 focus:outline-none focus:ring-0 bg-green-500/20 text-green-200 text-center">
                    {notice}
                  </div>
                </span>
              }
            </span>
            <span
              onClick={signUpNewUser}
              className="md:px-4 md:py-3 px-3 py-1 bg-[#50056e] rounded-full text-base  md:text-sm border border-white/20 cursor-pointer hover:bg-[#7700a5] transition-all duration-75 ease-in">
              Sign Up
            </span>
          </div>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="px-3 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex justify-around items-center flex-col w-full gap-4">
            <div className="flex gap-2 w-full justify-around items-center ">
              <span onClick={signUpWithGoogle} className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-white/80 cursor-pointer gap-2 text-black hover:bg-white">
                <FcGoogle size={`${width > 500 ? 25 : 15}`} />
                {
                  width > 650 &&
                  <span>
                    Continue with Google
                  </span>
                }
              </span>
              <span onClick={signUpWithGithub} className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-black/80 cursor-pointer gap-2 text-white hover:bg-black">
                <FaGithub size={`${width > 500 ? 25 : 15}`} />
                {
                  width > 650 &&
                  <span>
                    Continue with Github
                  </span>
                }
              </span>
            </div>
            <div className="flex flex-col md:flex-row md:gap-2 items-center justify-center text-xs md:text-sm">
              Already have an account ?
              <Link href="/auth/login" className=" hover:text-white underline">
                Sign in.
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
