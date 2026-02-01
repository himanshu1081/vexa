"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, createContext, useRef, ChangeEvent, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react"
import { SidebarContext } from "./layout";
import { chatHistoryContext } from "./layout";
import SkeletonHistory from "../../components/SkeletonHistory";

//icons
import { FaArrowUpLong } from "react-icons/fa6";
import { FiSidebar } from "react-icons/fi";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import HistoryList from "../../components/HistoryList";
import { RxCross2 } from "react-icons/rx";

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
    const [windowSize, setWindowSize] = useState<number>(0)
    const router = useRouter();
    const chatAreaRef = useRef<HTMLDivElement | null>(null);
    const [isSending, setIsSending] = useState<boolean>(false);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [conversation, setConversation] = useState<Conversation | null>(null);

    // creating a conversation
    const createConversation = async () => {

        const { data: sessionData } = await supabase.auth.getSession();
        // if(sessionData.length==0){
        //     router.push("/login")
        // }
        console.log("session here:", sessionData);

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

    useEffect(() => {

        const handleResize = () => setWindowSize(window.innerWidth)

        handleResize();

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <>

            <div className={`flex justify-between items-center w-screen h-screen ${instrumentFont.className} `}>
                {
                    sidebar &&
                    <div className="z-10 bg-black/50 w-full h-full absolute cursor-pointer lg:opacity-0 lg:pointer-events-none"
                        onClick={() => setSidebar(false)}>

                    </div>
                }
                <AnimatePresence>
                    {sidebar &&
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: -0, opacity: 1 }}
                            transition={{ duration: .2 }}
                            exit={{ x: -20, opacity: 0 }}
                            className={`h-full w-3/4 md:w-2/6 lg:w-1/4 absolute lg:relative z-10 text-sm`}>
                            <div className="flex flex-col justify-between h-screen items-start w-full">
                                <div className="flex flex-col w-full h-full gap-5 justify-between items-center p-4">
                                    <div
                                        className="flex justify-between items-center w-full bg-[#181818] p-4 rounded-2xl">
                                        <span className="text-3xl cursor-default font-bold">
                                            Vexa
                                        </span>
                                        <span
                                            onClick={() => setSidebar(!sidebar)}
                                            className="cursor-pointer rounded-full hover:bg-[#242424] p-1 hover:rotate-180 transition-all duration-400 ease-in-out">
                                            <RxCross2 size={20} />
                                        </span>
                                    </div>
                                    <div className="bg-[#181818] w-full flex-1 flex flex-col rounded-2xl p-4 overflow-hidden">
                                        <div
                                            onClick={() => {
                                                setSidebar(false)
                                                router.push('/chat')
                                            }}
                                            className="hover:bg-[#242424] cursor-pointer rounded-md w-full p-2 flex gap-2 justify-start items-center">
                                            <HiOutlinePencilSquare size={20}
                                            />
                                            <span>
                                                New chat
                                            </span>
                                        </div>
                                        {sidebar && <div className="w-full mt-2 flex-1 overflow-hidden rounded-md">
                                            <div className="text-xs p-2 text-white/60 border-b border-white/10">
                                                Chat History
                                            </div>
                                            <div className="flex-1 pb-10 h-full overflow-y-auto">
                                                {(chatHistory.length !== 0) ?
                                                    <div className="inset-shadow-2xs">
                                                        {
                                                            chatHistory?.map((c, index) => (
                                                                <div key={c.id}>
                                                                    <HistoryList clickedId={c.id} title={c.title} />
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                    :
                                                    <div className="flex flex-col justify-center items-start w-full flex-1 gap-2 mt-2">
                                                        <SkeletonHistory />
                                                        <SkeletonHistory />
                                                        <SkeletonHistory width={"3/4"} />
                                                    </div>
                                                }
                                            </div>

                                        </div>}
                                        <div className="p-2 border-t border-white/10">
                                            Himanshu Chaudhary
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>}
                </AnimatePresence>

                <div className="flex flex-col justify-center items-center w-full h-full">
                    <div className="h-full w-full flex justify-between items-center flex-col p-1">
                        <div className="h-fit w-full flex text-xs md:text-sm justify-between items-start p-2">
                            <span className={`flex justify-center items-center gap-2 h-fit ${sidebar?"opacity-0":""}`}>
                                <span
                                    className="cursor-pointer  rounded-full hover:bg-[#454545] p-1 "
                                    onClick={() => setSidebar(!sidebar)}>
                                    <FiSidebar size={20} />
                                </span>
                            </span>
                            <span className="w-fit h-full flex items-center justify-center">
                                <span
                                    className="cursor-pointer px-2 py-1 bg-red-500 hover:bg-red-600 rounded-lg font-medium"
                                    onClick={logout}>
                                    Logout
                                </span>
                            </span>
                        </div>
                        {/* Chat area */}
                        <div className="h-full w-full flex items-center  justify-center">
                            <div className="flex flex-col w-full h-full justify-center items-center">
                                <div className=" flex flex-col w-full h-full justify-center items-center">
                                    <motion.span
                                        initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                        animate={{ y: 0, opacity: 1, filter: 0 }}
                                        transition={{ duration: .5, ease: "easeInOut" }}
                                        className="text-4xl md:text-6xl xl:text-8xl font-bold">
                                        Vexa AI
                                    </motion.span>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                        animate={{ y: 0, opacity: 1, filter: 0 }}
                                        transition={{ duration: .5, delay: .3 }}
                                        className={`${manrope.className} text-xl md:text-3xl lg:text-4xl xl:text-6xl font-light tracking-tighter text-center`}>
                                        how can i help you today?
                                    </motion.div>
                                    <motion.div
                                        initial={{ y: 20, opacity: 0, filter: "blur(12px)" }}
                                        animate={{ y: 0, opacity: 1, filter: 0 }}
                                        transition={{ duration: .5, delay: .5 }}
                                        className="text-xs lg:text-sm font-medium mt-2 text-center text-[#a0adbc]">
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
                                    className={`rounded-lg text-black p-3 ${isSending || !userPrompt.trim()
                                        ? "bg-[#00CC66] cursor-not-allowed"
                                        : "bg-[#00CC66] cursor-pointer"
                                        }`}
                                >
                                    <FaArrowUpLong />
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}
