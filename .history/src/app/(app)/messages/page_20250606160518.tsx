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
          conversationId: sortedMessages[0].conversationId || null, // ⚠️ à vérifier que tu as ça dans les données
        };
      });

      setConversations(conversationsList);
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

  // ✅ Supprimer la conversation
  const handleDeleteConversation = async (conv) => {
    if (!conv.conversationId) {
      alert("Impossible de supprimer : conversationId manquant !");
      return;
    }

    if (!window.confirm("Confirmer la suppression de cette conversation ?")) {
      return;
    }

    try {
      await axios.delete(
        `${API_BASE_URL}/messages/conversations/${conv.conversationId}`,
        { withCredentials: true }
      );
      // Retire la conversation de l’état
      setConversations((prev) =>
        prev.filter((c) => c.user.id !== conv.user.id)
      );
      if (selectedConversation?.user.id === conv.user.id) {
        setSelectedConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      alert("Erreur lors de la suppression.");
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Messagerie</h1>

      {/* Liste des conversations */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Conversations</h2>
        {loading && <div>Chargement...</div>}
        {conversations.map((conv) => (
          <div
            key={conv.user.id}
            className={`flex justify-between items-center p-3 border rounded mb-2 cursor-pointer ${
              selectedConversation?.user.id === conv.user.id
                ? "bg-blue-100"
                : "bg-gray-100"
            }`}
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
            <button
              onClick={() => handleDeleteConversation(conv)}
              className="bg-red-500 text-white px-2 py-1 rounded ml-2"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Conversation complète */}
      {selectedConversation && (
        <div className="p-3 border rounded bg-white">
          <h2 className="text-lg font-bold mb-2">
            Conversation avec {selectedConversation.user.username}
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
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
