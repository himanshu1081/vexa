//icons
import { HiOutlinePencilSquare } from "react-icons/hi2";
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useParams, useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SidebarContext } from "../app/chat/layout";

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



const HistoryList = ({ clickedId, title }) => {

    const router = useRouter();
    const [options, setOptions] = useState<boolean>(false)
    const [showOptions, setShowOptions] = useState<boolean>(false)
    const { chatid } = useParams();
    const { setSidebar } = useContext(SidebarContext)

    const redirectPage = () => {
        router.push(`/chat/${clickedId}`)
    }

    return (
        <div
            onMouseEnter={() => setOptions(true)}
            onMouseLeave={() => setOptions(false)}
            onClick={redirectPage}
            className={`flex justify-between items-center p-2 hover:bg-[#00ff0d]/20 cursor-pointer gap-4 rounded-md ${clickedId == chatid ? "bg-[#00ff0d]/10" : ""}`}>
            <div
                className="line-clamp-1 flex-1">
                {title}
            </div>
            <div className={`${options || (clickedId == chatid) ? "block" : "hidden"}`}
                onClick={() => setShowOptions(!showOptions)}
            >
                <BsThreeDots />
            </div>
        </div>
    )
}

export default HistoryList