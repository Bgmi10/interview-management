"use client";

import { MessagesSquareIcon } from "lucide-react";
import { useContext, useEffect } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { ThemeContext } from "../../../context/ThemeContext";
import { db } from "@/utils/firebase";
import { useAuth } from "../../../context/AuthContext";

export default function ChatWidget() {
    const { isChatOpen, setIsChatOpen } = useContext(ThemeContext);
    const { user } = useAuth();

    console.log(user);
    
    useEffect(() => {

        if (isChatOpen) {
            db
        }
       
    }, [isChatOpen]);

    return (
       <>
          {isChatOpen &&
            <div className="fixed right-4 z-50 w-80 h-96 bg-white border rounded-lg shadow-2xl bottom-1 border-none">
                <div className="flex justify-between p-2 bg-gradient-to-r from-blue-400 to-blue-600 text-lg font-semibold text-white">
                    <span className="flex gap-1">
                        <MessagesSquareIcon /> 
                        <span>Messages</span>
                    </span>
                    <FaAngleDown onClick={() => setIsChatOpen(false)} className="cursor-pointer" />
                </div>
            </div>}
        </> 
    );
}
