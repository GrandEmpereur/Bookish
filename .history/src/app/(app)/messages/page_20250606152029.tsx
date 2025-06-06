"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const MessagesPage = () => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);

  // Récupérer la liste des conversations avec seulement le dernier message
  const fetchConversations = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Récupération des conversations...");
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        { withCredentials: true }
      );

      const convs = data.data.map((conv) => ({
        id: conv.id,
        recipientId: conv.participants[1]?.id,
        recipientUsername: conv.participants[1]?.username || "Inconnu",
        lastMessage: conv.last_message?.content || "Aucun message",
        updatedAt: conv.updated_at,
      }));

      console.log("Conversations:", convs);
      setConversations(convs);
    } catch (err) {
      console.error("Erreur lors de la récupération des conversations:", err);
      setError("Erreur lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  };

  // Charger tous les messages d'une conversation
  const loadConversationMessages = async (conversation) => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations/${conversation.id}`,
        { withCredentials: true }
      );

      console.log("Messages de la conversation:", data.data);
      setConversationMessages(data.data);
      setSelectedConversation(conversation);
    } catch (err) {
      console.error("Erreur lors du chargement de la conversation:", err);
      setError("Erreur lors du chargement de la conversation.");
    } finally {
      setLoading(false);
    }
  };

  // Envoyer un nouveau message
  const handleSendMessage = async () => {
    if (!recipientId.trim() || !message.trim()) {
      setError("Destinataire et message requis !");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/messages`,
        { recipientId, content: message },
        { withCredentials: true }
      );

      console.log("Message envoyé:", data);

      // Rafraîchir la liste des conversations
      await fetchConversations();

      setSuccessMessage("Message envoyé avec succès !");
      setRecipientId("");
      setMessage("");
    } catch (err) {
      console.error("Erreur lors de l’envoi du message:", err);

      if (err.response?.status === 404) {
        setError("Destinataire non trouvé (404). Vérifie l’UUID !");
      } else if (err.response?.status === 422) {
        setError(
          "Erreur 422: Données invalides. Vérifie l’UUID et le contenu !"
        );
      } else {
        setError("Erreur lors de la création de la conversation.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="mx-auto rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>

      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-2">{successMessage}</div>
      )}

      {/* Saisie d'un nouveau message */}
      <h2 className="text-lg font-semibold mb-2">Envoyer un nouveau message</h2>
      <input
        type="text"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        placeholder="Recipient ID"
        className="block w-full border p-2 rounded mb-2"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Message"
        className="block w-full border p-2 rounded mb-2"
      />
      <button
        onClick={handleSendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Envoyer
      </button>

      {/* Liste des conversations */}
      <h2 className="text-lg font-semibold mt-6 mb-2">Vos Conversations</h2>
      {conversations.length === 0 && !loading ? (
        <div className="text-center text-gray-500">
          Aucune conversation trouvée.
        </div>
      ) : (
        conversations.map((conv) => (
          <div
            key={conv.id}
            className="p-3 border rounded mb-2 bg-gray-100 cursor-pointer"
            onClick={() => loadConversationMessages(conv)}
          >
            <p className="font-bold">{conv.recipientUsername}</p>
            <p className="text-sm text-gray-700 truncate">{conv.lastMessage}</p>
            <span className="text-xs text-gray-500">
              {new Date(conv.updatedAt).toLocaleString()}
            </span>
          </div>
        ))
      )}

      {/* Fenêtre de conversation */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h2 className="text-lg font-bold mb-2">
              Conversation avec {selectedConversation.recipientUsername}
            </h2>
            <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
              {conversationMessages.map((msg) => (
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
