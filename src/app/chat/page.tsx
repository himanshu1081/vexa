"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, createContext, useRef, ChangeEvent, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "motion/react"
import { SidebarContext } from "./layout";
import { chatHistoryContext } from "./layout";

//icons
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

type Message = {
    role: "user" | "assistant" | "system",
    content: string,
    timestamp: string
}
type MessageContextType = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};


export default function Page() {

    type Conversation = {
        id: string;
        user_id: string;
        created_at: string;
    };

    const { chatHistory, setChatHistory } = useContext(chatHistoryContext)
    const { sidebar, setSidebar } = useContext(SidebarContext)

    const router = useRouter();
    const chatAreaRef = useRef<HTMLDivElement | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [conversation, setConversation] = useState<Conversation | null>(null);

    //creating a conversation

    //     {
    //     "id": "d6b4630b-6956-4c44-8831-5dde615b1d43",
    //     "user_id": "1ebed8d3-9dca-4e6e-826a-7317d9ccbdf3",
    //     "created_at": "2026-01-10T21:57:52.650091+00:00",
    //     "title": "hi"
    // }
    const createConversation = async () => {

        const { data: sessionData } = await supabase.auth.getSession();
        console.log("session:", sessionData);

        if (conversation) return conversation;
        try {
            const { data: conversation, error } = await supabase.from('conversations').insert({ "title": userPrompt }).select().single();
            console.log("Conversation: ", conversation)
            setConversation(conversation)
            setChatHistory(prev => ([{
                id: conversation.id,
                user_id: conversation.user_id,
                title: conversation.title,
                created_at: conversation.created_at,
            }, ...prev]))
            return conversation
        } catch (error) {
            console.error(error.message)
        }
    }

    const logout = async () => {
        await supabase.auth.signOut()
        router.push("/")
    }

    const handleInput = () => {
        const el = inputTextRef.current;
        if (!el) return;

        el.style.height = "auto";          // reset
        el.style.height = el.scrollHeight + "px"; // grow
    };

    const redirectPage = async () => {

        if (isSending) return;
        if (!userPrompt.trim()) return;

        setIsSending(true);

        const convo = await createConversation();
        if (!convo) {
            setIsSending(false)
            return;
        }
        router.push(`chat/${convo.id}?q=${encodeURIComponent(userPrompt)}`)

        //saving user message in database

    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            redirectPage();
        }
    }

    const handleUserInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserPrompt(e.target.value);
    }

    return (
        <>

            <div className={`flex justify-center items-center w-screen h-screen ${instrumentFont.className} `}>
                <div className="flex flex-col justify-center items-center flex-1 h-full">
                    <div className="h-full w-full flex justify-between items-center flex-col p-5">
                        <div className=" h-fit w-full flex text-xs md:text-base justify-between items-center p-1">
                            <span className="flex justify-center items-center gap-2 h-fit">
                                <span
                                    className="cursor-pointer  rounded-full hover:bg-[#454545] p-1 "
                                    onClick={() => setSidebar(!sidebar)}>
                                    <IoReorderThree size={20} />
                                </span>
                            </span>
                            <span>
                                <span
                                    className="cursor-pointer p-2 bg-red-500 hover:bg-red-600 rounded-lg font-medium text-sm"
                                    onClick={logout}>
                                    Logout
                                </span>
                            </span>
                        </div>
                        <div className="flex flex-col w-full h-full justify-center items-center">
                            <div className=" flex flex-col w-full h-full justify-center items-center">
                                <motion.span
                                    initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                    animate={{ y: 0, opacity: 1, filter: 0 }}
                                    transition={{ duration: .5, ease: "easeInOut" }}
                                    className="text-4xl md:text-5xl xl:text-8xl font-bold">
                                    Vexa AI
                                </motion.span>
                                <motion.div
                                    initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                    animate={{ y: 0, opacity: 1, filter: 0 }}
                                    transition={{ duration: .5, delay: .3 }}
                                    className={`${manrope.className} text-xl md:text-2xl lg:text-4xl xl:text-6xl font-light tracking-tighter text-center`}>
                                    how can i help you today?
                                </motion.div>
                                <motion.div
                                    initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                    animate={{ y: 0, opacity: 1, filter: 0 }}
                                    transition={{ duration: .5, delay: .5 }}
                                    className="text-xs md:text-sm font-medium mt-2 text-center text-[#a0adbc]">
                                    Describe what you want the AI to help you with, and it will generate a response for you.
                                </motion.div>
                            </div>
                        </div>
                        <div
                            className="bg-[#2c2c30] backdrop-blur-2xl shadow-2xl border-2 border-black/20 p-3 rounded-2xl flex w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 h-fit lg:min-h-20 max-h-2/4 justify-between items-center gap-2 overflow-scroll hide-scrollbar absolute bottom-5">
                            <textarea
                                ref={inputTextRef}
                                rows={1}
                                placeholder="Ask anything..."
                                onChange={handleUserInput}
                                onInput={handleInput}
                                onKeyDown={!isSending ? handleKeyDown : undefined}
                                value={userPrompt}
                                className="text-sm md:text-base focus:outline-0 flex-1 focus:ring-0 p-2 resize-none max-h-40 overflow-y-scroll hide-scrollbar"
                            />
                            <span
                                onClick={!isSending && userPrompt.trim() ? redirectPage : undefined}
                                className={`rounded-full text-black p-2 ${isSending || !userPrompt.trim()
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-white cursor-pointer"
                                    }`}
                            >
                                <FaArrowUpLong />
                            </span>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
