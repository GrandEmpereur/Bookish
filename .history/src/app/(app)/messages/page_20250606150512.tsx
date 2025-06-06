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
  const [sentMessages, setSentMessages] = useState([]);

  // Récupérer tous les messages envoyés
  const fetchSentMessages = async () => {
    setLoading(true);
    setError("");

    try {
      console.log("Récupération des conversations...");
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        { withCredentials: true }
      );
      console.log("Conversations récupérées:", data.data);

      const allMessages = [];

      for (const conv of data.data) {
        console.log("Récupération des messages pour la conversation:", conv.id);

        const res = await axios.get(
          `${API_BASE_URL}/messages/conversations/${conv.id}`,
          { withCredentials: true }
        );

        console.log("Messages récupérés pour", conv.id, ":", res.data.data);

        const messagesSentInConv = res.data.data.filter((msg) => msg.from_me);
        console.log(
          "Messages envoyés pour la conversation",
          conv.id,
          ":",
          messagesSentInConv
        );

        allMessages.push(...messagesSentInConv);
      }

      console.log("Tous les messages envoyés:", allMessages);
      setSentMessages(allMessages);
    } catch (err) {
      console.error("Erreur lors de la récupération des messages:", err);
      setError("Erreur lors du chargement des messages envoyés.");
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle conversation
  const handleCreateConversation = async () => {
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

      console.log("Conversation créée avec succès:", data);

      // Ajoute le message envoyé directement à la liste
      const newSentMessage = {
        id: data.data.id,
        content: data.data.content,
        created_at: data.data.createdAt,
        from_me: true,
      };

      setSentMessages((prev) => [...prev, newSentMessage]);
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

  // Charger les messages envoyés au montage
  useEffect(() => {
    fetchSentMessages();
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
        onClick={handleCreateConversation}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Envoyer
      </button>

      <h2 className="text-lg font-semibold mt-6 mb-2">Messages envoyés</h2>
      <div className="space-y-2 mb-4">
        {sentMessages.length === 0 && !loading ? (
          <div className="text-center text-gray-500">
            Aucun message envoyé trouvé.
          </div>
        ) : (
          sentMessages.map((msg) => (
            <div key={msg.id} className="p-3 border rounded bg-green-100">
              <p className="font-semibold">{msg.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
