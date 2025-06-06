"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const SentMessagesList = () => {
  const [sentMessages, setSentMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientId, setRecipientId] = useState(""); // Pour envoyer un nouveau message
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSentMessages = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations`,
        { withCredentials: true }
      );

      const allMessages = [];
      for (const conv of data.data) {
        const res = await axios.get(
          `${API_BASE_URL}/messages/conversations/${conv.id}`,
          { withCredentials: true }
        );
        const messagesSentInConv = res.data.data.filter((msg) => msg.from_me);
        allMessages.push(...messagesSentInConv);
      }

      setSentMessages(allMessages);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des messages envoyés.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!recipientId.trim() || !newMessage.trim()) {
      setError("Destinataire et message requis !");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Crée une nouvelle conversation (si besoin)
      const { data } = await axios.post(
        `${API_BASE_URL}/messages/conversations`,
        { recipientId, message: newMessage },
        { withCredentials: true }
      );

      // Ajoute le message envoyé directement à la liste
      const newSentMessage = {
        id: data.data.last_message.id,
        content: data.data.last_message.content,
        created_at: data.data.last_message.created_at,
        from_me: true,
      };
      setSentMessages((prev) => [...prev, newSentMessage]);

      // Reset input
      setNewMessage("");
      setRecipientId("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSentMessages();
  }, []);

  return (
    <div className="mx-auto rounded-lg p-4">
      <h1 className="text-2xl font-bold mb-4">Messages Envoyés</h1>

      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}

      {error && <div className="text-red-500 mb-2">{error}</div>}

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

      <div className="border-t pt-4">
        <h2 className="text-lg font-semibold mb-2">
          Envoyer un nouveau message
        </h2>
        <input
          type="text"
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
          placeholder="Recipient ID"
          className="block w-full border p-2 rounded mb-2"
        />
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Message"
          className="block w-full border p-2 rounded mb-2"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Envoyer
        </button>
      </div>
    </div>
  );
};

export default SentMessagesList;
