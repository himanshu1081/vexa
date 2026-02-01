"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, useRef, ChangeEvent, useContext, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react"
import { useParams, useSearchParams } from "next/navigation";
import { SidebarContext } from "../layout";
import SkeletonHistory from "../../../components/SkeletonHistory";
import axios from "axios";
import { chatHistoryContext } from "../layout";
import ReactMarkdown from "react-markdown";


//icons
import { FaArrowUpLong } from "react-icons/fa6";
import { FiSidebar } from "react-icons/fi";
import { FaArrowDown } from "react-icons/fa6";
import { HiOutlinePencilSquare } from "react-icons/hi2";
import HistoryList from "../../../components/HistoryList";
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
    const hasRun = useRef<boolean>(false)
    const [hasFetchedAll, setHasFetchedAll] = useState<boolean>(false);
    const date = new Date()
    const hasInitialLoaded = useRef<boolean>(false);
    const [IsScrolledUp, setIsScrolledUp] = useState(false)
    const { chatHistory, setChatHistory } = useContext(chatHistoryContext)

    const SYSTEM_MESSAGE: Message = {
        role: "system",
        content: `You are a helpful, friendly AI assistant.
        Reply in under 700 tokens. Be concise.
    Explain things clearly and step-by-step when needed.
    Be concise but not dry.
    Use a natural, human tone.
    If the user seems confused, slow down and clarify.
    If a short answer is enough, keep it short.
    Avoid unnecessary disclaimers.
    You are Vexa which is an AI assistant made my Himanshu Chaudhary which is build on different API's such as chatgpt,claude and many more.
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

    //to see if user has scrolled upwards,if yes then show them scroll down button
    useEffect(() => {
        const area = chatAreaRef.current;
        if (!area) return;

        const handleScroll = () => {
            const threshold = area.clientHeight / 8;

            const isUp =
                area.scrollHeight - area.scrollTop - area.clientHeight > threshold;

            setIsScrolledUp(isUp);
        };

        area.addEventListener("scroll", handleScroll);
        return () => area.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        requestAnimationFrame(() => {
            if (inputTextRef.current) {
                inputTextRef.current.style.height = "auto";
            }
        });
    }, [messages])

    //infinite scroll to fetch chat only when user scrolls onto the top
    const isFetching = useRef<boolean>(false);
    useEffect(() => {
        if (!hasInitialLoaded.current) return;
        const el = chatAreaRef.current;
        const prevScrollHeight = el.scrollHeight;
        if (!el) return
        const fetchData = async () => {
            if (hasFetchedAll) return
            if (isFetching.current) return
            if (el.scrollTop < 50) {
                console.log(messages.length)
                if (messages.length == 0) return
                const cursor = messages[0]?.timestamp
                const isoCursor = new Date(cursor).toISOString()
                isFetching.current = true
                const { data } = await supabase
                    .from("messages")
                    .select("role, content, timestamp")
                    .eq("conversation_id", chatid)
                    .lt("timestamp", isoCursor)
                    .order("timestamp", { ascending: false })
                    .limit(10)

                if (data?.length < 10) {
                    setHasFetchedAll(true)
                }
                requestAnimationFrame(() => {
                    el.scrollTop = el.scrollHeight - prevScrollHeight;
                });
                console.log("Response :", data?.reverse().length)
                setMessages(prev => ([...data?.reverse(), ...prev]))
                isFetching.current = false
            }
        }
        el.addEventListener('scroll', fetchData)
        return () => el.removeEventListener('scroll', fetchData)
    }, [messages])

    useEffect(() => {
        console.log("messages : ", messages.length)

    }, [messages])

    useEffect(() => {

        if (!chatid) return;
        // if (q) return; // skip when first-message flow

        const getMessages = async () => {
            const { data } = await supabase
                .from("messages")
                .select("role, content, timestamp")
                .eq("conversation_id", chatid)
                .order("timestamp", { ascending: false })
                .limit(10);
            setMessages([...(data ?? []).reverse()]);
            hasInitialLoaded.current = true
            if (data.length < 10) {
                setHasFetchedAll(true)
            }
            requestAnimationFrame(() => {
                if (!chatAreaRef.current) return;
                chatAreaRef.current.scrollTop =
                    chatAreaRef.current.scrollHeight;
            });
        };

        getMessages();
    }, [chatid]);

    const scrollDown = () => {
        chatAreaRef.current.scrollTo({
            top: chatAreaRef.current.scrollHeight,
            behavior: "smooth",
        });
        setIsScrolledUp(false)
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

    const styleReply = (text: string) => {
        let textarr = text.split(".")
        console.log(textarr)
        return textarr.map((t, index) => {
            if (t.startsWith("###")) {
                return (
                    <div key={index} className="text-xl font-bold">
                        {t.slice(3)}
                    </div>
                );
            }

            if (t.startsWith("##")) {
                return (
                    <div key={index} className="text-lg font-bold">
                        {t.slice(2)}
                    </div>
                );
            }

            if (/^\*\*(.*?)\*\*$/.test(t)) {
                return (
                    <div className="font-bold">
                        {t.slice(2, - 2)}
                    </div>
                )
            }

            return (
                <div key={index} className="text-sm lg:text-base">
                    {t}
                </div>
            );
        });

    }

    function renderBoldText(text: string) {
        // Step 1: split text by new lines
        let lines = text.split("\n");
        lines = text.split("<br>");
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
            console.log("All messages : ", res)
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
            if (cancelled) return;

            const { data } = await saveMessage(chatid, "user", q);


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

        scrollDown()

    }

    const handleAiReply = async () => {
        try {
            const res = await axios.post("/api/chat", {
                messages: [SYSTEM_MESSAGE, ...messages, { content: userPrompt, role: "user" }].map((m) => (
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
            requestAnimationFrame(() => {
                scrollDown()
            })
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
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`h-full w-3/4 md:w-2/6 xl:w-1/4 absolute lg:relative z-10 text-sm`}>
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
                                            <div className="flex-1 pt-1 pb-10 h-full overflow-y-auto">
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
                        <div className="h-fit w-full flex text-xs md:text-sm justify-between items-start p-3">
                            <span className="flex justify-center items-center gap-2 h-fit">
                                <span
                                    className="cursor-pointer  rounded-full hover:bg-[#454545] p-1 "
                                    onClick={() => setSidebar(!sidebar)}>
                                    <FiSidebar size={20} />
                                </span>
                                <span
                                    onClick={() => {
                                        router.push('/chat')
                                    }}
                                    className="whitespace-nowrap font-medium cursor-pointer bg-gray-200 hover:bg-gray-300 text-black  py-1 px-2 rounded-lg">
                                    New Chat
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
                        <div
                            ref={chatAreaRef}
                            className={`h-full w-full flex flex-col justify-start items-start ${sidebar ? "px-2 sm:px-26 lg:px-32 xl:px-58" : "px-2 sm:px-26 lg:px-64 xl:px-96"}  pb-40 mb-16 md:mb-17 lg:mb-20 xl:mb-23 p-1 lg:p-0 overflow-y-auto`}>

                            {
                                hasFetchedAll == true ?
                                    <motion.div
                                        initial={{ y: -20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: .5 }}
                                        viewport={{ once: true }}
                                        className="flex items-center justify-between w-full gap-2 text-gray-500 text-xs">
                                        <div className="flex-1 h-px bg-gray-500" />
                                        <span>That's All</span>
                                        <div className="flex-1 h-px bg-gray-500" />
                                    </motion.div>
                                    :

                                    <motion.span
                                        className="w-full text-center text-transparent bg-clip-text bg-linear-to-r from-gray-400 via-white to-gray-400"
                                        initial={{ backgroundPosition: "200% 0%" }}
                                        animate={{ backgroundPosition: "-200% 0%" }}
                                        transition={{
                                            duration: 4,
                                            repeat: Infinity,
                                            ease: "linear",
                                        }}
                                        style={{ backgroundSize: "200% 100%" }}
                                    >
                                        Loading...
                                    </motion.span>
                            }
                            {
                                [...messages]?.map((c, index) => (
                                    <div
                                        className="w-full h-fit flex text-sm lg:text-base"
                                        key={index}>
                                        {
                                            c?.role == "user" ?
                                                <div className="w-full flex flex-col justify-end h-fit gap-5">
                                                    <div className=" border-gray-900 w-full py-2" />
                                                    <div className="w-full flex justify-end h-fit">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1 }}
                                                            className="px-3 py-1 bg-[#262327] h-fit w-fit max-w-3/4 rounded-lg hide-scrollbar whitespace-pre-wrap my-2">
                                                            <ReactMarkdown>{c.content}</ReactMarkdown>

                                                        </motion.div>
                                                    </div>
                                                </div>
                                                : c?.role == "assistant" ?
                                                    <div className="h-fit w-fit overflow-x-auto hide-scrollbar max-w-4/4 md:max-w-3/4 bg-[#171717] rounded-lg my-2">
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 20 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                            transition={{ duration: 1 }}
                                                            className="px-3 py-1  flex flex-col gap-1 lg:gap-2 h-fit w-fit whitespace-break-spaces my-2 ">
                                                            <ReactMarkdown>{c.content}</ReactMarkdown>
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
                        <div className="flex items-center justify-center w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/4 ">
                            {
                                IsScrolledUp &&
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="fixed p-2 bg-gray-900 hover:bg-gray-600 cursor-pointer border-black/20 border rounded-full bottom-30"
                                    onClick={scrollDown}>
                                    <FaArrowDown />
                                </motion.div>
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
            </div >
        </>
    );
}

