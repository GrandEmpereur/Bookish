"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  // 🔥 Récupérer les conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE_URL}/messages/`, {
        withCredentials: true,
      });

      const messagesData = data.data;
      const convMap = {};

      messagesData.forEach((msg) => {
        const partner =
          msg.senderId === "01974528-69d6-716c-a5ef-0def322094e6"
            ? msg.recipient
            : msg.sender;

        if (!convMap[partner.id]) {
          convMap[partner.id] = {
            user: partner,
            messages: [],
          };
        }

        convMap[partner.id].messages.push(msg);
      });

      const conversationsList = Object.values(convMap).map((conv) => {
        const sortedMessages = conv.messages.sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        return {
          user: conv.user,
          messages: sortedMessages,
          lastMessage: sortedMessages[sortedMessages.length - 1],
        };
      });

      setConversations(conversationsList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Quand on clique sur une conversation
  const loadConversation = (conv) => {
    setSelectedConversation(conv);
    setMessages(conv.messages);
  };

  // 🔥 Envoyer un message
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

  // 🔥 Pour les 3 points (archiver/supprimer – désactivés ici)
  const toggleMenu = (convId) => {
    setOpenMenuId((prev) => (prev === convId ? null : convId));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="p-4">
      {!selectedConversation ? (
        // 🔥 Liste des conversations
        <>
          <h1 className="text-2xl font-bold mb-4">Messagerie</h1>
          {loading && <div>Chargement...</div>}
          {conversations.map((conv) => (
            <div
              key={conv.user.id}
              className="flex justify-between items-center p-3 border rounded mb-2 bg-gray-100 cursor-pointer"
            >
              <div onClick={() => loadConversation(conv)} className="flex-1">
                <p className="font-bold">{conv.user.username}</p>
                <p className="text-sm text-gray-700 truncate">
                  {conv.lastMessage.content}
                </p>
                <span className="text-xs text-gray-500">
                  {new Date(conv.lastMessage.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="relative ml-2">
                <button
                  onClick={() => toggleMenu(conv.user.id)}
                  className="text-gray-500 px-2"
                >
                  ⋮
                </button>
                {openMenuId === conv.user.id && (
                  <div className="absolute right-0 bg-white border rounded shadow z-10">
                    <button
                      className="block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      disabled
                    >
                      Archiver
                    </button>
                    <button
                      className="block px-4 py-2 text-sm text-red-500 w-full text-left"
                      disabled
                    >
                      Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        // 🔥 Conversation en plein écran
        <div className="flex flex-col h-full pt-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => setSelectedConversation(null)}
              className="text-blue-500"
            >
              ← Retour
            </button>
            <h2 className="text-lg font-bold">
              Conversation avec {selectedConversation.user.username}
            </h2>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto mb-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded ${
                  msg.senderId === "01974528-69d6-716c-a5ef-0def322094e6"
                    ? "bg-green-100 text-right ml-auto"
                    : "bg-gray-200"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="flex space-x-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Votre message..."
              className="flex-1 border rounded p-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
