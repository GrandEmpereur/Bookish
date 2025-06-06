"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer toutes les conversations (avec dernier message)
  const fetchConversations = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Récupération des conversations...");
      const { data } = await axios.get(`${API_BASE_URL}/messages/`, {
        withCredentials: true,
      });

      console.log("Conversations récupérées:", data.data);

      // On suppose que l’API renvoie un tableau d’objets conversation
      setConversations(data.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des conversations:", err);
      setError("Erreur lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  };

  // Sélectionner une conversation pour afficher ses messages
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  useEffect(() => {
    fetchConversations();
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
            key={conv.id}
            className="p-3 border rounded mb-2 bg-gray-100 cursor-pointer"
            onClick={() => handleSelectConversation(conv)}
          >
            <p className="font-bold">{conv.recipient?.username || "Inconnu"}</p>
            <p className="text-sm text-gray-700 truncate">
              {conv.lastMessage?.content || "Aucun message"}
            </p>
            <span className="text-xs text-gray-500">
              {new Date(conv.updatedAt).toLocaleString()}
            </span>
          </div>
        ))
      )}

      {/* Fenêtre de la conversation */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">
              Conversation avec{" "}
              {selectedConversation.recipient?.username || "Inconnu"}
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`p-2 rounded ${
                    msg.from_me
                      ? "bg-green-100 text-right ml-auto"
                      : "bg-gray-200"
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleString()}
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
