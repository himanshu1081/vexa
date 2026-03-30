import { useParams, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import { SidebarContext } from "../app/chat/layout";
import { createPortal } from "react-dom";
import { motion } from "framer-motion"
// icons
import { BsThreeDots } from "react-icons/bs";
import { MdOutlineDeleteForever } from "react-icons/md";
import { GoPencil } from "react-icons/go";
import { supabase } from "../lib/supabase";

const HistoryList = ({ clickedId, t }) => {
    const router = useRouter();
    const { chatid } = useParams();
    const { setSidebar } = useContext(SidebarContext);
    const [title, setTitle] = useState<string>(t);
    const [threeDots, setThreeDots] = useState(false);
    const [renameBox, setRenameBox] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [menuPos, setMenuPos] = useState({ x: 0, y: 0 });

    const redirectPage = () => {
        if (showOptions) return;
        router.push(`/chat/${clickedId}`);
    };
    const existingTitle: string = t;
    const handleRenameTitle = (e) => {
        setTitle(e.target.value)
    }
    const newTitleSave = async () => {
        if (title.trim() === "" || title === null || title === existingTitle) return
        const { error } = await supabase.from("conversations").update({ title: title }).eq("id", clickedId)
        setRenameBox(false)
        if (error) {
            console.log(error.message)
        }
    }

    return (
        <div
            onMouseEnter={() => setThreeDots(true)}
            onMouseLeave={() => setThreeDots(false)}
            onClick={redirectPage}
            className={`flex justify-between items-center p-2 gap-4 rounded-md cursor-pointer
        hover:bg-[#00ff0d]/20
        ${clickedId == chatid ? "bg-[#00ff0d]/10" : ""}`}
        >
            <div className="line-clamp-1 flex-1">
                {title}
            </div>

            <div
                className={`${threeDots || clickedId == chatid ? "block" : "hidden"}`}
                onClick={(e) => {
                    e.stopPropagation();

                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPos({
                        x: rect.right + 8,
                        y: rect.top,
                    });

                    setShowOptions(true);
                }}
            >
                <BsThreeDots />
            </div>

            {showOptions &&
                createPortal(
                    <motion.div
                        initial={{ x: -20, y: -20, opacity: 0 }}
                        animate={{ x: 0, y: 0, opacity: 1 }}
                        className="fixed inset-0 z-999 text-sm"
                        onClick={() => setShowOptions(false)}
                    >
                        <div
                            className="absolute bg-[#242424] p-2 rounded-md"
                            style={{
                                top: menuPos.y,
                                left: menuPos.x,
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                onClick={() => { setRenameBox(true), setShowOptions(false) }}
                                className="flex gap-2 items-center p-2 px-4 hover:bg-[#181818] rounded-md cursor-pointer">
                                <GoPencil />
                                <span>Rename</span>
                            </div>

                            <div className="flex gap-2 items-center p-2 px-4 text-red-500 hover:bg-[#181818] rounded-md cursor-pointer">
                                <MdOutlineDeleteForever />
                                <span>Delete</span>
                            </div>
                        </div>
                    </motion.div>,
                    document.body
                )}


            {/* Rename Box */}
            {renameBox &&
                createPortal(
                    <div className="fixed inset-0 w-screen h-screen z-9999 bg-black/20 flex items-center justify-center"
                        onClick={() => setRenameBox(false)}>
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="h-fit w-fit flex flex-col items-center justify-center gap-4 bg-[#242424] text-black rounded-md p-5">
                            <div className="flex flex-col gap-4 justify-center items-center">
                                <div className="w-full p-2 text-3xl font-inter font-bold whitespace-nowrap text-white">
                                    Rename Title
                                </div>
                                <input
                                    className="w-full p-2 bg-amber-50  rounded-md"
                                    type="text"
                                    value={title}
                                    onChange={(e) => handleRenameTitle(e)} />
                                <div className="flex items-center justify-around w-full">
                                    <span
                                        onClick={() => setRenameBox(false)}
                                        className="rounded-md  bg-white/90 border border-black/50 px-4 p-2 text-xs cursor-pointer hover:bg-white">
                                        Cancel
                                    </span>
                                    <span
                                        onClick={newTitleSave}
                                        className="rounded-md  bg-red-500/90 border border-black/50 px-4 text-white p-2 text-xs cursor-pointer hover:bg-red-500">
                                        Save
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    , document.body
                )
            }
        </div>
    );
};

export default HistoryList;
