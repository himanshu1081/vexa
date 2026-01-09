"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, createContext, useRef, ChangeEvent, useContext, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "motion/react"
import axios from "axios";
import { MessageContext } from "./layout";
import { SidebarContext } from "./layout";
import { useParams } from "next/navigation";

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


    const { sidebar, setSidebar } = useContext(SidebarContext)

    const router = useRouter();
    const [isSending, setIsSending] = useState<boolean>(false);
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const chatAreaRef = useRef<HTMLDivElement | null>(null);
    const [replyPage, setReplyPage] = useState<boolean>(false)
    const [userPrompt, setUserPrompt] = useState<string>("");
    const [conversation, setConversation] = useState<Conversation | null>(null);

    const context = useContext(MessageContext);

    const messages: Message[] = context?.messages ?? [];
    const setMessages = context?.setMessages ?? (() => { });

    useEffect(() => {
        console.log("CONTEXT messages:", messages);
    }, [messages]);

    //creating a conversation
    const createConversation = async () => {

        const { data: sessionData } = await supabase.auth.getSession();
        console.log("session:", sessionData);

        if (conversation) return conversation;
        try {
            const { data: conversation, error } = await supabase.from('conversations').insert({ "title": userPrompt }).select().single();
            setConversation(conversation)

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

    function renderBoldText(text: string) {
        // Step 1: split text by new lines
        const lines = text.split("\n");

        return lines.map((line, lineIndex) => {
            // Step 2: split each line by *** ***
            const parts = line.split(/\*\*(.*?)\*\*/g);

            return (
                <div key={lineIndex}>
                    {parts.map((part, partIndex) =>
                        partIndex % 2 === 1 ? (
                            <strong key={partIndex}>{part}</strong>
                        ) : (
                            part
                        )
                    )}
                </div>
            );
        });
    }

    const saveMessage = async (conversation_id: string, role: "user" | "assistant" | "system"
        , content: string) => {

        try {
            const res = (await supabase.from('messages').insert({ "conversation_id": conversation_id, "role": role, "content": content }).select().single())
            return res;
        }
        catch (error) {
            console.error(error.message)
        }
    }

    const getResult = async () => {

        if (isSending) return;
        if (!userPrompt.trim()) return;

        setIsSending(true);

        const convo = await createConversation();
        if (!convo) {
            setIsSending(false)
            return;
        }

        //saving user message in database
        const { data } = await saveMessage(convo.id, "user", userPrompt);

        const newMessage: Message = {
            role: "user",
            content: userPrompt,
            timestamp: data.timestamp
        };


        setUserPrompt("");
        setMessages(prev => [
            ...prev,
            newMessage
        ]);
        router.push(`chat/${convo.id}`)





        // try {
        //     const res = await axios.post("/api/chat", {
        //         messages: [...messages, newMessage]
        //     });

        //     //saving assistant message in database
        //     await saveMessage(convo.id, "assistant", res.data.text);
        //     setMessages(prev => ([...prev, { role: "assistant", content: res?.data?.text }]))

        // } catch (err) {
        //     console.error(err);
        // } finally {
        //     setIsSending(false);
        // }


        // requestAnimationFrame(() => {
        //     if (inputTextRef.current) {
        //         inputTextRef.current.style.height = "auto";
        //     }
        //     if (chatAreaRef) {
        //         chatAreaRef.current.scrollTo({
        //             top: chatAreaRef.current.scrollHeight,
        //             behavior: "smooth",
        //         });
        //     }
        // });
    };


    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            getResult();
        }
    }

    const handleUserInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserPrompt(e.target.value);
    }



    return (
        <>
            <MessageContext.Provider
                value={{ messages, setMessages }}
            >

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
                                    <span
                                        onClick={() => {
                                            setReplyPage(false)
                                        }}
                                        className="whitespace-nowrap font-medium cursor-pointer">
                                        {conversation ? "" : ""}
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
                                        :
                                        <div
                                            ref={chatAreaRef}
                                            className=" flex flex-col w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 pb-40 mb-30 items-end p-1 overflow-y-auto hide">
                                            {
                                                [...messages]?.reverse().map((c, index) => (
                                                    <div
                                                        className="w-full h-fit flex my-1"
                                                        key={index}>
                                                        {
                                                            c?.role == "user" ?
                                                                <div className="w-full flex justify-end h-fit">
                                                                    <motion.div
                                                                        initial={{ opacity: 0, y: 20 }}
                                                                        animate={{ opacity: 1, y: 0 }}
                                                                        transition={{ duration: 1 }}
                                                                        className="p-3 bg-[#0d00ff]/60 flex h-fit w-fit max-w-3/4 rounded-2xl whitespace-pre-wrap my-2">
                                                                        {renderBoldText(c.content)}
                                                                    </motion.div>
                                                                </div>
                                                                : c?.role == "assistant" ?
                                                                    <div className="h-fit w-fit overflow-x-auto max-w-4/4 md:max-w-3/4 bg-[#6f0062]/60 rounded-2xl">
                                                                        <motion.div
                                                                            initial={{ opacity: 0, y: 20 }}
                                                                            animate={{ opacity: 1, y: 0 }}
                                                                            transition={{ duration: 1 }}
                                                                            className="p-3 flex flex-col gap-1 lg:gap-2 h-fit w-fit whitespace-break-spaces my-2 ">
                                                                            {renderBoldText(c.content)}
                                                                        </motion.div>
                                                                    </div>
                                                                    :
                                                                    <>
                                                                    </>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                }
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
                                    onClick={!isSending && userPrompt.trim() ? getResult : undefined}
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
            </MessageContext.Provider>
        </>
    );
}
