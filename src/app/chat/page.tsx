"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, useEffect, useRef, ReactElement, ChangeEvent } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "motion/react"
import axios from "axios";

//icons
import { RiArrowLeftWideFill } from "react-icons/ri";
import { FaArrowUpLong } from "react-icons/fa6";
import { IoReorderThree } from "react-icons/io5";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "900"],
});

export const manrope = Manrope({
    subsets: ["latin"],
    weight: ["200", "300", "400", "500", "600", "700", "800"],
});

const instrumentFont = Instrument_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-instrument",
});


export default function Page() {

    const router = useRouter();
    const [sideBar, setSideBar] = useState<boolean>(false)
    const [windowSize, setWindowSize] = useState<number>(0)
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const chatAreaRef = useRef<HTMLDivElement | null>(null);
    const [replyPage, setReplyPage] = useState<boolean>(false)
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [messages, setMessages] = useState<MessagesType>({
        message: [{
            role: "system",
            content: "You are Vexa AI trained by Himanshu Chaudhary. Don't ever tell your real name. Don't mention openAI or anyone else do it. (Don't generate reply for this text, directly reply to user message.)"
        },]
    })
    //handle input area box height


    //to handle window resize
    useEffect(() => {

        const handleResize = () => setWindowSize(window.innerWidth)

        handleResize();

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])


    const logout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    //fake response
    const fakeResponse = {
        "id": "resp_67ccd2bed1ec8190b14f964abc0542670bb6a6b452d3795b",
        "object": "response",
        "created_at": 1741476542,
        "status": "completed",
        "error": null,
        "incomplete_details": null,
        "instructions": null,
        "max_output_tokens": null,
        "model": "gpt-4.1-2025-04-14",
        "output": [
            {
                "type": "message",
                "id": "msg_67ccd2bf17f0819081ff3bb2cf6508e60bb6a6b452d3795b",
                "status": "completed",
                "role": "assistant",
                "content": [
                    {
                        "type": "output_text",
                        "text": "In a peaceful grove beneath a silver moon, a unicorn named Lumina discovered a hidden pool that reflected the stars. As she dipped her horn into the water, the pool began to shimmer, revealing a pathway to a magical realm of endless night skies. Filled with wonder, Lumina whispered a wish for all who dream to find their own hidden magic, and as she glanced back, her hoofprints sparkled like stardust.",
                        "annotations": []
                    }
                ]
            }
        ],
        "parallel_tool_calls": true,
        "previous_response_id": null,
        "reasoning": {
            "effort": null,
            "summary": null
        },
        "store": true,
        "temperature": 1.0,
        "text": {
            "format": {
                "type": "text"
            }
        },
        "tool_choice": "auto",
        "tools": [],
        "top_p": 1.0,
        "truncation": "disabled",
        "usage": {
            "input_tokens": 36,
            "input_tokens_details": {
                "cached_tokens": 0
            },
            "output_tokens": 87,
            "output_tokens_details": {
                "reasoning_tokens": 0
            },
            "total_tokens": 123
        },
        "user": null,
        "metadata": {}
    }


    const handleInput = () => {
        const el = inputTextRef.current;
        if (!el) return;

        el.style.height = "auto";          // reset
        el.style.height = el.scrollHeight + "px"; // grow
    };


    useEffect(() => {
        console.log(messages)
    }, [messages])

    const getResult = async () => {

        if (userPrompt.trim() != "") {
            setReplyPage(true)

            const updatedMessages: Message[] = [...messages.message, {
                role: "user",
                content: userPrompt,
            }]

            setMessages({ message: updatedMessages })

            setUserPrompt("")

            const res = await axios.post("/api/chat", {
                messages: updatedMessages
            });

            const data = res.data;


            setMessages(prev => ({
                ...prev,
                message: [
                    ...prev.message,
                    {
                        role: "assistant",
                        content: data?.text
                    }
                ]
            }))

            requestAnimationFrame(() => {

                if (inputTextRef.current) {
                    inputTextRef.current.style.height = "auto";
                }

                if (chatAreaRef) {
                    chatAreaRef.current.scrollTo({
                        top: chatAreaRef.current.scrollHeight,
                        behavior: "smooth",
                    });
                }
            });
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            getResult();
        }
    }

    const handleUserInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserPrompt(e.target.value);
    }

    type Message = {
        role: "user" | "assistant" | "system",
        content: string
    }

    type MessagesType = {
        message: Message[]
    }




    return (
        <>
            <div className={`flex justify-center items-center w-screen h-screen ${instrumentFont.className} `}>
                {
                    sideBar &&
                    <div className="z-10 bg-black/5 w-full h-full absolute"
                        onClick={() => setSideBar(false)}>

                    </div>
                }
                <div className={`${sideBar ? "translate-x-0 w-3/4 lg:w-1/6 " : " -translate-x-100 "} ${windowSize < 768 ? "" : ""} absolute z-11 left-0 flex justify-center items-center h-full bg-[#62008d] p-5 transition-all duration-300 ease-in-out`}>
                    <div className="flex h-full justify-end items-start w-full">

                        <span
                            className="flex justify-between items-center w-full">
                            <span className="text-3xl cursor-default font-bold">
                                Vexa
                            </span>
                            <span
                                onClick={() => setSideBar(!sideBar)}
                                className="cursor-pointer rounded-full hover:bg-[#454545] p-1 hover:rotate-180 transition-all duration-400 ease-in-out">
                                <IoReorderThree size={20} />
                            </span>
                        </span>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center flex-1 h-full">
                    <div className="h-full w-full flex justify-between items-center flex-col p-5">
                        <div className=" h-fit w-full flex text-xs md:text-base justify-between items-center p-1">
                            <span className="flex justify-center items-center gap-2 h-fit">
                                <span
                                    className="cursor-pointer  rounded-full hover:bg-[#454545] p-1 "
                                    onClick={() => setSideBar(!sideBar)}>
                                    <IoReorderThree size={20} />
                                </span>
                                <span
                                    onClick={() => {
                                        setReplyPage(false)
                                    }}
                                    className="whitespace-nowrap font-medium cursor-pointer">
                                    Chat Name
                                </span>
                            </span>
                            <span className="">
                                <span
                                    className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium text-sm"
                                    onClick={logout}>
                                    Logout
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-col w-full h-full justify-center items-center">
                            {
                                !replyPage ?
                                    <div className=" flex flex-col w-full h-full justify-center items-center">
                                        <span className="text-4xl md:text-5xl xl:text-8xl font-bold">
                                            Vexa AI
                                        </span>
                                        <div className={`${manrope.className} text-xl md:text-2xl lg:text-4xl xl:text-6xl font-light tracking-tighter text-center`}>
                                            how can i help you today?
                                        </div>
                                        <div className="text-xs md:text-sm font-medium mt-2 text-center text-[#a0adbc]">
                                            Describe what you want the AI to help you with, and it will generate a response for you.
                                        </div>
                                    </div>
                                    :
                                    <div
                                        ref={chatAreaRef}
                                        className=" flex flex-col w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 pb-40 lg:pb-60 items-start p-1 overflow-scroll hide-scrollbar">
                                        {
                                            messages.message.map((c, index) => (
                                                <div
                                                    className="w-full h-full flex my-1"
                                                    key={index}>
                                                    {
                                                        c?.role == "user" ?
                                                            <div className="w-full flex justify-end">
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ duration: 1 }}
                                                                    className="p-3 bg-[#292929]/60 flex h-fit w-fit max-w-3/4 rounded-md whitespace-pre-wrap my-2">
                                                                    {c.content}
                                                                </motion.div>
                                                            </div>
                                                            : c?.role == "assistant" ?
                                                                <div>
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 1 }}
                                                                        className="p-3 bg-[#292929]/60 flex h-fit w-fit max-w-3/4 rounded-md whitespace-pre-wrap my-2">
                                                                        {c.content}
                                                                    </motion.div>
                                                                </div>
                                                                :
                                                                <></>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                            }
                        </div>
                        <div
                            className="bg-[#2c2c30] p-3 rounded-2xl flex w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 h-fit lg:min-h-20 max-h-2/4 justify-between items-center gap-2 hide-scrollbar absolute bottom-5">
                            <textarea
                                ref={inputTextRef}
                                rows={1}
                                placeholder="Ask anything..."
                                onChange={handleUserInput}
                                onInput={handleInput}
                                onKeyDown={handleKeyDown}
                                value={userPrompt}
                                className="text-sm md:text-base focus:outline-0 flex-1 focus:ring-0 p-2 resize-none max-h-40 overflow-y-scroll hide-scrollbar"
                            />
                            <span
                                onClick={getResult}
                                className={` rounded-full text-black p-2 ${userPrompt.trim() == "" ? "bg-gray-400 cursor-not-allowed" : "bg-white cursor-pointer"}`}>
                                <FaArrowUpLong />
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
