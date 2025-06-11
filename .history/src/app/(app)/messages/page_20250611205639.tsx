"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiArrowLeft, FiSend, FiPaperclip } from "react-icons/fi";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";
const currentUserId = "01974528-69d6-716c-a5ef-0def322094e6";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/messages/`, {
        withCredentials: true,
      });

      const convMap = {};
      data.data.forEach((msg) => {
        const partner =
          msg.senderId === currentUserId ? msg.recipient : msg.sender;

        if (!convMap[partner.id]) {
          convMap[partner.id] = {
            user: partner,
            messages: [],
          };
        }

        convMap[partner.id].messages.push(msg);
      });

      const convList = Object.values(convMap).map((conv) => {
        const sorted = conv.messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        return {
          user: conv.user,
          messages: sorted,
          lastMessage: sorted[sorted.length - 1],
        };
      });

      setConversations(convList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadConversation = (conv) => {
    setSelectedConversation(conv);
    setMessages(conv.messages);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;
    try {
      await axios.post(
        `${API_BASE_URL}/messages`,
        { recipientId: selectedConversation.user.id, content: newMessage },
        { withCredentials: true }
      );
      setNewMessage("");
      await fetchConversations();
      const updatedConv = conversations.find(
        (c) => c.user.id === selectedConversation.user.id
      );
      loadConversation(updatedConv);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="pt-[100px] px-4 pb-4 flex flex-col h-auto bg-white">
      {!selectedConversation ? (
        <div className="flex-1">
          <h1 className="text-xl font-semibold mb-4">Messages</h1>
          {loading && <div>Chargement...</div>}
          {conversations.map((conv) => (
            <div
              key={conv.user.id}
              onClick={() => loadConversation(conv)}
              className="flex items-center justify-between py-3 border-b cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  {conv.user.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold">{conv.user.username}</p>
                  <p className="text-gray-500 text-sm truncate max-w-[200px]">
                    {conv.lastMessage.content}
                  </p>
                </div>
              </div>
              <span className="text-xs text-gray-400">
                {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      ) : (
        // Conversation plein écran
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
                {selectedConversation.user.username[0].toUpperCase()}
              </div>
              <h2 className="font-semibold text-lg">
                {selectedConversation.user.username}
              </h2>
            </div>
          </div>

          {/* Messages */}
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

          {/* Input */}
          <div className="flex items-center gap-2 pt-3 mt-2 border-t">
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
