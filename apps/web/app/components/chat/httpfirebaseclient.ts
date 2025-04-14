import { db } from "@/utils/firebase";
import {
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { User } from "../../types/user";

export async function createOrUpdateChat(sender: User, receiver: User, message: string, imageUrl = null) {
  const senderId = String(sender.id);
  const receiverId = String(receiver.id);
  console.log(receiverId);
  const chatId = [senderId, receiverId].sort().join("_");

  // Correct document references for chats
  const senderChatRef = doc(db, "user", senderId, "chats", chatId);
  const receiverChatRef = doc(db, "user", receiverId, "chats", chatId);

  // Determine what to show as the last message preview
  let previewMessage = message;
  if (!message && imageUrl) {
    previewMessage = "Image";
  }

  const chatData = {
    participants: [sender, receiver],
    lastMessage: previewMessage,
    lastSender: senderId,
    updatedAt: serverTimestamp(),
  };

  // Add image URL to chat data if present
  if (imageUrl) {
    //@ts-ignore
    chatData.lastImageUrl = imageUrl;
  }

  const senderChatSnap = await getDoc(senderChatRef);

  if (!senderChatSnap.exists()) {
    await Promise.all([
      setDoc(senderChatRef, {
        ...chatData,
        createdAt: serverTimestamp(),
      }),
      setDoc(receiverChatRef, {
        ...chatData,
        createdAt: serverTimestamp(),
      }),
    ]);
  } else {
    await Promise.all([
      updateDoc(senderChatRef, chatData),
      updateDoc(receiverChatRef, chatData),
    ]);
  }

  const messageData = {
    senderId: senderId,
    text: message || "",
    timestamp: serverTimestamp(),
  };

  // Add image URL to message data if present
  if (imageUrl) {
    //@ts-ignore
    messageData.imageUrl = imageUrl;
  }

  // Correct collection references for messages
  const senderMsgRef = collection(db, "user", senderId, "chats", chatId, "messages");
  const receiverMsgRef = collection(db, "user", receiverId, "chats", chatId, "messages");

  await Promise.all([
    addDoc(senderMsgRef, messageData),
    addDoc(receiverMsgRef, messageData),
  ]);

  return chatId;
}