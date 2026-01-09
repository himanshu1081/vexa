"use client"
import "../../styles/background.css";
import SkeletonHistory from "../../components/SkeletonHistory";
import { useState, useEffect, createContext } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { Inter, Instrument_Sans } from "next/font/google";

//icons
import { IoReorderThree } from "react-icons/io5";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "900"],
});

type SidebarContextType = {
    sidebar: boolean;
    setSidebar: React.Dispatch<React.SetStateAction<boolean>>;
};

type ChatHistory = {
    id: string,
    user_id: string,
    title: string | null,
    created_at: string,
}

type ChatHistoryContextType = {
    chatHistory: ChatHistory[];
    setChatHistory: React.Dispatch<React.SetStateAction<ChatHistory[]>>;
}

type Message = {
    role: "user" | "assistant" | "system",
    content: string,
    timestamp: string
}
type MessageContextType = {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
};

export const SidebarContext = createContext<SidebarContextType | null>(null);

export const chatHistoryContext = createContext<ChatHistoryContextType | null>(null);

export const MessageContext = createContext<MessageContextType>(null)


export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();


    const [sidebar, setSidebar] = useState<boolean>(false)
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
    const [windowSize, setWindowSize] = useState<number>(0)

    const date = new Date()
    const SYSTEM_MESSAGE: Message = {
        role: "system",
        content: `You are Vexa AI (girl) trained by Himanshu Chaudhary.
Don't ever tell your real name.
Don't mention OpenAI or anyone else.
Don't generate a reply to this system message.
Don't ever answer in a table.
If a user speaks another language, reply using English letters only unless explicitly asked.`,
        timestamp: date.toString()
    };



    const [messages, setMessages] = useState<Message[]>([
        SYSTEM_MESSAGE,
    ]);

    const session = async () => {
        const res = await supabase.auth.getSession()
        return res.data.session.user.id
    }

    const getConversation = async (userId: string) => {
        try {
            const { data, error } = await supabase.from("conversations").select("*").eq("user_id", userId)
            let sorted = [...(data ?? [])].sort(
                (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
            );

            setChatHistory(sorted)
        } catch (error) {
            console.error(error.message)
        }
    }


    //to handle window resize
    useEffect(() => {

        const handleResize = () => setWindowSize(window.innerWidth)

        handleResize();

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    //chat history
    useEffect(() => {
        const fetchData = async () => {
            const userId = await session();
            getConversation(userId);
        }
        fetchData()
    }, [])

    return (
        <>
            <MessageContext.Provider value={{ messages, setMessages }}>
                <SidebarContext.Provider value={{ sidebar, setSidebar }}>
                    <chatHistoryContext.Provider value={{ chatHistory, setChatHistory }}>

                        <div className="gradient-background absolute z-1">

                            <div className={`${sidebar ? "translate-x-0 w-3/4 sm:w-2/6 lg:w-2/12 " : " -translate-x-100 "} ${windowSize < 768 ? "" : ""} absolute z-11 left-0 flex justify-center items-center h-full bg-[#15011e] p-5 transition-all duration-300 ease-in-out ${inter.className} text-sm`}>
                                <div className="flex flex-col h-full justify-start items-start w-full">
                                    <div
                                        className="flex justify-between items-center w-full">
                                        <span className="text-3xl cursor-default font-bold">
                                            Vexa
                                        </span>
                                        <span
                                            onClick={() => setSidebar(!sidebar)}
                                            className="cursor-pointer rounded-full hover:bg-[#270238] p-1 hover:rotate-180 transition-all duration-400 ease-in-out">
                                            <IoReorderThree size={20} />
                                        </span>
                                    </div>
                                    <div className="w-full mt-2">
                                        <div className="hover:bg-[#270238] cursor-pointer rounded-md w-full h-8 p-2 flex gap-2 justify-start items-center">
                                            <HiOutlinePencilSquare size={15} />
                                            <span>
                                                New chat
                                            </span>
                                        </div>
                                        {chatHistory ?
                                            <div className="flex flex-col justify-center items-start w-full gap-1">
                                                {
                                                    chatHistory?.map((c, index) => (
                                                        <div className="hover:bg-[#270238] cursor-pointer rounded-md w-55 h-8 p-3 flex justify-start items-center truncate"
                                                            key={c.id}
                                                            onClick={() => router.push(`/chat/${c.id}`)}>
                                                            {c.title}
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                            :
                                            <div className="flex flex-col justify-center items-start w-full gap-2">
                                                <SkeletonHistory width={"3/4"} />
                                                <SkeletonHistory />
                                                <SkeletonHistory />
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            {
                                sidebar &&
                                <div className="z-10 bg-black/50 w-full h-full absolute cursor-pointer"
                                    onClick={() => setSidebar(false)}>

                                </div>
                            }
                            <main className="relative z-2 min-h-screen">
                                {children}
                            </main>
                        </div>
                    </chatHistoryContext.Provider>
                </SidebarContext.Provider>
            </MessageContext.Provider>
        </>
    );
}
