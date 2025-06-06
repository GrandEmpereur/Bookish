"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔥 Récupérer les messages et regrouper par conversation
  const fetchMessagesAndGroupConversations = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`${API_BASE_URL}/messages/`, {
        withCredentials: true,
      });

      console.log("Messages récupérés:", data.data);

      const messages = data.data;

      // 🔥 Crée un objet { userId: [messages] } pour regrouper
      const convMap = {};

      messages.forEach((msg) => {
        // Identifie le "partenaire de conversation"
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

      // 🔥 Transforme en tableau et trie les messages par date
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

      console.log("Conversations regroupées:", conversationsList);
      setConversations(conversationsList);
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessagesAndGroupConversations();
  }, []);

  return (
    <div className="mx-auto rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Vos Conversations</h1>

      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* Liste des conversations */}
      {conversations.length === 0 && !loading ? (
        <div className="text-center text-gray-500">
          Aucune conversation trouvée.
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.user.id}
            className="p-3 border rounded mb-2 bg-gray-100 cursor-pointer"
            onClick={() => setSelectedConversation(conv)}
          >
            <p className="font-bold">{conv.user.username}</p>
            <p className="text-sm text-gray-700 truncate">
              {conv.lastMessage.content}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(conv.lastMessage.createdAt).toLocaleString()}
            </span>
          </div>
        ))
      )}

      {/* Fenêtre de conversation */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">
              Conversation avec {selectedConversation.user.username}
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {selectedConversation.messages.map((msg) => (
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
            <button
              onClick={() => setSelectedConversation(null)}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessagesPage;
