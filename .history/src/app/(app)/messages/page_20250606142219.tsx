"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const SentMessagesList = () => {
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSentMessages = async () => {
    setLoading(true);
    setError("");

    try {
      // Récupérer toutes les conversations
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=20&sort=last_message&order=desc`,
        { withCredentials: true }
      );

      // Pour chaque conversation, récupérer les messages
      const allMessages = [];
      for (const conv of data.data) {
        const res = await axios.get(
          `${API_BASE_URL}/messages/conversations/${conv.id}?page=1&limit=50`,
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

      {sentMessages.length === 0 && !loading && (
        <div className="text-center text-gray-500">
          Aucun message envoyé trouvé.
        </div>
      )}

      <div className="space-y-2">
        {sentMessages.map((msg) => (
          <div key={msg.id} className="p-3 border rounded bg-green-100">
            <p className="font-semibold">{msg.content}</p>
            <span className="text-xs text-gray-500">
              {new Date(msg.created_at).toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentMessagesList;
