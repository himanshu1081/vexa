"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, useRef, ChangeEvent, useContext, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "motion/react"
import { useParams, useSearchParams } from "next/navigation";
import { SidebarContext } from "../layout";
import axios from "axios";


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



export default function Page() {

    type Conversation = {
        id: string;
        user_id: string;
        created_at: string;
    };

    type Message = {
        role: "user" | "assistant" | "system",
        content: string,
        timestamp: string
    }

    type MessagesType = {
        message: Message[]
    }

    type ChatHistory = {
        id: string,
        user_id: string,
        title: string | null,
        created_at: string,
    }

    type MessageContextType = {
        messages: Message[];
        setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    };


    const router = useRouter();
    const param = useSearchParams();
    const q = param.get('q')
    const [isSending, setIsSending] = useState<boolean>(false);
    const [windowSize, setWindowSize] = useState<number>(0)
    const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
    const chatAreaRef = useRef<HTMLDivElement | null>(null);
    const [userPrompt, setUserPrompt] = useState<string>("");
    const { sidebar, setSidebar } = useContext(SidebarContext)
    const { chatid } = useParams() as { chatid?: string };
    const hasRun = useRef(false)
    const date = new Date()

    const SYSTEM_MESSAGE: Message = {
        role: "system",
        content: `You are a helpful, friendly AI assistant.
Explain things clearly and step-by-step when needed.
Be concise but not dry.
Use a natural, human tone.
If the user seems confused, slow down and clarify.
If a short answer is enough, keep it short.
Avoid unnecessary disclaimers.
`,
        timestamp: date.toString()
    };



    const [messages, setMessages] = useState<Message[]>([
        SYSTEM_MESSAGE,
    ]);

    //to handle window resize
    useEffect(() => {

        const handleResize = () => setWindowSize(window.innerWidth)

        handleResize();

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    useEffect(() => {
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
        console.log("Messages:", messages)
    }, [messages])



    useEffect(() => {
        if (!chatid) return;
        if (q) return; // skip when first-message flow

        const getMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("role, content, timestamp")
                .eq("conversation_id", chatid)
                .order("timestamp", { ascending: true });

            setMessages([SYSTEM_MESSAGE, ...(data ?? [])]);
        };

        getMessages();
    }, [chatid]);



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

    useEffect(() => {
        if (!q || !chatid) return;

        let cancelled = false;
        if (hasRun.current) return;
        hasRun.current = true;

        const run = async () => {
            const { data } = await saveMessage(chatid, "user", q);

            if (cancelled) return;

            const userMsg: Message = {
                role: "user",
                content: q,
                timestamp: data.timestamp,
            };

            setMessages(prev => [...prev, userMsg]);

            const snapshot = [SYSTEM_MESSAGE, userMsg];

            const res = await axios.post("/api/chat", {
                messages: snapshot.map(m => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            if (cancelled) return;


            const { data: aiData } = await saveMessage(
                chatid,
                "assistant",
                res.data.text
            );

            setMessages(prev => [
                ...prev,
                {
                    role: "assistant",
                    content: res.data.text,
                    timestamp: aiData.timestamp,
                },
            ]);

            router.replace(`/chat/${chatid}`);
        };

        run();

        return () => {
            cancelled = true;
        };
    }, [q, chatid]);

    const getReply = () => {
        if (isSending) return;
        if (!userPrompt.trim()) return;

        setIsSending(true);

        handleUserMessage();

        handleAiReply();


    };

    const handleUserMessage = async () => {
        const { data } = await saveMessage(chatid, "user", userPrompt);

        const updatedMessages: Message =
            { role: "user", content: userPrompt, timestamp: data.timestamp }

        setMessages(prev => [...prev, updatedMessages]);
        setUserPrompt("");

    }

    const handleAiReply = async () => {
        try {
            const res = await axios.post("/api/chat", {
                messages: [...messages, { role: "user", content: userPrompt }].map((m) => (
                    {
                        role: m.role,
                        content: m.content
                    }
                ))
            });
            console.log(res)

            //saving assistant message in database
            const { data } = await saveMessage(chatid!, "assistant", res.data.text);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: res.data?.text,
                timestamp: data?.timestamp
            }]);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSending(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key == 'Enter' && !e.shiftKey) {
            e.preventDefault()
            getReply();
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
                        <div className="h-fit w-full flex text-xs md:text-base justify-between items-start p-1">
                            <span className="flex justify-center items-center gap-2 h-fit">
                                <span
                                    className="cursor-pointer  rounded-full hover:bg-[#454545] p-1 "
                                    onClick={() => setSidebar(!sidebar)}>
                                    <IoReorderThree size={20} />
                                </span>
                                <span
                                    onClick={() => {
                                        router.push('/chat')
                                    }}
                                    className="whitespace-nowrap font-medium cursor-pointer bg-gray-200 hover:bg-gray-300 text-black text-sm py-1 px-2 rounded-lg">
                                    New Chat
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
                        <div
                            ref={chatAreaRef}
                            className=" flex flex-col w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 pb-40 mb-16 md:mb-17 lg:mb-20 xl:mb-21 items-end p-1 overflow-y-auto hide">
                            {
                                [...messages]?.map((c, index) => (
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
                                                        className="px-3 py-1 bg-[#3f004a] h-fit w-fit max-w-3/4 rounded-lg hide-scrollbar whitespace-pre-wrap my-2">
                                                        {renderBoldText(c.content)}
                                                    </motion.div>
                                                </div>
                                                : c?.role == "assistant" ?
                                                    <div className="h-fit w-fit overflow-x-auto hide-scrollbar max-w-4/4 md:max-w-3/4 bg-[#6f0062]/60 rounded-lg my-2">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1 }}
                                                            className="px-3 py-1  flex flex-col gap-1 lg:gap-2 h-fit w-fit whitespace-break-spaces my-2 ">
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
                                onClick={!isSending && userPrompt.trim() ? getReply : undefined}
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
