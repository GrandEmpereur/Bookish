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

  const fetchConversations = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Récupération des conversations...");
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        { withCredentials: true }
      );

      const allConversations = [];

      for (const conv of data.data) {
        // Récupérer tous les messages
        const res = await axios.get(
          `${API_BASE_URL}/messages/conversations/${conv.id}`,
          { withCredentials: true }
        );

        // Messages envoyés par l’utilisateur
        const messagesSent = res.data.data.filter((msg) => msg.from_me);

        if (messagesSent.length > 0) {
          // Crée la conversation
          allConversations.push({
            recipientId: messagesSent[0].recipient_id,
            recipientUsername: messagesSent[0].recipient?.username || "Inconnu",
            messages: messagesSent.map((msg) => ({
              id: msg.id,
              content: msg.content,
              created_at: msg.created_at,
            })),
          });
        }
      }

      console.log("Conversations avec messages envoyés:", allConversations);
      setConversations(allConversations);
    } catch (err) {
      console.error("Erreur lors de la récupération:", err);
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!recipientId.trim() || !message.trim()) {
      setError("Destinataire et message requis !");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Envoi à:", API_BASE_URL + "/messages");
      console.log("Données envoyées:", { recipientId, content: message });

      const { data } = await axios.post(
        `${API_BASE_URL}/messages`,
        { recipientId, content: message },
        { withCredentials: true }
      );

      console.log("Message envoyé:", data);

      // Ajoute le message à la conversation correspondante
      setConversations((prev) => {
        const updated = [...prev];
        const index = updated.findIndex((c) => c.recipientId === recipientId);

        if (index !== -1) {
          // Ajoute à la conversation existante
          updated[index].messages.push({
            id: data.data.id,
            content: data.data.content,
            created_at: data.data.createdAt,
          });
        } else {
          // Crée une nouvelle conversation
          updated.push({
            recipientId,
            recipientUsername: data.data.recipient?.username || "Inconnu",
            messages: [
              {
                id: data.data.id,
                content: data.data.content,
                created_at: data.data.createdAt,
              },
            ],
          });
        }
        return updated;
      });

      setSuccessMessage("Message envoyé avec succès !");
      setRecipientId("");
      setMessage("");
    } catch (err) {
      console.error("Erreur lors de l’envoi:", err);

      if (err.response?.status === 404) {
        setError("Destinataire non trouvé (404). Vérifie l’UUID !");
      } else if (err.response?.status === 422) {
        setError(
          "Erreur 422: Données invalides. Vérifie l’UUID et le contenu !"
        );
      } else {
        setError("Erreur lors de l’envoi.");
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
      <h1 className="text-2xl font-bold mb-4">Page Messages</h1>

      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-2">{successMessage}</div>
      )}

      <h2 className="text-lg font-semibold mb-2">Envoyer un message</h2>
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

      <h2 className="text-lg font-semibold mt-6 mb-2">Conversations</h2>
      {conversations.length === 0 && !loading ? (
        <div className="text-center text-gray-500">
          Aucune conversation trouvée.
        </div>
      ) : (
        conversations.map((conv, i) => (
          <div key={i} className="p-3 border rounded mb-2 bg-gray-100">
            <p className="font-bold mb-1">Avec : {conv.recipientUsername}</p>
            <div className="space-y-1">
              {conv.messages.map((msg) => (
                <div key={msg.id} className="p-2 rounded bg-green-100 text-sm">
                  <p>{msg.content}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(msg.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessagesPage;
