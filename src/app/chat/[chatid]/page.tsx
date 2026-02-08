"use client";
import { Inter, Instrument_Sans } from "next/font/google";
import { Manrope } from "next/font/google";
import { useState, useRef, ChangeEvent, useContext, useEffect, Children } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react"
import { useParams, useSearchParams } from "next/navigation";
import { SidebarContext } from "../layout";
import SkeletonHistory from "../../../components/SkeletonHistory";
import axios from "axios";
import { chatHistoryContext } from "../layout";
import { UserInfoContext } from "../layout";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import CrazyLoader from "../../../components/CrazyLoader";

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

    const userInfo = useContext(UserInfoContext)
    const userAvatar = userInfo?.userInfo?.user_metadata?.avatar_url;
    const userName = userInfo?.userInfo?.identities[0]?.identity_data?.name
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
    const [searching, setSearching] = useState<boolean>(false)

    const SYSTEM_MESSAGE: Message = {
        role: "system",
        content: `You are a helpful, friendly AI assistant.
        Reply in under 700 tokens.If they ask you to make build something like a website then you can use as much as you want but not more than 19000. Be concise.
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

        setSearching(true)

        handleAiReply();


    };

    const handleUserMessage = async () => {
        const date = Date.now()
        console.log(date.toLocaleString())
        console.log(typeof (date))
        const { data } = await saveMessage(chatid, "user", userPrompt);
        console.log(data.timestamp)
        console.log(typeof (data.timestamp))

        const updatedMessages: Message = { role: "user", content: userPrompt, timestamp: data.timestamp }

        setMessages(prev => [...prev, updatedMessages]);
        setUserPrompt("");


        requestAnimationFrame(() => {
            scrollDown()
        })
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

            //saving assistant message in database
            const { data } = await saveMessage(chatid!, "assistant", res.data.text);
            setMessages(prev => [...prev, {
                role: "assistant",
                content: res.data?.text,
                timestamp: data?.timestamp
            }]);
            setSearching(false);
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
            {/* ROOT LAYOUT */}
            <div
                className={`relative flex w-screen h-screen  ${instrumentFont.className}`}
            >
                {/* BACKDROP FOR SIDEBAR (MOBILE ONLY) */}
                {sidebar && (
                    <div
                        className="fixed inset-0 z-10 bg-black/50 lg:hidden"
                        onClick={() => setSidebar(false)}
                    />
                )}

                {/* SIDEBAR */}
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
                                                                    <HistoryList clickedId={c.id} t={c.title} />
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
                                        <div className="p-2 border-t border-white/10 flex items-center justify-center gap-2">
                                            <span className="">
                                                <img src={userAvatar} alt="user-avatar" className="object-cover w-8 h-7 md:h-8 md:w-8 rounded-full" />
                                            </span>
                                            <span className="line-clamp-1">
                                                {userName}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>}
                </AnimatePresence>

                {/* MAIN CHAT AREA */}
                <div className={`flex flex-col flex-1 relative ${sidebar ? "lg:max-w-3/4" : "max-w-6/6"} `}>
                    {/* HEADER */}
                    <div className="flex items-center justify-between p-3 text-sm border-b border-white/10">
                        <div className="flex items-center gap-2">
                            <span
                                className="p-1 rounded-full hover:bg-[#454545] cursor-pointer"
                                onClick={() => setSidebar(!sidebar)}
                            >
                                <FiSidebar size={20} />
                            </span>

                            <span
                                onClick={() => router.push("/chat")}
                                className="cursor-pointer bg-gray-200 hover:bg-gray-300 text-black px-3 py-1 rounded-lg"
                            >
                                New Chat
                            </span>
                        </div>

                        <span
                            onClick={logout}
                            className="cursor-pointer bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg"
                        >
                            Logout
                        </span>
                    </div>

                    {/* SCROLLABLE CHAT BODY (ONLY SCROLLER) */}
                    <div
                        ref={chatAreaRef}
                        className={`flex-1 overflow-y-auto px-1 lg:px-3 ${sidebar ? "lg:px-34 xl:px-50" : "sm:px-22 md:px-24 lg:px-54 xl:px-96"}  py-4 space-y-4 text-sm lg:text-base`}
                    >
                        {hasFetchedAll ? (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-xs text-gray-500"
                            >
                                <div className="flex-1 h-px bg-gray-500" />
                                <span>That's all</span>
                                <div className="flex-1 h-px bg-gray-500" />
                            </motion.div>
                        ) : (
                            <div className="text-center text-xs text-gray-400">Loading...</div>
                        )}

                        {messages.map((c, index) => (
                            <div key={index} className="w-full overflow-hidden">
                                {c.role === "user" ?
                                    (
                                        <div className="flex justify-end">
                                            <div className="bg-[#262327] px-3 py-2 rounded-lg max-w-[50%]">
                                                <ReactMarkdown>{c.content.trim()}</ReactMarkdown>
                                            </div>
                                        </div>
                                    ) :
                                    c.role == "assistant" ?
                                        (
                                            <div className="flex justify-start">
                                                <div className=" px-3 py-2 rounded-lg max-w-4/4">
                                                    <ReactMarkdown remarkPlugins={[remarkGfm]}
                                                        components={{
                                                            code({ node, inline, className, children, ...props }: any) {
                                                                if (inline) {
                                                                    return (
                                                                        <code className="text-white rounded inline" {...props}>
                                                                            {children}
                                                                        </code>
                                                                    )
                                                                }

                                                                return (
                                                                    <pre className="bg-green-900/50 p-4 m-1 rounded-md overflow-auto">
                                                                        <code className="text-white">{children}</code>
                                                                    </pre>
                                                                )
                                                            },
                                                            p({ children }) {
                                                                return <div className="my-2">{children}</div>;
                                                            },
                                                            table({ node, inline, className, children, ...props }: any) {
                                                                return (
                                                                    <table className="overflow-auto rounded-xl bg-[#181818]/50 text-sm w-full my-4">
                                                                        {children}
                                                                    </table>
                                                                )
                                                            }
                                                            ,
                                                            th({ node, inline, className, children, ...props }: any) {
                                                                return (
                                                                    <th className=" border border-gray-300 p-2" {...props}>
                                                                        {children}
                                                                    </th>
                                                                )
                                                            },
                                                            td({ node, inline, className, children, ...props }: any) {
                                                                return (
                                                                    <td className="p-2 border rounded-2xl">
                                                                        {children}
                                                                    </td>
                                                                )
                                                            },
                                                            tr({ node, inline, className, children, ...props }: any) {
                                                                return (
                                                                    <tr className="p-2">
                                                                        {children}
                                                                    </tr>
                                                                )
                                                            },
                                                            hr({ node, ...props }) {
                                                                return (
                                                                    <hr className="my-6 border-gray-700" {...props} />
                                                                )
                                                            },
                                                        }
                                                        }
                                                    >
                                                        {c.content}
                                                    </ReactMarkdown>
                                                </div>
                                            </div>
                                        ) :
                                        <div></div>
                                }
                            </div>
                        ))}
                        {
                            !searching &&
                            <div className="p-2 ml-5">
                                <CrazyLoader />
                            </div>
                        }
                    </div>

                    {/* INPUT BAR (STICKY & RESPONSIVE) */}
                    <div className="sticky bottom-0 w-full pb-5">
                        <div className={`rounded-lg mx-auto flex items-end gap-2 w-11/12 ${sidebar ? "" : "lg:w-3/6"}  bg-[#2c2c30] p-5 border border-white/10`}>
                            <textarea
                                ref={inputTextRef}
                                rows={1}
                                placeholder="Ask anything..."
                                value={userPrompt}
                                onChange={handleUserInput}
                                onInput={handleInput}
                                onKeyDown={!isSending ? handleKeyDown : undefined}
                                className="
                flex-1 resize-none max-h-40
                p-2 rounded-lg
                text-sm md:text-base
                focus:outline-none
                overflow-y-auto
              "
                            />

                            <button
                                disabled={isSending || !userPrompt.trim()}
                                onClick={!isSending ? getReply : undefined}
                                className="
                p-3 rounded-lg
                bg-[#00CC66]
                disabled:opacity-50
                disabled:cursor-not-allowed
              "
                            >
                                <FaArrowUpLong />
                            </button>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
}

