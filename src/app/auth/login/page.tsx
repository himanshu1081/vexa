"use client";
import { Inter } from "next/font/google";
import { Instrument_Sans } from "next/font/google";
import { motion } from "motion/react"
import Link from "next/link";
import { useState, useEffect } from "react";
import { redirect, useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";





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

  const [notice, setNotice] = useState<string>("");

  const [resetPopUp, setResetPopUp] = useState<boolean>(false)

  type ShowPasswordState = {
    password: boolean;
    confirmPassword: boolean;
  };

  const [showPassword, setShowPassword] = useState<ShowPasswordState>({
    password: false,
    confirmPassword: false
  })

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.push("/chat");
      }
    };

    const handleResize = () => setWidth(window.innerWidth);
    handleResize();
    checkSession();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const [width, setWidth] = useState<number>(0);

  const handleUserDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setNotice("");
    const { name, value } = e.target;

    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  type UserData = {
    email: string,
    password: string
  }

  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: ""
  })

  const [error, setError] = useState<string>("");

  const signInWithPassword = async () => {
    if (userData.email == "") {
      setError("Enter Email!")
      return;
    }

    if (userData.password == "") {
      setError("Enter Password!")
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    })

    if (error) {
      setError(error.message)
      return;
    }
    router.push("/chat")
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      signInWithPassword()
    }
  }

  const resetLink = async () => {
    if (userData.email == "") {
      return;
    }
    const { error } = await supabase.auth.resetPasswordForEmail(
      userData.email,
      {
        redirectTo: `${location.origin}/auth/reset-password`
      }
    );

    if (error) {
      console.error(error)
    }

    setNotice("If an account exists with this email, you’ll receive a reset link.")
  }

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  const signInWithGithub = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }

  return (
    <>
      <div className={`${instrumentFont.variable} flex justify-center items-center h-screen w-screen whitespace-nowrap `}>
        {
          resetPopUp &&
          <>
            <div
              onClick={() => setResetPopUp(!resetPopUp)}
              className="w-screen h-screen absolute z-100 bg-black/70">
            </div>
            <div
              className={`border-2 border-white/20 rounded-lg bg-white/20 backdrop-blur-md p-6 md:p-10 lg:p-15 text-sm h-fit w-fit flex justify-center flex-col items-center gap-2 absolute z-101`}>
              <div className="w-full h-full p-4 flex flex-col justify-center items-center gap-4 ">
                <span className={`text-4xl lg:text-6xl flex justify-center items-center font-bold`}>
                  Enter your email
                </span>
                <span className="flex gap-2 flex-col w-full justify-center items-center">
                  <span
                    className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                    <input
                      name="email"
                      value={userData.email}
                      onChange={handleUserDataChange}
                      type="email"
                      placeholder="Email"
                      className="w-11/12 rounded-md focus:outline-none focus:ring-0 " />
                  </span>
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
                  onClick={resetLink}
                  className="md:px-4 md:py-3 px-3 py-1 bg-[#0f6f3f] rounded-full text-base  md:text-sm border border-white/20 cursor-pointer hover:bg-[#7700a5] ">
                  Send reset link
                </span>
              </div>
            </div>
          </>
        }
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: .8 }}
          className={`border-2 border-white/20 rounded-lg bg-white/20 backdrop-blur-md p-6 md:p-10 lg:p-15 text-sm h-10/12 w-11/12 md:w-130 flex justify-center flex-col items-center  gap-2`}>
          <div className="flex flex-col justify-center items-center">
            <Link href={'/'} className={`text-4xl md:text-5xl lg:text-6xl flex justify-center items-center font-bold`}>
              Vexa
            </Link>
          </div>
          <div className="flex justify-center items-center flex-col w-full md:w-3/4 gap-4 md:gap-6">
            <span className={`text-xl md:text-lg lg:text-4xl ${inter.className} font-bold `}>
              Welcome Back!
            </span>
            <span
              className={` flex flex-col gap-2 w-full justify-center items-center text-black ${inter.className} placeholder:text-white `}>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={userData.email}
                onChange={handleUserDataChange}
                className="w-11/12 border border-white/20 rounded-md p-2 focus:outline-none focus:ring-0 bg-white/50" />
              <span
                className="w-11/12 border border-white/20 rounded-md p-2 md: focus:outline-none focus:ring-0 bg-white/50 flex justify-between items-center gap-1">
                <input
                  name="password"
                  value={userData.password}
                  onKeyDown={handleKeyDown}
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
              {
                error != "" ?
                  <div className="w-fit whitespace-break-spaces h-fit border border-red-500 rounded-md p-1 focus:outline-none focus:ring-0 bg-red-500/30 text-center text-red-300">
                    {error}
                  </div>
                  :
                  <>
                  </>
              }
              <div className="flex flex-col md:flex-row md:gap-2 items-center justify-center text-xs md:text-sm text-white">
                Forgot password ?
                <span onClick={() => setResetPopUp(!resetPopUp)} className=" hover:text-white underline cursor-pointer">
                  Reset here
                </span>
              </div>
            </span>
            <span
              onClick={signInWithPassword}
              className="md:px-4 md:py-3 px-3 py-1 bg-[#0f6f3f] rounded-full text-base  md:text-sm border border-white/20 cursor-pointer hover:bg-[#052e1a] ">
              Log In
            </span>
          </div>

          <div className="flex items-center w-full my-4">
            <div className="flex-1 h-px bg-white/20" />
            <span className="px-3 text-sm text-white/60">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>
          <div className="flex justify-around items-center flex-col w-full gap-4">
            <div className="flex gap-2 w-full justify-around items-center ">
              <span
                onClick={signInWithGoogle}
                className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-white/80 cursor-pointer gap-2 text-black hover:bg-white">
                <FcGoogle size={25} />
                {
                  width > 650 &&
                  <span>
                    Continue with Google
                  </span>
                }
              </span>
              <span
                onClick={signInWithGithub}
                className=" flex justify-center items-center whitespace-nowrap p-2 rounded-md bg-black/80 cursor-pointer gap-2 text-white hover:bg-black">
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
                Sign up
              </Link>
            </div>
          </div>

        </motion.div>
      </div>
    </>
  );
}
