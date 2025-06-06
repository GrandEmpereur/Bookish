"use client";
import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const CreateConversation = () => {
  const [recipientId, setRecipientId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleCreateConversation = async () => {
    if (!recipientId.trim() || !message.trim()) {
      setError("Destinataire et message requis !");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log("Envoi d’une nouvelle conversation à:", recipientId);
      console.log("Contenu du message:", message);

      const { data } = await axios.post(
        `${API_BASE_URL}/messages`,
        { recipientId, message },
        { withCredentials: true }
      );

      console.log("Conversation créée avec succès:", data);
      setSuccessMessage("Conversation créée avec succès !");
      setRecipientId("");
      setMessage("");
    } catch (err) {
      console.error("Erreur lors de la création de la conversation:", err);

      if (err.response?.status === 404) {
        setError(
          "Destinataire non trouvé (404). Vérifie l’UUID du destinataire !"
        );
      } else {
        setError("Erreur lors de la création de la conversation.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Créer une Conversation</h1>

      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {successMessage && (
        <div className="text-green-500 mb-2">{successMessage}</div>
      )}

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
        placeholder="Premier message"
        className="block w-full border p-2 rounded mb-2"
      />
      <button
        onClick={handleCreateConversation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Créer Conversation
      </button>
    </div>
  );
};

export default CreateConversation;
