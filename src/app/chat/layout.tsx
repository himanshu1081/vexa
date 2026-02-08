"use client"
import "../../styles/background.css";
import SkeletonHistory from "../../components/SkeletonHistory";
import { useState, useEffect, createContext } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import { Inter, Instrument_Sans } from "next/font/google";

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



export const SidebarContext = createContext<SidebarContextType | null>(null);

export const chatHistoryContext = createContext<ChatHistoryContextType | null>(null);

export const UserInfoContext = createContext<any>(null);

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const router = useRouter();
    const [sidebar, setSidebar] = useState<boolean>(false)
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([])
    const [windowSize, setWindowSize] = useState<number>(0)
    const [userInfo, setUserInfo] = useState<any>();

    const session = async () => {
        const res = await supabase.auth.getSession()
        if (res?.data?.session == null) {
            router.push("/auth/login")
        }
        setUserInfo(res?.data?.session?.user)
        console.log(res?.data?.session?.user)
        return res?.data?.session?.user?.id
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
            console.log(userId)
            getConversation(userId);
        }
        fetchData()
    }, [])

    return (
        <>
            <UserInfoContext value={{ userInfo }}>
                <SidebarContext.Provider value={{ sidebar, setSidebar }}>
                    <chatHistoryContext.Provider value={{ chatHistory, setChatHistory }}>

                        <div className="gradient-background absolute z-1">

                            {/* <div className={`${sidebar ? "translate-x-0 w-3/4 sm:w-2/6 lg:w-2/12 " : " -translate-x-100 w-0 "} ${windowSize < 768 ? "" : ""} absolute z-11 left-0 flex justify-center items-center h-screen bg-[#181818]
 py-5 transition-all duration-300 ease-in-out ${inter.className} text-sm border-r border-gray-600/30`}>
                            <div className="flex flex-col justify-between h-full items-start w-full px-2">
                                <div className="flex flex-col w-full px-2">
                                    <div
                                        className="flex justify-between items-center w-full">
                                        <span className="text-3xl cursor-default font-bold">
                                            Vexa
                                        </span>
                                        <span
                                            onClick={() => setSidebar(!sidebar)}
                                            className="cursor-pointer rounded-full hover:bg-[#242424] p-1 hover:rotate-180 transition-all duration-400 ease-in-out">
                                            <IoReorderThree size={20} />
                                        </span>
                                    </div>
                                    <div
                                        onClick={() => {
                                            setSidebar(false)
                                            router.push('/chat')
                                        }}
                                        className="hover:bg-[#242424] cursor-pointer rounded-md w-full h-8 flex gap-2 justify-start items-center">
                                        <HiOutlinePencilSquare size={20}
                                        />
                                        <span>
                                            New chat
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs p-2 text-white/60">
                                    Chat History
                                </div>
                                <div className="w-full flex-1 mt-2 overflow-x-auto hide-scrollbar rounded-md">
                                    {(chatHistory.length !== 0) ?
                                        <div className=" inset-shadow-2xs bg-[#181818]">
                                            {
                                                chatHistory?.map((c, index) => (
                                                    <div key={c.id}>
                                                        <HistoryList clickedId={c.id} title={c.title} />
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        :
                                        <div className="flex flex-col justify-center items-start w-full h-fit gap-2">
                                            <SkeletonHistory />
                                            <SkeletonHistory />
                                            <SkeletonHistory width={"3/4"} />
                                        </div>
                                    }
                                </div>
                                <div className="p-2">
                                    Himanshu Chaudhary
                                </div>
                            </div>
                        </div> */}
                            {/* {
                            sidebar &&
                            <div className="z-10 bg-black/50 w-full h-full absolute cursor-pointer"
                                onClick={() => setSidebar(false)}>

                            </div>
                        } */}
                            <main className="relative z-2 min-h-screen">
                                {children}
                            </main>
                        </div>
                    </chatHistoryContext.Provider>
                </SidebarContext.Provider>
            </UserInfoContext>

        </>
    );
}
