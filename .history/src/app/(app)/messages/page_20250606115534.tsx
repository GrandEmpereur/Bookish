"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "https://bookish-api-v2-0580441d6f39.herokuapp.com";

const MessageList = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewConvForm, setShowNewConvForm] = useState(false);
  const [recipientId, setRecipientId] = useState("");
  const [firstMessage, setFirstMessage] = useState("");

  const fetchConversations = async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations?page=1&limit=20&sort=last_message&order=desc`,
        { withCredentials: true }
      );
      setConversations(data.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des conversations.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (conversation) => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(
        `${API_BASE_URL}/messages/conversations/${conversation.id}?page=1&limit=50`,
        { withCredentials: true }
      );
      setChatMessages(data.data);

      // Marquer comme lu
      await axios.post(
        `${API_BASE_URL}/messages/conversations/${conversation.id}/read`,
        {},
        { withCredentials: true }
      );
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement des messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/messages/conversations/${selectedChat.id}/messages`,
        { content: newMessage },
        { withCredentials: true }
      );
      setChatMessages((prev) => [...prev, data.data]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi du message.");
    } finally {
      setLoading(false);
    }
  };

  const handleChatClick = (conversation) => {
    setSelectedChat(conversation);
    fetchMessages(conversation);
  };

  const handleCreateConversation = async () => {
    if (!recipientId.trim() || !firstMessage.trim()) {
      setError("Destinataire et message requis !");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/messages/conversations`,
        { recipientId, message: firstMessage },
        { withCredentials: true }
      );
      setShowNewConvForm(false);
      setRecipientId("");
      setFirstMessage("");
      await fetchConversations();
      // Ouvre directement la nouvelle conversation
      handleChatClick(data.data);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la conversation.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return (
    <div className="mx-auto rounded-lg p-4">
      {loading && (
        <div className="text-center text-gray-500">Chargement...</div>
      )}

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {selectedChat === null ? (
        <div>
          {conversations.length === 0 ? (
            <div className="text-center text-gray-500 mb-4">
              Aucune conversation trouvée.
            </div>
          ) : (
            conversations.map((c) => (
              <div
                key={c.id}
                className="flex items-center p-3 border-b last:border-b-0 cursor-pointer"
                onClick={() => handleChatClick(c)}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold">
                  🙂
                </div>
                <div className="ml-3 flex-1">
                  <div className="font-bold">
                    {c.participants[1]?.username ?? "Inconnu"}
                  </div>
                  <div className="text-gray-500 text-sm truncate">
                    {c.last_message?.content ?? "Pas de message"}
                  </div>
                </div>
                <div className="text-gray-400 text-xs">
                  {new Date(c.updated_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}

          <button
            onClick={() => setShowNewConvForm(!showNewConvForm)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            {showNewConvForm ? "Annuler" : "Nouvelle Conversation"}
          </button>

          {showNewConvForm && (
            <div className="mt-4 border p-3 rounded">
              <input
                type="text"
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="Recipient ID"
                className="block w-full border p-2 rounded mb-2"
              />
              <textarea
                value={firstMessage}
                onChange={(e) => setFirstMessage(e.target.value)}
                placeholder="Premier message"
                className="block w-full border p-2 rounded mb-2"
              />
              <button
                onClick={handleCreateConversation}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Démarrer
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-4">
          <button
            className="mb-4 text-blue-500"
            onClick={() => setSelectedChat(null)}
          >
            ← Retour
          </button>
          <h2 className="text-xl font-bold mb-4">
            {selectedChat.participants[1]?.username ?? "Inconnu"}
          </h2>
          <div className="space-y-2 mb-4">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[80%] ${
                  msg.from_me
                    ? "bg-green-100 ml-auto text-right"
                    : "bg-gray-200"
                }`}
              >
                <p>{msg.content}</p>
                <span className="text-xs text-gray-500">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrire un message..."
              className="flex-1 border rounded p-2"
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Envoyer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;
