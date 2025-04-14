"use client";

import { Loader, MessagesSquareIcon, Send, ArrowLeft, Image as ImageIcon, X, Phone, Video, MoreVertical } from "lucide-react";
import { useContext, useEffect, useState, useRef } from "react";
import { FaAngleDown } from "react-icons/fa6";
import { ThemeContext } from "../../../context/ThemeContext";
import { db } from "@/utils/firebase";
import { useAuth } from "../../../context/AuthContext";
import { createOrUpdateChat } from "./httpfirebaseclient";
import { uploadToS3 } from "@/utils/s3";
import { format } from "date-fns";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  getDocs
} from "firebase/firestore";

interface Message {
  id: string,
  timestamp: { seconds: number, nanoseconds: number },
  text: string,
  senderId: string,
  imageUrl?: string
}

interface ChatPreview {
  id: string,
  lastMessage: string,
  lastSender: string,
  updatedAt: { seconds: number, nanoseconds: number },
  participants: any[],
  lastImageUrl?: string
}

export default function ChatWidget() {
  const { isChatOpen, setIsChatOpen, selectedCandidate, setSelectedCandidate } = useContext(ThemeContext);
  const [recruitermessage, setRecruiterMessage] = useState("");
  const { user } = useAuth();
  const [isMessageSent, setIsMessageSent] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [allChats, setAllChats] = useState<ChatPreview[]>([]);
  const [viewingChatList, setViewingChatList] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [newCandidateChat, setNewCandidateChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Fetch all chats for the current user
  useEffect(() => {
    if (!isChatOpen || !user) return;

    //@ts-ignore
    const chatsRef = collection(db, "user", String(user.id), "chats");
    const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as ChatPreview[];
      
      // Sort chats by latest message
      chatsData.sort((a, b) => {
        return b.updatedAt?.seconds - a.updatedAt?.seconds;
      });
      
      setAllChats(chatsData);
    });

    return () => unsubscribe();
  }, [isChatOpen, user]);

  // Fetch messages for the selected chat and determine if it's a new chat
  useEffect(() => {
    if (!isChatOpen || !user || (!selectedCandidate && !viewingChatList)) return;

    if (selectedCandidate) {
        //@ts-ignore
      const chatId = [String(user.id), String(selectedCandidate.id)].sort().join("_");
      //@ts-ignore
      const msgRef = collection(db, "user", String(user.id), "chats", chatId, "messages");
      const q = query(msgRef, orderBy("timestamp", "asc"));

      const unSubscribe = onSnapshot(q, (snapShot) => {
        const msgs = snapShot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        })) as Message[];
        
        setMessages(msgs);
        setNewCandidateChat(msgs.length === 0);
        
        // Focus input field for new chats
        //@ts-ignore
        if (msgs.length === 0 && inputRef.current && user.role === "Recruiter") {
          setTimeout(() => {
            inputRef.current?.focus();
          }, 300);
        }
      });

      return () => unSubscribe();
    }
  }, [isChatOpen, user, selectedCandidate, viewingChatList]);

  // Scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async() => {
    if ((!recruitermessage.trim() && !selectedImage) || !selectedCandidate) return;
    
    setIsMessageSent(true);
    let imageUrl = null;

    try {
      // Upload image if selected
      if (selectedImage) {
        setIsUploading(true);
        imageUrl = await uploadToS3(selectedImage);
        setIsUploading(false);
      }

      // Send message with optional image
      //@ts-ignore
      await createOrUpdateChat(user, selectedCandidate, recruitermessage, imageUrl);
      
      // Clear input and image preview
      setRecruiterMessage("");
      setSelectedImage(null);
      setImagePreviewUrl(null);
      
      // Update new chat status
      setNewCandidateChat(false);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsMessageSent(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const selectChat = (chatId: string) => {
    const chat = allChats.find(c => c.id === chatId);
    if (chat) {
      // Find the other participant (not the current user)
      //@ts-ignore
      const otherParticipant = chat.participants.find(p => String(p.id) !== String(user.id));
      setSelectedCandidate(otherParticipant);
      setViewingChatList(false);
    }
  };

  const goBackToChats = () => {
    setViewingChatList(true);
    setSelectedCandidate(null);
    setNewCandidateChat(false);
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Format date for profile display
  const formatJoinDate = (timestamp: { seconds: number }) => {
    if (!timestamp || !timestamp.seconds) return "Recently joined";
    return `Joined ${format(new Date(timestamp.seconds * 1000), "MMMM yyyy")}`;
  };
  
  return (
    <>
      {isChatOpen && (
        <div className="fixed right-4 z-50 w-80 h-96 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border rounded-lg shadow-2xl bottom-1 border-none overflow-hidden">
          {/* Header */}
          <div className="flex justify-between p-2 bg-gradient-to-r from-blue-400 to-blue-600 dark:bg-gray-700 text-lg font-semibold text-white">
            <span className="flex gap-1 items-center">
              {!viewingChatList && (
                <ArrowLeft 
                  onClick={goBackToChats} 
                  className="cursor-pointer mr-2" 
                  size={18} 
                />
              )}
              <MessagesSquareIcon size={18} /> 
              <span>{viewingChatList ? "Conversations" : "Messages"}</span>
            </span>
            <FaAngleDown onClick={() => setIsChatOpen(false)} className="cursor-pointer" />
          </div>

          {!newCandidateChat && viewingChatList ? (
            <div className="overflow-y-auto h-80 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
              {!newCandidateChat && allChats.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center p-4">
                  <p className="text-gray-500 dark:text-gray-400">
                    
                    {
                    //@ts-ignore
                    user.role === "Recruiter" 
                      ? "No conversations yet. Select a candidate to start chatting." 
                      : "No conversations yet. Recruiters will contact you here."}
                  </p>
                </div>
              ) : (
                !newCandidateChat && allChats.map(chat => {
                    //@ts-ignore
                  const otherParticipant = chat.participants.find(p => String(p.id) !== String(user.id));
                  const time = chat?.updatedAt?.seconds 
                    ? format(new Date(chat.updatedAt.seconds * 1000), "MMM d") 
                    : "";
                    //@ts-ignore
                  const lastMessageSender = chat.lastSender === String(user.id) ? "You: " : "";
                  const hasImage = chat.lastImageUrl ? "📷 " : "";
                  
                  return (
                    <div 
                      key={chat.id} 
                      className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => selectChat(chat.id)}
                    >
                      <img 
                        src={otherParticipant?.profilePic || "/default-avatar.png"} 
                        className="h-10 w-10 rounded-full object-cover"
                        alt={`${otherParticipant?.firstName || 'User'}'s avatar`}
                      />
                      <div className="ml-3 flex-1 overflow-hidden">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-800 dark:text-white">
                            {otherParticipant?.firstName} {otherParticipant?.lastName}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {time}
                          </span>
                        </div>
                        <p className="text-sm truncate text-gray-600 dark:text-gray-300">
                          {lastMessageSender}{hasImage}{chat.lastMessage || (hasImage ? "Image" : "")}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            <>
              {/* Conversation Header */}
              {selectedCandidate && (
                <div className="flex gap-2 p-2 items-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-white">
                  <img 
                    src={selectedCandidate.profilePic || "/default-avatar.png"} 
                    className="h-10 w-10 rounded-full object-cover"
                    alt={`${selectedCandidate.firstName}'s avatar`}
                  />
                  <div className="flex flex-col flex-1">
                    <span className="text-xl text-gray-700 dark:text-white">
                      {selectedCandidate.firstName} {selectedCandidate.lastName}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {selectedCandidate.role === "Candidate" ? "Candidate" : "Recruiter"}
                    </span>
                  </div>
                  {
                  //@ts-ignore
                  user.role === "Recruiter" && !newCandidateChat && (
                    <div className="flex gap-1">
                      <MoreVertical size={18} className="cursor-pointer text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              )}

              {/* New Chat Profile View */}
              {newCandidateChat && selectedCandidate && (
                <div className="flex flex-col items-center p-4 bg-white dark:bg-gray-800">
                  <img 
                    src={selectedCandidate?.profilePic || "/default-avatar.png"} 
                    className="h-20 w-20 rounded-full object-cover mb-2"
                    alt={`${selectedCandidate?.firstName}'s avatar`}
                  />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {selectedCandidate.firstName} {selectedCandidate.lastName}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatJoinDate(selectedCandidate.createdAt)}
                  </p>
                   
                  <div className="w-full mt-4 px-2 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {
                        //@ts-ignore
                      user.role === "Recruiter" 
                        ? "Start a conversation with this candidate" 
                        : "Wait for recruiter to start conversation"}
                    </p>
                  </div>
                </div>
              )}

              {/* Messages */}
              {!newCandidateChat && (
                <div className="overflow-y-auto p-2 h-60 bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        No messages yet. {
                        //@ts-ignore
                        user.role === "Recruiter" ? "Start the conversation!" : ""}
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const time = msg?.timestamp?.seconds 
                        ? format(new Date(msg.timestamp.seconds * 1000), "p") 
                        : "";
                        //@ts-ignore
                      const isCurrentUser = msg.senderId === String(user.id);
                      
                      return (
                        <div
                          key={msg.id}
                          className={`flex mb-2 items-end ${isCurrentUser ? "justify-end" : "justify-start"}`}
                        >
                          {!isCurrentUser && (
                            <img 
                              src={selectedCandidate?.profilePic || "/default-avatar.png"}
                              className="h-6 w-6 rounded-full mr-1"
                              alt="Avatar"
                            />
                          )}
                          <div className="max-w-[70%] flex flex-col">
                            <div 
                              className={`px-3 py-2 rounded-lg ${
                                isCurrentUser 
                                  ? "rounded-tr-none bg-blue-500 dark:bg-blue-600 text-white" 
                                  : "rounded-tl-none bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
                              }`}
                            >
                              {msg.imageUrl && (
                                <div className="mb-2">
                                  <img 
                                    src={msg.imageUrl} 
                                    alt="Shared image" 
                                    className="rounded-md max-w-full max-h-32 object-contain"
                                  />
                                </div>
                              )}
                              {msg.text}
                            </div>
                            <span className={`text-xs text-gray-500 dark:text-gray-400 ${isCurrentUser ? 'text-right' : 'text-left'} mt-1`}>
                              {time}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}

              {/* Image Preview */}
              {imagePreviewUrl && (
                <div className="px-2 pb-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <div className="relative inline-block mt-2">
                    <img 
                      src={imagePreviewUrl} 
                      alt="Selected image" 
                      className="h-16 w-auto rounded object-cover"
                    />
                    <button 
                      onClick={removeSelectedImage}
                      className="absolute -top-2 -right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-1"
                    >
                      <X size={14} className="text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                </div>
              )}

              {/* Message Input - Show based on role permissions */}
              <div className={`absolute bottom-0 w-full p-2 bg-white dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 ${
                //@ts-ignore
                user.role !== "Recruiter" && newCandidateChat ? "hidden" : ""}`}>
                <div className="flex items-center">
                  <button 
                    onClick={triggerFileInput} 
                    className="p-2 text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full"
                    disabled={isUploading}
                  >
                    <ImageIcon size={20} />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                    disabled={isUploading}
                  />
                  <input 
                    type="text" 
                    ref={inputRef}
                    placeholder={newCandidateChat ? "Say hello..." : "Type a message"} 
                    className="p-2 rounded-xl outline-none bg-gray-100 dark:bg-gray-600 dark:text-white flex-1 mx-1"
                    onChange={(e) => setRecruiterMessage(e.target.value)} 
                    value={recruitermessage}
                    onKeyPress={handleKeyPress}
                    disabled={isUploading}
                  />
                  {isMessageSent || isUploading ? (
                    <Loader className="animate-spin text-blue-400" size={20} />
                  ) : (
                    <button onClick={handleSendMessage} className="p-1" disabled={isUploading}>
                      <Send className="text-blue-500 dark:text-blue-400" size={20} />
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </> 
  );
}