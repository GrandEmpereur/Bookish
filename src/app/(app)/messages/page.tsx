"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiSend, FiPaperclip } from "react-icons/fi";

// CONSTANTES
const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";
const currentUserId = "01974528-69d6-716c-a5ef-0def322094e6";

// TYPES
interface User {
  id: string;
  username: string;
}

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  createdAt: string;
  sender?: User;
  recipient?: User;
}

interface Conversation {
  user: User;
  messages: Message[];
  lastMessage: Message;
}

// COMPONENT
const MessagesPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const response = await axios.get<{ data: Message[] }>(
        `${API_BASE_URL}/messages/`,
        {
          withCredentials: true,
        }
      );

      const convMap: Record<string, { user: User; messages: Message[] }> = {};

      response.data.data.forEach((msg) => {
        const partner =
          msg.senderId === currentUserId ? msg.recipient : msg.sender;
        if (!partner) return;

        if (!convMap[partner.id]) {
          convMap[partner.id] = {
            user: partner,
            messages: [],
          };
        }

        convMap[partner.id].messages.push(msg);
      });

      const convList: Conversation[] = Object.values(convMap).map((conv) => {
        const sortedMessages = conv.messages.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return {
          user: conv.user,
          messages: sortedMessages,
          lastMessage: sortedMessages[sortedMessages.length - 1],
        };
      });

      setConversations(convList);
    } catch (err) {
      console.error("Erreur lors du chargement des conversations:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = (conv: Conversation) => {
    setSelectedConversation(conv);
    setMessages(conv.messages || []);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const tempId = `temp-${Date.now()}`;
    const messageToSend: Message = {
      id: tempId,
      content: newMessage,
      senderId: currentUserId,
      recipientId: selectedConversation.user.id,
      createdAt: new Date().toISOString(),
    };

    try {
      await axios.post(
        `${API_BASE_URL}/messages`,
        {
          recipientId: selectedConversation.user.id,
          content: newMessage,
        },
        { withCredentials: true }
      );

      setMessages((prev) => [...prev, messageToSend]);

      setConversations((prev) =>
        prev.map((conv) =>
          conv.user.id === selectedConversation.user.id
            ? {
                ...conv,
                lastMessage: messageToSend,
                messages: [...conv.messages, messageToSend],
              }
            : conv
        )
      );

      setNewMessage("");
    } catch (err) {
      console.error("Erreur lors de l'envoi du message:", err);
    }
  };

  return (
    <div className="pt-[100px] px-4 pb-4 flex flex-col h-screen bg-white">
      {!selectedConversation ? (
        <div className="flex-1 overflow-y-auto">
          {loading && <div>Chargement...</div>}
          {conversations.map((conv) => (
            <div
              key={conv.user.id}
              onClick={() => loadConversation(conv)}
              className="flex items-center justify-between py-3 border-b cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {conv.user.username?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold">{conv.user.username}</p>
                  <p className="text-gray-500 text-sm truncate max-w-[200px]">
                    {conv.lastMessage?.content || ""}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {conv.lastMessage?.createdAt &&
                  new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 py-3 mb-2">
            <button
              onClick={() => setSelectedConversation(null)}
              className="text-gray-700 text-2xl"
            >
              <FiArrowLeft />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                {selectedConversation.user.username?.[0]?.toUpperCase()}
              </div>
              <h2 className="font-semibold text-lg">
                {selectedConversation.user.username}
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] p-2 rounded-xl text-sm ${
                  msg.senderId === currentUserId
                    ? "ml-auto bg-green-100"
                    : "bg-gray-100"
                }`}
              >
                <p>{msg.content}</p>
                <span className="block text-xs text-gray-400 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-3 mt-2 border-t mb-[130px]">
            <button className="text-gray-400">
              <FiPaperclip size={18} />
            </button>
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-1 px-3 py-2 rounded-full bg-gray-100 focus:outline-none"
            />
            <button
              onClick={handleSendMessage}
              className="text-green-500 font-semibold"
            >
              <FiSend size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
